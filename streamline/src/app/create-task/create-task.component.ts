import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { BackendService } from '../backend.service';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';


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

  public task: FormGroup = new FormGroup({
    title: new FormControl(''),
    body: new FormControl(''),
    estimatedMin: new FormControl(0),
    estimatedHour: new FormControl(0),
    tags: new FormControl({ value: '', disabled: 'true'})
  });

  constructor(private backend: BackendService,
    private auth: AuthService,
    private router: Router,
    private snackbar: MatSnackBar) {
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
    this.tags = [this.faketag1, this.faketag2];
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
    });
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

    //    this.task.controls['tags'].setValue(this.selectedTags); //update form control
    /*
        if (this.task.controls['tags'].value != '')
          this.task.controls['tags'].setValue(this.task.controls['tags'].value + ',' + tag.name);
        else
          this.task.controls['tags'].setValue(tag.name);
    */
  }

  //helper mehtod to get TagIDs from list of tags
  parseTagArray(tags : Tag[]) : number[]{
    let arr : number[] = [];

    tags.forEach(tag => {
      arr.push(tag.id);
    });

    return arr;
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

