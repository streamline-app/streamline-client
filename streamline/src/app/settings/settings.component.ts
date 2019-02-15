import { Component, OnInit, Inject } from '@angular/core';
import { BackendService } from '../backend.service';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';

interface UserSetting {
  setting: string
};

interface DeleteUser {
  id: number
}
export interface EditSettingDialogData {
  id: number,
  setting: string
};
@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  opened: boolean;
  settings: string;
  selectedSetting: string;
  newSetting: string;
  indexOfColon: number;
  constructor(private backend: BackendService,
    public create_dialog: MatDialog,
    private snackbar: MatSnackBar
    ) {
      this.opened = false;
      this.getUserSettings();
    }

  ngOnInit() {
  }

  getUserSettings() {
    this.backend.getUserSettings("1").subscribe(result => { //TODO change userID
      console.log(result);
      //window.alert('Got Tags');

      //set display to show result
      this.settings = result;

    }, error => {
      console.log(error.message);
      //three second snackbar pop up notification
      let snackbarRef = this.snackbar.open('Oh no, something went wrong!', 'Ok', { duration: 3000 });
    });
  }

  editBackground() {
    const dialogRef = this.create_dialog.open(EditSettingDialog, {
      width: '250px',
      data: {value: ''}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('closed edit background setting');

      console.log('received:' + result.setting);
      if(result != null){
        // TODO Parse into first element of string
        this.indexOfColon = this.settings.indexOf(":");
        this.newSetting = this.settings.substr(this.indexOfColon);
        console.log(this.newSetting);

        this.backend.updateSetting(this.newSetting).subscribe(setting => window.alert('Setting Changed'));

        this.getUserSettings();
      }
      else {
        return;
      }
    });
  }
  editFont() {
    const dialogRef = this.create_dialog.open(EditSettingDialog, {
      width: '250px',
      data: {value: ''}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('closed edit font setting');

      console.log('received:' + result.setting);
      if(result != null){
        // TODO Parse into second element of string

        console.log(this.newSetting);

        this.backend.updateSetting(this.newSetting).subscribe(setting => window.alert('Setting Changed'));

        this.getUserSettings();
      }
      else {
        return;
      }
    });
  }
}

@Component({
  selector: 'edit-setting-dialog',
  templateUrl: 'edit-setting-dialog.html',
})
export class EditSettingDialog {

  constructor(public dialogRef: MatDialogRef<EditSettingDialog>,
    @Inject(MAT_DIALOG_DATA) public data: EditSettingDialogData) {

  }

  editBackground() {
    //close the dialog, data will be returned to parent component
    this.dialogRef.close(this.data);
  }

  editFont() {
    //close the dialog, data will be returned to parent component
    this.dialogRef.close(this.data);
  }
  closeDiag() {
    //return to parent component, result will be undefined
    this.dialogRef.close();
  }
}