import { Component, OnInit, Inject, ElementRef, isDevMode } from '@angular/core';
import { BackendService } from '../backend.service';
import { DomSanitizer, DOCUMENT} from '@angular/platform-browser';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { style } from '@angular/animations';
import { NgStyle } from '@angular/common';

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
  styleUrls: ['./settings.component.css'],
})
export class SettingsComponent implements OnInit {
  opened: boolean;
  settings: string;
  selectedSetting: string;
  newSetting: string;
  indexOfColon: number;
  //bodyTag: HTMLBodyElement = document.getElementsByTagName('body')[0];
  //htmlTag: HTMLElement = document.getElementsByTagName('html')[0];
  cssUrl: string;
  
  constructor(@Inject(DOCUMENT) private document,
    private backend: BackendService,
    public create_dialog: MatDialog,
    private snackbar: MatSnackBar,
    private elementRef: ElementRef,
    public sanitizer: DomSanitizer,

    ) {
      this.opened = false;
      this.getUserSettings();
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
  ngOnInit() {
    //this.bodyTag.classList.add('blooo');
    //this.htmlTag.classList.add('blooo');
  }
  editBackground(newColor: string) {
    let snackbarRef = this.snackbar.open(newColor, 'Ok', { duration: 3000 });
    //var backgroundControl = Element
    if(newColor == 'Dark') {
      let snackbarRef = this.snackbar.open('REBEL YELL', 'Ok', { duration: 3000 });
      this.elementRef.nativeElement.ownerDocument.body.style.backgroundColor = 'black'; // the one that does thigngs
      //this.elementRef.nativeElement.ownerDocument.style.backgroundColor = 'black';
      //this.elementRef.nativeElement.body.style.backgroundColor = 'black';
      //this.elementRef.nativeElement.style.background = 'black';

    }
    if(newColor == 'Light') {
      let snackbarRef = this.snackbar.open('SCREAM', 'Ok', { duration: 3000 });
      this.elementRef.nativeElement.ownerDocument.body.style.backgroundColor = 'white';
      this.elementRef.nativeElement.style.color = 'white';
      this.cssUrl = '/settings.component2.css';
      this.document.getElementById('theme').setAttribute('href', 'settings.component2.css');
    }
    
  }
  editFont(newFont: string) {
    console.log("Hello MOto");
    let snackbarRef = this.snackbar.open(newFont, 'Ok', { duration: 3000 });

    if(newFont == 'Arial') {
      let snackbarRef = this.snackbar.open('REBEL YELL', 'Ok', { duration: 3000 });
      this.elementRef.nativeElement.ownerDocument.style.newFont = 'Arial';
      this.setDark();
    }
    if(newFont == 'Times New Roman') {
      let snackbarRef = this.snackbar.open('SCREAM', 'Ok', { duration: 3000 });
      this.elementRef.nativeElement.ownerDocument.style.newFont = 'Arial';

    }

  }
  setDark() {
    let styles = {
      'background-color': 'red',
      'font-weight': 'bold'
    };
    return styles;
  }
  updateSetting(newElement: string, category: string){
    this.indexOfColon = this.settings.indexOf(':');
    if(category == "Color"){
      this.newSetting = newElement + this.settings.substring(this.indexOfColon);
      this.settings = this.newSetting;

    }
    if(category == "Font"){
      this.newSetting = this.settings.substring(0,this.indexOfColon+1) + newElement;
      this.settings = this.newSetting;

    }
    this.backend.updateSetting(this.settings);
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