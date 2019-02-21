import { Component, OnInit, Inject } from '@angular/core';
import { BackendService } from '../backend.service';
import { AuthService } from '../auth.service';
import { MatSnackBar, MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { DeleteConfirmDialog } from '../dialogs/dialogs.module';

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
    this.backend.getUserTasks(this.auth.getUserId()).subscribe(result => {
      console.log('retrieved tasks:');
      console.log(result);
      //window.alert('Got Tags');

      //set display to show result
      this.tasks = result;

      //get tags for each task
      this.getTaskTags();

    }, error => {
      console.log(error.message);
      //three second snackbar pop up notification
      let snackbarRef = this.snackbar.open('Oh no, something went wrong!', 'Ok', { duration: 3000 });
    });
  }

  getTaskTags() {
    var count = 0;
    this.tasks.forEach(task => {
      this.backend.getTaskTags(task.id).subscribe(res => {
        console.log('tags retrieved for task ' + task.id + ':');
        console.log(res);

        this.tasks[count].tags = res;
        console.log(this.tasks[count].tags);

        count++;
      });
    });
  }

  removeTag(taskID: number, tagID: number) {
    this.backend.removeTag(taskID, tagID).subscribe(res => {
      console.log('TagID ' + tagID + ' removed From TaskID' + taskID);

      //three second snackbar pop up notification
      let snackbarRef = this.snackbar.open('Tag removed from that task!', 'Ok', { duration: 3000 });

      //reload tags
      this.getTaskTags();
    },
      error => {
        console.log(error.message);
        //three second snackbar pop up notification
        let snackbarRef = this.snackbar.open('Oh no, something went wrong!', 'Ok', { duration: 3000 });
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

interface Task {
  id: number;
  title: string,
  body: string,
  estimatedMin: number,
  estimatedHour: number,
  tags: Tag[]
};

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
