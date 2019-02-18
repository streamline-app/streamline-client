import { Component, OnInit } from '@angular/core';
import { BackendService } from '../backend.service';
import { AuthService } from '../auth.service';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent implements OnInit {
  // TESTING STATIC DATA
  task1: Task = {
    title: 'This is an important task',
    body: 'This is an important description for an important task',
    estimatedHour: 10,
    estimatedMin: 10
  }

  task2: Task = {
    title: 'This is an even more important task',
    body: 'This is an important description for an even more important task',
    estimatedHour: 10,
    estimatedMin: 10
  }

  task3: Task = {
    title: 'This is the most important task',
    body: 'This is an important description for the most important task',
    estimatedHour: 10,
    estimatedMin: 10
  }

  tasks: Task[] = [this.task1, this.task2, this.task3];

  constructor(private backend: BackendService,
    private auth: AuthService,
    private snackbar: MatSnackBar,
    private router: Router
  ) {

    //update tasks display
    this.getUserTasks();

  }

  ngOnInit() {
  }

  getUserTasks() {
    this.backend.getUserTasks(this.auth.getUserId()).subscribe(result => { //TODO change userID
      console.log(result);
      //window.alert('Got Tags');

      //set display to show result
      this.tasks = result;

    }, error => {
      console.log(error.message);
      //three second snackbar pop up notification
      let snackbarRef = this.snackbar.open('Oh no, something went wrong!', 'Ok', { duration: 3000 });
    });
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
  title: string,
  body: string,
  estimatedMin: number,
  estimatedHour: number
}
