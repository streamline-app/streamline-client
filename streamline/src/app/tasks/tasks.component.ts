import { Component, OnInit } from '@angular/core';
import { BackendService } from '../backend.service';
import { AuthService } from '../auth.service';
import { MatSnackBar, MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { DeleteConfirmDialog, EditTaskDialog, AddTagDialog } from '../dialogs/dialogs.module';
import { Tag, Task } from '../app.module'

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent implements OnInit {

  tasks: Task[] = [];

  constructor(private backend: BackendService,
    private auth: AuthService,
    private snackbar: MatSnackBar,
    private router: Router,
    private create_dialog: MatDialog
  ) {
    //update tasks display
    this.getUserTasks();
  }

  ngOnInit() { }

  getUserTasks() {
    //clear list first
    this.tasks = [];

    this.backend.getUserTasks(this.auth.getUserId()).subscribe(result => {
      console.log('retrieved tasks:');
      console.log(result);
      //window.alert('Got Tags');

      //set display to show result
      result.forEach(e => {
        if (!e.isFinished) { //only add if not finished
          this.tasks.push(e);

          //get tags for each task
          this.getTaskTags(e.id);

        }
      });


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
      data: { title: task.title, body: task.body, workedDuration: task.workedDuration, estimatedHour: task.estimatedHour, estimatedMin: task.estimatedMin, expDuration: task.expDuration }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        //check if task already exists under given name
        let exists: boolean = false;
        if (result.title != task.title) { //if new tag name given is different from the old one
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

        this.backend.editTask(task.id, result).subscribe(res => {
          console.log('tag ' + task.id + ' udpated');

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


}


