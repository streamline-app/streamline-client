import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  opened: boolean = true;
  tags: boolean = false;
  profile: boolean = false;
  tasks: boolean = true;

  constructor() { 
  }

  ngOnInit() {
  }

  onTagsPressed() {
    this.tags = true;
    this.profile = false;
    this.tasks = false;
  }

  onTasksPressed() {
    this.tags = false;
    this.profile = false;
    this.tasks = true;
  }

  onProfilePressed() {
    this.tags = false;
    this.profile = true;
    this.tasks = false;
  }

}
