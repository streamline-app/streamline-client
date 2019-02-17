import { Component, OnInit, Inject } from '@angular/core';
import { BackendService } from '../backend.service';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';


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
  desc: string,
  color: string
};

export interface EditTagDialogData {
  name: string,
  desc: string,
  color: string
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

  constructor(private backend: BackendService,
    public create_dialog: MatDialog,
    private snackbar: MatSnackBar
  ){
    //make sure sidenav is closed
    this.opened = false;

    //fill display
    this.getUserTags();
  }

  ngOnInit() {
  }

  createTag() {
    const dialogRef = this.create_dialog.open(CreateTagDialog, {
      width: '250px',
      data: { name: '', desc: '', color: "#c4c4c4" }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        //construct Tag object with input values
        let newTag: Tag = {
          id: 1,
          name: result.name,
          description: result.desc,
          tasks_comp: 0,
          average_time: 0,
          average_acc: 0,
          task_overunder: 0,
          color: result.color,
          userID: 1
        }

        console.log(newTag);
        //send data to backend
        this.backend.createTag(newTag).subscribe(result => {

          //three second snackbar pop up notification
          let snackbarRef = this.snackbar.open('Tag Created!', 'Ok', { duration: 3000 });

        }, error => {
          console.log(error.message);
          //three second snackbar pop up notification
          let snackbarRef = this.snackbar.open('Oh no, something went wrong!', 'Ok', { duration: 3000 });
        });

        //update display with new tag
        this.getUserTags();
      }
      else { /* Do Nothing */ }
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

  getUserTags() {
    this.backend.getUserTags("1").subscribe(result => { //TODO change userID
      console.log(result);
      //window.alert('Got Tags');

      //set display to show result
      this.tags = result;

    }, error => {
      console.log(error.message);
      //three second snackbar pop up notification
      let snackbarRef = this.snackbar.open('Oh no, something went wrong!', 'Ok', { duration: 3000 });
    });
  }

  deleteTag(id: number) {
    const dialogRef = this.create_dialog.open(DeleteConfirmDialog, {
      width: '325px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) { //if confirmed, delete
        this.backend.deleteTag(id).subscribe(result => {
          console.log(result);

          //three second snackbar pop up notification
          let snackbarRef = this.snackbar.open('Tag Deleted!', 'Ok', { duration: 3000 });

          //update display
          this.getUserTags();

          //close sidebar showing deleted tags details
          this.opened = false;
        }, error => {
          console.log(error.message);
          //three second snackbar pop up notification
          let snackbarRef = this.snackbar.open('Oh no, something went wrong!', 'Ok', { duration: 3000 });
        });
      }
      else { /*do nothing */ }
    });
  }

  editTag(id: number) {
    const dialogRef = this.create_dialog.open(EditTagDialog, {
      width: '325px',
      data: { name: this.selectedTag.name, desc: this.selectedTag.description, color: this.selectedTag.color } /* Make sure to set fields to details of selected tag*/
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        //close sidebar showing old tags details
        this.opened = false;

        //result is formatted to send directly to backend
        this.backend.editTag(id, result).subscribe(res => {
          console.log('tag ' + id + ' udpated');

          //three second snackbar pop up notification
          let snackbarRef = this.snackbar.open('Tag Updated!', 'Ok', { duration: 3000 });

          //update display
          this.getUserTags();
        }, error => {
          console.log(error.message);
          //three second snackbar pop up notification
          let snackbarRef = this.snackbar.open('Oh no, something went wrong!', 'Ok', { duration: 3000 });

        })

      }
      else { /* Do Nothing */ }
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

  constructor(public dialogRef: MatDialogRef<DeleteConfirmDialog>) { }

  yes() {
    this.dialogRef.close(true); //return true to parent component
  }

  no() {
    this.dialogRef.close(false); //return false to parent component
  }
}


@Component({
  selector: 'edit-tag/edit-dialog',
  templateUrl: 'edit-tag/edit-dialog.html',
})
export class EditTagDialog {
  constructor(public dialogRef: MatDialogRef<EditTagDialog>,
    @Inject(MAT_DIALOG_DATA) public data: EditTagDialogData) { }

  editTag() {
    this.dialogRef.close(this.data); //return data fields to parent
  }

  closeDialog() {
    this.dialogRef.close();
  }
}