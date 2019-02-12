import { Component, OnInit, Inject } from '@angular/core';
import { BackendService } from '../backend.service';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material';


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

export interface DeleteTagDialogData {
  confirm: boolean
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

        //update display with new tag
        this.getUserTags();
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
      //window.alert('Got Tags');

      //set display to show result
      this.tags = result;
   
    });
  }

  deleteTag(id: number){
    const dialogRef = this.create_dialog.open(DeleteConfirmDialog, {
      width: '325px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){ //if confirmed, delete
        this.backend.deleteTag(id).subscribe(result =>{
          console.log(result);
          window.alert("Tag Deleted!");
    
          //update display
          this.getUserTags();

          //close sidebar showing deleted tags details
          this.opened = false;
        });
      }
      else{ /*do nothing */ }
    });
  }
}


@Component({
  selector: 'create-tag/create-tag-dialog',
  templateUrl: 'create-tag/create-tag-dialog.html',
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

@Component({
  selector: 'delete-tag/delete-confirm-dialog',
  templateUrl: 'delete-tag/delete-confirm-dialog.html',
})
export class DeleteConfirmDialog {

  constructor(public dialogRef: MatDialogRef<CreateTagDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DeleteConfirmDialog) { }

  yes(){
    this.dialogRef.close(true); //return true to parent component
  }

  no(){
    this.dialogRef.close(false); //return false to parent component
  }
}