import { NgModule, Component, Inject } from '@angular/core';
import { CommonModule, formatDate } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Observable } from 'rxjs';
import { FormControl } from '@angular/forms';
import { Tag } from '../app.module'
import { BackendService } from '../backend.service';
import { startWith, map } from 'rxjs/operators';
import { StateService } from '../state.service';

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
  styleUrls: ['create-tag/create-tag-dialog.css']
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
  selector: 'confirm-leave/confirm-leave-dialog',
  templateUrl: 'confirm-leave/confirm-leave-dialog.html',
  styleUrls: ['confirm-leave/confirm-leave-dialog.css']

})
export class ConfirmLeaveDialog {

  constructor(public dialogRef: MatDialogRef<ConfirmLeaveDialog>) { }

  yes() {
    this.dialogRef.close(true); //return true to parent component
  }

  no() {
    this.dialogRef.close(false); //return false to parent component
  }
}

@Component({
  selector: 'confirm-revoke/confirm-revoke-dialog',
  templateUrl: 'confirm-revoke/confirm-revoke-dialog.html',
  styleUrls: ['confirm-revoke/confirm-revoke-dialog.css']

})
export class ConfirmRevokeDialog {

  constructor(public dialogRef: MatDialogRef<ConfirmRevokeDialog>) { }

  yes() {
    this.dialogRef.close(true); //return true to parent component
  }

  no() {
    this.dialogRef.close(false); //return false to parent component
  }
}

@Component({
  selector: 'confirm-transfer/confirm-transfer-dialog',
  templateUrl: 'confirm-transfer/confirm-transfer-dialog.html',
  styleUrls: ['confirm-transfer/confirm-transfer-dialog.css']

})
export class ConfirmTransferDialog {

  constructor(public dialogRef: MatDialogRef<ConfirmTransferDialog>) { }

  yes() {
    this.dialogRef.close(true); //return true to parent component
  }

  no() {
    this.dialogRef.close(false); //return false to parent component
  }
}

@Component({
  selector: 'confirm-promotion/confirm-promotion-dialog',
  templateUrl: 'confirm-promotion/confirm-promotion-dialog.html',
  styleUrls: ['confirm-promotion/confirm-promotion-dialog.css']

})
export class ConfirmPromotionDialog {

  constructor(public dialogRef: MatDialogRef<ConfirmPromotionDialog>) { }

  yes() {
    this.dialogRef.close(true); //return true to parent component
  }

  no() {
    this.dialogRef.close(false); //return false to parent component
  }
}

@Component({
  selector: 'confirm-demotion/confirm-demotion-dialog',
  templateUrl: 'confirm-demotion/confirm-demotion-dialog.html',
  styleUrls: ['confirm-demotion/confirm-demotion-dialog.css']

})
export class ConfirmDemotionDialog {

  constructor(public dialogRef: MatDialogRef<ConfirmDemotionDialog>) { }

  yes() {
    this.dialogRef.close(true); //return true to parent component
  }

  no() {
    this.dialogRef.close(false); //return false to parent component
  }
}

@Component({
  selector: 'remove-team-member/remove-team-member-dialog',
  templateUrl: 'remove-team-member/remove-team-member-dialog.html',
  styleUrls: ['remove-team-member/remove-team-member-dialog.css']

})
export class RemoveTeamMemberDialog {

  constructor(public dialogRef: MatDialogRef<RemoveTeamMemberDialog>) { }

  yes() {
    this.dialogRef.close(true); //return true to parent component
  }

  no() {
    this.dialogRef.close(false); //return false to parent component
  }
}

@Component({
  selector: 'delete-confirm/delete-confirm-dialog',
  templateUrl: 'delete-confirm/delete-confirm-dialog.html',
  styleUrls: ['delete-confirm/delete-confirm-dialog.css']

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
  styleUrls: ['edit-tag/edit-tag-dialog.css']

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
  styleUrls: ['edit-task/edit-task-dialog.css']
})
export class EditTaskDialog {
  private oldDate: Date = new Date();
  private currDate: Date = new Date();
  constructor(public dialogRef: MatDialogRef<EditTaskDialog>,
    @Inject(MAT_DIALOG_DATA) public data: EditTaskDialogData) {
    this.oldDate = data.completeDate;

    /* used to set a min date for datepicker, for some reason sets min 
    *  to previous day so have to add one to the current date.
    */
    this.currDate.setDate(this.currDate.getDate() + 1);
  }

  editTask() {
    //update expDuration
    this.data.expDuration = (this.data.estimatedHour * 60) + (this.data.estimatedMin * 3600);
    this.dialogRef.close(this.data); //return data fields to parent
  }

  closeDialog() {
    this.dialogRef.close();
  }

  _formatDate(d: Date): string { //special function to format date for UI
    return formatDate(d, 'MM/dd/yyyy', 'en-US');
  }
}

@Component({
  selector: 'add-tag/add-tag-dialog',
  templateUrl: 'add-tag/add-tag-dialog.html',
  styleUrls: ['add-tag/add-tag-dialog.css']
})
export class AddTagDialog {
  public rawTagsForm: FormControl = new FormControl();
  public filteredTags: Observable<Tag[]>;
  public tags: Tag[];
  private response: AddTagDialogResponse;

  constructor(
    public dialogRef: MatDialogRef<AddTagDialog>,
    private backend: BackendService,
    private state: StateService,
    @Inject(MAT_DIALOG_DATA) public data: AddTagDialogData) {
      if (state.teamId != 0) {
        this.backend.getTeamTags(this.state.teamId).subscribe(res => {
          if (res != null) {
            this.tags = res;
            //set up autofill for tags
            this.filteredTags = this.rawTagsForm.valueChanges
              .pipe(
                startWith(''),
                map(tag => tag ? this._filterTags(tag) : this.tags.slice())
              );
          }
          else {
            console.log('Could not retrieve tags');
            this.dialogRef.close(null);
          }
        })
      } else {
        this.backend.getUserTags(this.data.userID).subscribe(res => {
          if (res != null) {
            this.tags = res;
            //set up autofill for tags
            this.filteredTags = this.rawTagsForm.valueChanges
              .pipe(
                startWith(''),
                map(tag => tag ? this._filterTags(tag) : this.tags.slice())
              );
          }
          else {
            console.log('Could not retrieve tags');
            this.dialogRef.close(null); //TODO code this to give response to user?
          }
        })
      }
    
  }

  addTag() {
    this.dialogRef.close(this.response);
  }

  closeDialog() {
    this.dialogRef.close(null);
  }

  public onTagSelect(tag: Tag) {
    this.response = { tagID: tag.id, isPrio: tag.name.includes('priority') }
  }

  private _filterTags(value: string): Tag[] {
    const filterValue = value.toLowerCase();

    return this.tags.filter(tag => tag.name.toLowerCase().indexOf(filterValue) === 0);
  }

  
}

@Component({
  selector: 'unregister-dialog',
  templateUrl: 'unregister/unregister-dialog.html',
})
export class UnregisterDialog {

  constructor(
    public dialogRef: MatDialogRef<UnregisterDialog>) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onYesClick(): void {
    this.dialogRef.close('yes');
  }

}

@Component({
  selector: 'upload-doc-dialog',
  templateUrl: 'upload-doc/upload-doc-dialog.html'
})
export class UploadDocDialog {
  private fileList : FileList = null;

  constructor(
    public dialogRef: MatDialogRef<UploadDocDialog>) { }

  uploadFile(fileList: FileList){
    this.fileList = fileList;
  }

  upload(){
    this.dialogRef.close(this.fileList);
  }

  cancel(){
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
  isPrio: boolean,
};

export interface EditTaskDialogData {
  title: string,
  body: string,
  workedDuration: number, //not actually edited
  estimatedMin: number,
  estimatedHour: number,
  expDuration: number,
  priority: number,
  completeDate: Date
};

export interface AddTagDialogData {
  userID: number,
  tagID: number,
};

export interface AddTagDialogResponse {
  tagID: number,
  isPrio: boolean
}
