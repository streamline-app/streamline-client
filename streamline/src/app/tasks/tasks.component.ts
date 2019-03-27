import { Component, OnInit } from '@angular/core';
import { BackendService } from '../backend.service';
import { AuthService } from '../auth.service';
import { MatSnackBar, MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { DeleteConfirmDialog, EditTaskDialog, AddTagDialog } from '../dialogs/dialogs.module';
import { Tag, Task } from '../app.module'
import { formatDate } from '@angular/common';
import { StateService } from '../state.service';
import { Observable } from 'rxjs';
import { FormControl } from '@angular/forms';
import { startWith, map } from 'rxjs/operators';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent {

  private tasks: Task[] = [];
  private unfilteredTasks: Task[]; //used to save list of tasks
  private sort_by: number = 0;
  private rawTagsForm: FormControl = new FormControl();
  private filteredTags: Observable<Tag[]>; //used by html with ngFor
  private tags: Tag[];
  public displayMessage = 'Your Tasks';

  constructor(private backend: BackendService,
    private auth: AuthService,
    private snackbar: MatSnackBar,
    private router: Router,
    private create_dialog: MatDialog,
    private state: StateService
  ) {

    this.state.dataViewChange.subscribe((val) => {
      this.loadData();
      if (this.state.teamId != 0) {
        this.displayMessage = this.state.teamName+'\'s Tasks';
      } else {
        this.displayMessage = 'Your tasks';
      }
    })
    //update tasks display
    this.loadData();
    
    if (this.state.teamId != 0) {
      this.displayMessage = this.state.teamName+'\'s Tasks';
    }


  }

  loadData() {
    if (this.state.teamId != 0) {
      this.getTeamTasks();
      this.getTeamTags();
    } else {
      this.getUserTasks();
      this.getUserTags();
    }
  }

  getTeamTags() {
    this.backend.getTeamTags(this.state.teamId).subscribe(res => {
      if (res != null) {
        this.tags = res;
        //set up autofill for tags
        this.filteredTags = this.rawTagsForm.valueChanges
          .pipe(
            startWith(''),
            map(tag => tag ? this._filterTags(tag) : this.tags.slice())
          );
      }
      else {
        console.log('Could not retrieve tags');
      }
    })
  }

  getUserTags() {
    this.backend.getUserTags(this.auth.getUserId()).subscribe(res => {
      if (res != null) {
        this.tags = res;
        //set up autofill for tags
        this.filteredTags = this.rawTagsForm.valueChanges
          .pipe(
            startWith(''),
            map(tag => tag ? this._filterTags(tag) : this.tags.slice())
          );
      }
      else {
        console.log('Could not retrieve tags');
      }
    })
  }

  getTeamTasks() {
    console.log('we are in team tasks');
    this.tasks = [];

    this.backend.getTeamTasks(this.state.teamId).subscribe((result) => {
      console.log(result);
      this.tasks = result as Task[];
      result.forEach(e => {
        if (!e.isFinished) { //only add if not finished
          //this.tasks.push(e);
          this.getTaskTags(e.id);

        }
        //clear tag filter
        this.rawTagsForm.setValue('');
        //save list in case of filtering
        this.unfilteredTasks = this.tasks;
      });

      //check sort option
      switch (this.sort_by) {
        case 0:   //no sort
          break;
        case 1:   //prio
          this.sortbyPrio();
          break;
        case 2:   //creation_date
          this.sortbyCreationDate();
          break;
        default:
          break;
      }
    }, error => {
      console.log(error.message);
      //three second snackbar pop up notification
      let snackbarRef = this.snackbar.open('Oh no, something went wrong!', 'Ok', { duration: 3000 });
    });
  }

  getUserTasks() {
    //clear list first
    this.tasks = [];

    this.backend.getUserTasks(this.auth.getUserId()).subscribe(result => {
      console.log('retrieved tasks:');
      console.log(result);
      //window.alert('Got Tags');

      //set display to show result
      this.tasks = result as Task[];
      result.forEach(e => {
        if (!e.isFinished) { //only add if not finished
          //get tags for each task
          this.getTaskTags(e.id);

        }

        //clear tag filter
        this.rawTagsForm.setValue('');

        //save list in case of filtering
        this.unfilteredTasks = this.tasks;

      });

      //check sort option
      switch (this.sort_by) {
        case 0:   //no sort
          break;
        case 1:   //prio
          this.sortbyPrio();
          break;
        case 2:   //creation_date
          this.sortbyCreationDate();
          break;
        default:
          break;
      }

    }, error => {
      console.log(error.message);
      //three second snackbar pop up notification
      let snackbarRef = this.snackbar.open('Oh no, something went wrong!', 'Ok', { duration: 3000 });
    });
  }

  getTaskTags(taskID: number) {
    this.backend.getTaskTags(taskID).subscribe(res => {
      console.log('tags retrieved for task ' + taskID + ':');
      console.log(res);

      var count = 0;
      this.tasks.forEach(t => {
        if (t.id === taskID) {
          this.tasks[count].tags = res;
        }
        count++;
      });

    });
  }

  removeTag(taskID: number, tagID: number) {
    const dialogRef = this.create_dialog.open(DeleteConfirmDialog, {
      width: '325px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) { //if confirmed, delete
        this.backend.removeTag(taskID, tagID).subscribe(res => {
          console.log('TagID ' + tagID + ' removed From TaskID' + taskID);

          //three second snackbar pop up notification
          let snackbarRef = this.snackbar.open('Tag removed from that task!', 'Ok', { duration: 3000 });

          //reload tags
          this.getTaskTags(taskID);
        },
          error => {
            console.log(error.message);
            //three second snackbar pop up notification
            let snackbarRef = this.snackbar.open('Oh no, something went wrong!', 'Ok', { duration: 3000 });
          });
      }
      else { /* do nothing */ }
    });
  }

  addTag(task: Task) {
    const dialogRef = this.create_dialog.open(AddTagDialog, {
      width: '325px',
      data: { tagID: -1, userID: this.auth.getUserId() }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result >= 0) {
        var tagID = result;
        let exists: boolean = false;
        console.log(task.tags);

        task.tags.forEach(t => {
          if (t.id === tagID) { //if this task already has that tag, don't add it
            //three second snackbar pop up notification
            let snackbarRef = this.snackbar.open('That Task already has that Tag!', 'Ok', { duration: 3000 });
            exists = true;
          }
        });

        if (!exists) {
          this.backend.addTag(task.id, tagID).subscribe(res => {
            //three second snackbar pop up notification
            let snackbarRef = this.snackbar.open('Tag added to that Task!', 'Ok', { duration: 3000 });

            this.getTaskTags(task.id);
          },
            error => {
              console.log(error.message);
              //three second snackbar pop up notification
              let snackbarRef = this.snackbar.open('Oh no, something went wrong!', 'Ok', { duration: 3000 });
            }
          );
        }
      }
      else { /* do nothing for now */ }
    });
  }

  deleteTask(task: Task) {
    const dialogRef = this.create_dialog.open(DeleteConfirmDialog, {
      width: '325px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) { //if confirmed, delete
        this.backend.deleteTask(task.id).subscribe(res => {
          console.log(res);

          //three second snackbar pop up notification
          let snackbarRef = this.snackbar.open('Task deleted!', 'Ok', { duration: 3000 });

          //reload tasks
          this.getUserTasks();
        },
          error => {
            console.log(error.message);
            //three second snackbar pop up notification
            let snackbarRef = this.snackbar.open('Oh no, something went wrong!', 'Ok', { duration: 3000 });
          });
      }
      else { /*do nothing */ }
    });
  }

  editTask(task: Task) {
    let dialogRef = this.create_dialog.open(EditTaskDialog, {
      width: '400px',
      data: {
        title: task.title,
        body: task.body,
        workedDuration: task.workedDuration,
        estimatedHour: task.estimatedHour,
        estimatedMin: task.estimatedMin,
        expDuration: task.expDuration,
        priority: task.priority,
        completeDate: task.completeDate
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        //check if task already exists under given name
        let exists: boolean = false;
        if (result.title != task.title) { //if new task name given is different from the old one
          this.tasks.forEach(element => { //check to make sure it doesn't match any other tag names
            if (element.title === result.title) {
              //notify user
              let snackbarRef = this.snackbar.open('You already have a task with that name!', 'Ok', { duration: 3000 });

              //mark flag
              exists = true;
            }
          });
        }

        if (exists) { //if it already exists, don't make a new one
          return;
        }

        //format Date into string for backend
        result.completeDate = formatDate(result.completeDate, 'yyyy-MM-dd', 'en-US');

        this.backend.editTask(task.id, result).subscribe(res => {
          console.log('task ' + task.id + ' updated');

          //three second snackbar pop up notification
          let snackbarRef = this.snackbar.open('Task Updated!', 'Ok', { duration: 3000 });

          //update display
          this.getUserTasks();
        },
          error => {
            console.log(error.message);
            //three second snackbar pop up notification
            let snackbarRef = this.snackbar.open('Oh no, something went wrong!', 'Ok', { duration: 3000 });
          });
      }
      else { /* do nothing */ }
    })
  }

  startTask(taskID: number, index: number) {
    this.backend.startTask(taskID).subscribe(res => {

      //update that task only
      this.backend.getTask(taskID).subscribe(r => {
        this.tasks[index] = r;
      },
        error => {

        });

      //three second snackbar pop up notification
      let snackbarRef = this.snackbar.open('Task Started!', 'Ok', { duration: 3000 });

    }, error => {
      console.log(error.message);
      //three second snackbar pop up notification
      let snackbarRef = this.snackbar.open('Oh no, something went wrong!', 'Ok', { duration: 3000 });
    });
  }

  stopTask(taskID: number, index: number) {
    this.backend.stopTask(taskID).subscribe(res => {
      //update that task only
      this.backend.getTask(taskID).subscribe(r => {
        this.tasks[index] = r;
      },
        error => {

        });
      //three second snackbar pop up notification
      let snackbarRef = this.snackbar.open('Task Stopped!', 'Ok', { duration: 3000 });

    }, error => {
      console.log(error.message);
      //three second snackbar pop up notification
      let snackbarRef = this.snackbar.open('Oh no, something went wrong!', 'Ok', { duration: 3000 });
    });
  }

  finishTask(taskID: number, index: number) {
    this.backend.finishTask(taskID).subscribe(res => {

      //remove task from list
      this.tasks.splice(index, 1);

      //three second snackbar pop up notification
      let snackbarRef = this.snackbar.open('Task Finished!', 'Ok', { duration: 3000 });

    }, error => {
      console.log(error.message);
      //three second snackbar pop up notification
      let snackbarRef = this.snackbar.open('Oh no, something went wrong!', 'Ok', { duration: 3000 });
    });
  }

  getMinutes(seconds: number): number {
    var hrs = 0;
    if (seconds > 3600)
      hrs = Math.floor(seconds / 3600);

    var min = (seconds - (hrs * 3600)) / 60;
    return Math.floor(min);
  }

  getHours(seconds: number): number {
    if (seconds > 3600)
      return Math.floor(seconds / 3600);
    else
      return 0;
  }

  sortbyPrio() {
    this.sort_by = 1;
    this.tasks.sort(function (a: Task, b: Task) {
      return b.priority - a.priority; //sort from highest to lowest
    });
  }

  sortbyCreationDate() {
    this.sort_by = 2;
    this.tasks.sort(function (a: Task, b: Task) {
      return new Date(a.created_at).getTime() - new Date(b.created_at).getTime(); //sort from first to last
      //for some reason we have to instantiate another Date object for getTime() to work
    });

  }

  public onTagSelect(tagName: string) {
    this.rawTagsForm.setValue(tagName); //set value of autocomplete

    //clear list of tasks, add only ones with queried tag
    this.tasks = [];
    this.unfilteredTasks.forEach(t => {
      t.tags.forEach(e => {
        if(e.name === tagName){ //if tag is somewhere in the tasks list of tags
          this.tasks.push(t);
        }
      });
      
    });
  }

  public onClearSelect(){
    //set list of tasks to equal unfiltered array
    this.tasks = this.unfilteredTasks;

    //clear tag filter
    this.rawTagsForm.setValue('');
  }

  private _filterTags(value: string): Tag[] {
    const filterValue = value.toLowerCase();

    return this.tags.filter(tag => tag.name.toLowerCase().indexOf(filterValue) === 0);
  }

  collapse(id) {
    var content = document.getElementById('content_' + id).style;
    if (content.display == "block") {
      content.display = "none";
    } else {
      content.display = "block"
    }
  }

  onCreatePressed() {
    this.router.navigateByUrl('create/task');
  }

  _formatDate(d: Date): string { //special function to format date for UI
    return formatDate(d, 'MMMM dd, yyyy', 'en-US');
  }
}

