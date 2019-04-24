import { Component } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { BackendService, TaskData } from '../backend.service';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { MatSnackBar, MatDialog } from '@angular/material';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { CreateTagDialog } from '../dialogs/dialogs.module'
import { Tag } from '../app.module'
import { formatDate } from '@angular/common';
import { StateService } from '../state.service';

const MINUTES_TO_SECONDS: number = 60;
const HOURS_TO_SECONDS: number = 3600;

@Component({
  selector: 'app-create-task',
  templateUrl: './create-task.component.html',
  styleUrls: ['./create-task.component.css']
})
export class CreateTaskComponent {
  tags: Tag[] = [];
  prio_tags: Tag[] = [];
  selectedTags: Tag[] = [];

  public rawTagsForm: FormControl = new FormControl();
  public filteredTags: Observable<Tag[]>;
  private currDate: Date = new Date();

  public task: FormGroup = new FormGroup({
    title: new FormControl(''),
    body: new FormControl(''),
    priority: new FormControl(0),
    completeDate: new FormControl({ value: new Date(), disabled: 'true' }),
    estimatedMin: new FormControl(0),
    estimatedHour: new FormControl(0),
    tags: new FormControl({ value: '', disabled: 'true' })
  });

  private gotPrediction: boolean = false;
  private prediction: string = "";
  private taskData: TaskData = null;


  constructor(private backend: BackendService,
    private auth: AuthService,
    private router: Router,
    private snackbar: MatSnackBar,
    public create_dialog: MatDialog,
    private state: StateService
  ) {

    /* used to set a min date for datepicker, for some reason sets min 
     * to previous day so have to add one to the current date.
     */
    this.currDate.setDate(this.currDate.getDate() + 1);

    //retrieve tags for display
    this.loadData();
  }

  loadData() {
    if (this.state.teamId != 0) {
      this.getTeamTags();
    } else {
      this.getUserTags();
    }
  }

  public onSubmit() {
    if (this.gotPrediction) {
      this.createTask();
    }
    else {
      this.getPrediction();
      this.gotPrediction = true;
    }
  }

  public getPrediction() {
    //initialize TaskData object
    let td: TaskData = {
      actualDuration: 0, //always zero to start
      expDuration: (this.task.controls['estimatedMin'].value * MINUTES_TO_SECONDS) + (this.task.controls['estimatedHour'].value * HOURS_TO_SECONDS), //convert sum of estimations to seconds,
      tags: this.parseTagArray(this.selectedTags, false) //list of tag NAMES (not IDs)
    };

    //need to get UUID of user or team then send request to get prediction
    if (this.state.teamId != 0) {
      this.backend.getUUID(this.state.teamId, false).subscribe(UUID => {
        this.backend.getPrediction(UUID, td).subscribe(prediction => {
          console.log('prediction from ML module: ' + prediction);
          this.prediction = prediction;
          if (prediction != "NaN") {
            this.displayPrediction(prediction);
          }
        });
      });
    }
    else {
      this.backend.getUUID(this.auth.getUserId(), true).subscribe(UUID => {
        this.backend.getPrediction(UUID, td).subscribe(prediction => {
          console.log('prediction from ML module: ' + prediction);
          this.prediction = prediction;
          if (prediction != "NaN") {
            this.displayPrediction(prediction);
          }
        });
      });
    }

  }

  public displayPrediction(prediction: string) {

  }

  public createTask() {
    //handle priority
    this.getPrioTag(this.task.controls['priority'].value);

    let task: any = {
      title: this.task.controls['title'].value,
      body: this.task.controls['body'].value,
      estimatedMin: this.task.controls['estimatedMin'].value,
      estimatedHour: this.task.controls['estimatedHour'].value,
      completeDate: formatDate(this.task.controls['completeDate'].value, 'yyyy-MM-dd', 'en-US'), //format Date for backend
      expDuration: (this.task.controls['estimatedMin'].value * MINUTES_TO_SECONDS) + (this.task.controls['estimatedHour'].value * HOURS_TO_SECONDS), //convert sum of estimations to seconds
      tags: this.parseTagArray(this.selectedTags, true),//list of tagIDs
      userID: this.auth.getUserId(),
      team: this.state.teamId
    }

    if (task.estimatedMin == 0 && task.estimatedHour == 0) {
      let snackbarRef = this.snackbar.open('Must have non zero time estimation.', 'Ok', { duration: 3000 });
      return;

    }

    this.backend.createTask(task).subscribe(res => {
      //three second snackbar pop up notification
      let snackbarRef = this.snackbar.open('Task Created!', 'Ok', { duration: 3000 });

      this.router.navigateByUrl('/home');
    }, error => {
      console.log(error.message);
      //three second snackbar pop up notification
      let snackbarRef = this.snackbar.open('Oh no, something went wrong!', 'Ok', { duration: 3000 });
    });
  }

  public getUserTags() {
    this.backend.getUserTags(this.auth.getUserId()).subscribe(result => {
      //result is list of all tags, need to separate out prio tags
      this.sortTagsIntoLists(result);

      //set up autofill for tags
      this.filteredTags = this.rawTagsForm.valueChanges
        .pipe(
          startWith(''),
          map(tag => tag ? this._filterTags(tag) : this.tags.slice())
        );

    });
  }

  public getTeamTags() {
    this.backend.getTeamTags(this.state.teamId).subscribe(result => {
      //result is list of all tags, need to separate out prio tags
      console.log('now in create-task');
      console.log(result);
      this.sortTagsIntoLists(result);

      //set up autofill for tags
      this.filteredTags = this.rawTagsForm.valueChanges
        .pipe(
          startWith(''),
          map(tag => tag ? this._filterTags(tag) : this.tags.slice())
        );

    });
  }

  public sortTagsIntoLists(rawList: Tag[]) {
    //empty lists first
    this.tags = [];
    this.prio_tags = [];

    rawList.forEach(tag => {
      if (tag.name.includes('priority')) {
        //add to prio list
        this.prio_tags.push(tag);
      } else {
        //add to regular tag list
        this.tags.push(tag);
      }
    });
  }

  public getPrioTag(prio_num: number) {
    //if no prio was selected, return;
    if (prio_num === 0) return;

    //else find prio with the given number, then add it to the list of selected tags
    this.prio_tags.some(function (pt) {
      if (pt.name.includes('' + prio_num)) {
        this.selectedTags.push(pt);
        return true;
      }
    }, this);
  }

  public createNewTag() {

    const dialogRef = this.create_dialog.open(CreateTagDialog, {
      width: '250px',
      data: { name: '', desc: '', color: "#c4c4c4" }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        //check if tag already exists under given name
        let exists: boolean = false;
        this.tags.forEach(element => {
          if (element.name === result.name) {
            //notify user
            let snackbarRef = this.snackbar.open('You already have a tag with that name!', 'Ok', { duration: 3000 });

            //mark flag
            exists = true;
          }
        });

        if (exists) //if tag already exists, don't create a new one
          return;

        //construct Tag object with input values
        let newTag: Tag = {
          id: 1,    //this value is arbitrary and will not be saved in the DB
          name: result.name,
          description: result.desc,
          tasks_comp: 0,
          average_time: 0,
          average_acc: 0,
          task_overunder: 0,
          color: result.color,
          userID: this.auth.getUserId(),
          team: this.state.teamId
        }

        //send data to backend
        this.backend.createTag(newTag).subscribe(result => {

          //three second snackbar pop up notification
          let snackbarRef = this.snackbar.open('Tag Created! You can now add it to the list of tags.', 'Ok', { duration: 3000 });

          //update tags
          this.loadData();

        }, error => {
          console.log(error.message);
          //three second snackbar pop up notification
          let snackbarRef = this.snackbar.open('Oh no, something went wrong!', 'Ok', { duration: 3000 });
        });
      }
    });
  }

  private _filterTags(value: string): Tag[] {
    const filterValue = value.toLowerCase();

    return this.tags.filter(tag => tag.name.toLowerCase().indexOf(filterValue) === 0);
  }

  public onCancel() {
    this.router.navigateByUrl('/home');
  }

  public onTagSelect(tag: Tag) {
    var index = this.selectedTags.indexOf(tag); //get index of tag in list (if it exists)
    if (index === -1) {
      this.selectedTags.push(tag);
    }
    else { //if it is already in the list, we will remove it
      this.selectedTags.splice(index, 1);
    }

    //update form control value
    this.task.controls['tags'].setValue(''); //empty field first
    this.selectedTags.forEach(tag => {
      this.task.controls['tags'].setValue(this.task.controls['tags'].value + '/ ' + tag.name);
    });
  }

  //helper mehtod to get TagIDs from list of tags
  parseTagArray(tags: Tag[], intoIDs: boolean): any[] {
    if (intoIDs) {
      let arr: number[] = [];

      tags.forEach(tag => {
        arr.push(tag.id);
      });

      return arr;
    }
    else { // parse into comma-separated list of names
      let arr: string[] = [];

      tags.forEach(tag => {
        arr.push(tag.name);
      });

      return arr;
    }
  }
}
