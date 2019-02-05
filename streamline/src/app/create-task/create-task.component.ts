import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { BackendService } from '../backend.service';


@Component({
  selector: 'app-create-task',
  templateUrl: './create-task.component.html',
  styleUrls: ['./create-task.component.css']
})
export class CreateTaskComponent {

  public task : FormGroup = new FormGroup({
    title: new FormControl(''),
    body: new FormControl(''),
    estimatedMin: new FormControl(0),
    estimatedHour: new FormControl(0)
  });

  constructor(private backend: BackendService) { }

  public onSubmit() {    
    let task : any = {
      title: this.task.controls['title'].value,
      body: this.task.controls['body'].value,
      estimatedMin: this.task.controls['estimatedMin'].value,
      estimatedHour: this.task.controls['estimatedHour'].value
    }

    this.backend.createTask(task).subscribe(task => window.alert('Task Created'));

  }
}

// Object that represents data to be sent to server