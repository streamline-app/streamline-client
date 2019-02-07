import { Component, OnInit, Inject } from '@angular/core';
import { BackendService } from '../backend.service';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material';

/* Stub filler for Tags */
const TAGS: Tag[] = [
  { id: 11, name: 'CS homework', description: 'something something', tasks_comp: 3, average_time: 12.12, average_acc: 50.4, task_overunder: 1.2, color: '#c4c4c4', userID: 1 },
  { id: 12, name: 'Laundry', description: 'another desc', tasks_comp: 5, average_time: 34.43, average_acc: 93.4, task_overunder: 2.0, color: '#c4c4c4', userID: 1 },
  { id: 13, name: 'Gym', description: 'filler text', tasks_comp: 10, average_time: 10.3, average_acc: 20.4, task_overunder: 0.4, color: '#c4c4c4', userID: 1 },
];

interface Tag {
  id: number,
  name: string,
  description: string
  tasks_comp: number,
  average_time: number,
  average_acc: number,
  task_overunder: number,
  color: string,
  userID: number //NOTE: this value is hardcoded until userID can be pulled from auth
};

export interface CreateTagDialogData {
  name: string,
  desc: string
};

@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.css']
})
export class TagsComponent implements OnInit {
  opened: boolean;
  tags: Tag[];
  selectedTag: Tag;
  newTag: Tag;

  constructor(private backend: BackendService,
    public create_dialog: MatDialog) {
    this.tags = TAGS;
    this.opened = false;

    this.newTag = {
      //set init values for new tag
      id: 1,
      name: "",
      description: "",
      tasks_comp: 0,
      average_time: 0,
      average_acc: 0,
      task_overunder: 1.2,
      color: '#c4c4c4',
      userID: 1
    }

    this.getUserTags();
  }

  ngOnInit() {
  }

  createTag() {
    const dialogRef = this.create_dialog.open(CreateTagDialog, {
      width: '250px',
      data: { name: '', desc: '' }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('closed create tag dialog');
      //get result info here
      console.log('recieved: ' + result.name + ' ' + result.desc);
      if (result != null) {
        this.newTag.name = result.name;
        this.newTag.description = result.desc;

        console.log(this.newTag);
        //send data to backend
        this.backend.createTag(this.newTag).subscribe(tag => window.alert('Tag Created'));
      }
      else {
        return;
      }
    });


  }

  onSelect(tag: Tag): void {
    if (this.opened) { //if already open, close it.
      this.opened = false;
    }

    //load data for that tag ------
    this.selectedTag = tag;

    //open tab again
    this.opened = true;
  }

  getUserTags(){
    this.backend.getUserTags("1").subscribe(result => {
      console.log(result);
      window.alert('Got Tags');
    });
  }
}


@Component({
  selector: 'create-tag-dialog',
  templateUrl: 'create-tag-dialog.html',
})
export class CreateTagDialog {

  constructor(public dialogRef: MatDialogRef<CreateTagDialog>,
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
