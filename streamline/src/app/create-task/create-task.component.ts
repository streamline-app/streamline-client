import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { BackendService } from '../backend.service';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { MatSnackBar, MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';


@Component({
  selector: 'app-create-task',
  templateUrl: './create-task.component.html',
  styleUrls: ['./create-task.component.css']
})
export class CreateTaskComponent {
  tags: Tag[];
  selectedTags: Tag[];

  faketag1: Tag;
  faketag2: Tag;

  public rawTagsForm: FormControl = new FormControl();
  public filteredTags: Observable<Tag[]>;

  public task: FormGroup = new FormGroup({
    title: new FormControl(''),
    body: new FormControl(''),
    estimatedMin: new FormControl(0),
    estimatedHour: new FormControl(0),
    tags: new FormControl({ value: '', disabled: 'true' })
  });

  constructor(private backend: BackendService,
    private auth: AuthService,
    private router: Router,
    private snackbar: MatSnackBar,
    public create_dialog: MatDialog,
  ) {
    this.faketag1 =
      {
        id: 1,
        name: 'fake1',
        description: 'fake desc',
        tasks_comp: 0,
        average_time: 0,
        average_acc: 0,
        task_overunder: 0,
        color: '#c4c4c4',
        userID: 1
      }
    this.faketag2 =
      {
        id: 2,
        name: 'fake2',
        description: 'another fake desc',
        tasks_comp: 0,
        average_time: 0,
        average_acc: 0,
        task_overunder: 0,
        color: '#e00000',
        userID: 1
      }
    //this.tags = [this.faketag1, this.faketag2];
    this.tags = [];
    this.selectedTags = [];
    this.getTags();
  }


  public onSubmit() {
    let task: any = {
      title: this.task.controls['title'].value,
      body: this.task.controls['body'].value,
      estimatedMin: this.task.controls['estimatedMin'].value,
      estimatedHour: this.task.controls['estimatedHour'].value,
      tags: this.parseTagArray(this.selectedTags),//list of tagIDs
      userID: this.auth.getUserId()
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

  public getTags() {
    this.backend.getUserTags(this.auth.getUserId()).subscribe(result => {
      this.tags = result;

      //set up autofill for tags
      this.filteredTags = this.rawTagsForm.valueChanges
        .pipe(
          startWith(''),
          map(tag => tag ? this._filterTags(tag) : this.tags.slice())
        );

    });
  }

  public createNewTag() {

    const dialogRef = this.create_dialog.open(TaskCreateTagDialog, {
      width: '250px',
      data: { name: '', desc: '', color: "#c4c4c4" }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        //check if tag already exists under given name
        let exists : boolean = false;
        this.tags.forEach(element => {
          if(element.name === result.name){
            //notify user
            let snackbarRef = this.snackbar.open('You already have a tag with that name!', 'Ok', { duration: 3000 });

            //mark flag
            exists = true;
          }
        });

        if(exists) //if tag already exists, don't create a new one
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
          userID: this.auth.getUserId()
        }

        console.log(newTag);
        //send data to backend
        this.backend.createTag(newTag).subscribe(result => {

          //three second snackbar pop up notification
          let snackbarRef = this.snackbar.open('Tag Created! You can now add it to the list of tags.', 'Ok', { duration: 3000 });

          //update tags
          this.getTags();

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
    console.log('before: ');
    console.log(this.selectedTags);
    var index = this.selectedTags.indexOf(tag); //get index of tag in list (if it exists)
    console.log('index: ' + index);
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
    console.log('after: ');
    console.log(this.selectedTags);
  }

  //helper mehtod to get TagIDs from list of tags
  parseTagArray(tags: Tag[]): number[] {
    let arr: number[] = [];

    tags.forEach(tag => {
      arr.push(tag.id);
    });

    return arr;
  }
}




@Component({
  selector: 'task-create-tag/task-create-tag-dialog',
  templateUrl: 'task-create-tag/task-create-tag-dialog.html',
})
export class TaskCreateTagDialog {

  constructor(public dialogRef: MatDialogRef<TaskCreateTagDialog>,
    @Inject(MAT_DIALOG_DATA) public data: CreateTagDialogData) {

  }

  createTag() {
    //close the dialog, data will be returned to parent component
    this.dialogRef.close(this.data);
  }

  closeDiag() {
    //return to parent component, result will be undefined
    this.dialogRef.close();
  }
}

interface Tag {
  id: number,
  name: string,
  description: string,
  tasks_comp: number,
  average_time: number,
  average_acc: number,
  task_overunder: number,
  color: string,
  userID: number
};

export interface CreateTagDialogData {
  name: string,
  desc: string,
  color: string
};