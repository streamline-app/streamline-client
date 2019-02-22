import { NgModule, Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [],
})
export class DialogsModule { }

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
  selector: 'delete-confirm/delete-confirm-dialog',
  templateUrl: 'delete-confirm/delete-confirm-dialog.html',
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
  selector: 'edit-tag/edit-tag-dialog',
  templateUrl: 'edit-tag/edit-tag-dialog.html',
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

@Component({
  selector: 'edit-task/edit-task-dialog',
  templateUrl: 'edit-task/edit-task-dialog.html',
})
export class EditTaskDialog {
  constructor(public dialogRef: MatDialogRef<EditTaskDialog>,
    @Inject(MAT_DIALOG_DATA) public data: EditTaskDialogData) { }

  editTask() {
    //update expDuration
    this.data.expDuration = (this.data.estimatedHour * 60) + (this.data.estimatedMin * 3600);
    this.dialogRef.close(this.data); //return data fields to parent
  }

  closeDialog() {
    this.dialogRef.close();
  }
}

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

export interface EditTaskDialogData {
  title: string,
  body: string,
  workedDuration: number, //not actually edited
  estimatedMin: number,
  estimatedHour: number,
  expDuration: number
}