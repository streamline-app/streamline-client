import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent implements OnInit {
  // TESTING STATIC DATA
  task1 : any = {
    id: 1,
    title: 'This is an important task',
    body: 'This is an important description for an important task',
    estimatedHour: 10,
    estimatedMin: 10
  }

  task2 : any = {
    id: 2,
    title: 'This is an even more important task',
    body: 'This is an important description for an even more important task',
    estimatedHour: 10,
    estimatedMin: 10
  }

  task3 : any = {
    id: 3,
    title: 'This is the most important task',
    body: 'This is an important description for the most important task',
    estimatedHour: 10,
    estimatedMin: 10
  }

  tasks : any[] = [this.task1, this.task2, this.task3];

  constructor() { }

  ngOnInit() {
  }

  collapse(id) {
    var content = document.getElementById('content_'+id).style;
    if (content.display == "block") {
      content.display = "none";
    } else {
      content.display = "block"
    }
  }

}

interface Task {
  title: string,
  body: string,
  estimatedMin: number,
  estimatedHour: number 
}
