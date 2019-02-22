import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { AuthService } from '../auth.service';
import { BackendService } from '../backend.service';
import { UnregisterDialog } from '../dialogs/dialogs.module';

interface Setting {
  theme: string
}
@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent {
  theme: string;
  newTheme: Setting;
  helloMoto: string;
  constructor(
    private router: Router,
    public dialog: MatDialog,
    private auth: AuthService,
    private backend: BackendService, 
    private snackbar: MatSnackBar,
    ) {
      this.helloMoto = 'HEY';
      /*
    this.backend.getUserSettings(this.auth.getUserId()).subscribe(result => { //TODO change userID
      console.log(result);
      //window.alert('Got Tags');
      //set display to show result
      this.theme = result.theme;

    }, error => {
      console.log(error.message);
      //three second snackbar pop up notification
      let snackbarRef = this.snackbar.open('Oh no, coudlnt grab personal settings!', 'Ok', { duration: 3000 });
      this.theme = 'light';
    });
    
    
    if(this.theme == 'dark') {
      this.themeWrapper.style.setProperty('--navBarBackground', 'darkslategray');
      this.themeWrapper.style.setProperty('--navBarTextColor', 'white');
      this.themeWrapper.style.setProperty('--menuButtonBackground', 'gray');
      this.newTheme.theme = 'dark';
    }
    if(this.theme == 'light') {
      this.newTheme.theme = 'light';
    }
    */

   }
  private themeWrapper = document.querySelector('body');

  swapTheme() {
    
    if(this.helloMoto == 'HEY') {
      this.themeWrapper.style.setProperty('--navBarBackground', 'darkslategray');
      this.themeWrapper.style.setProperty('--navBarTextColor', 'white');
      this.themeWrapper.style.setProperty('--menuButtonBackground', 'gray');
      this.themeWrapper.style.setProperty('--settingsBackground', 'darkslategray');
      this.themeWrapper.style.setProperty('--settingsColor', 'white');
      this.helloMoto = 'NO';
    } else {
      this.themeWrapper.style.setProperty('--navBarBackground', 'white');
      this.themeWrapper.style.setProperty('--navBarTextColor', 'black');
      this.themeWrapper.style.setProperty('--menuButtonBackground', 'white');
      this.themeWrapper.style.setProperty('--settingsBackground', 'white');
      this.themeWrapper.style.setProperty('--settingsColor', 'black');
      this.helloMoto = 'HEY';
    }
    /*
    if(this.newTheme.theme == 'dark') {
      this.newTheme.theme = 'light';
      this.themeWrapper.style.setProperty('--navBarBackground', 'white');
      this.themeWrapper.style.setProperty('--navBarTextColor', 'black');
      this.themeWrapper.style.setProperty('--menuButtonBackground', 'white');
    }
    if(this.newTheme.theme = 'dark') {
      this.newTheme.theme = 'light';
      this.themeWrapper.style.setProperty('--navBarBackground', 'darkslategray');
      this.themeWrapper.style.setProperty('--navBarTextColor', 'white');
      this.themeWrapper.style.setProperty('--menuButtonBackground', 'gray');
    }
    
    let snackbarRef = this.snackbar.open('If statements', 'Ok', { duration: 3000 });
    this.backend.updateSettings(this.newTheme).subscribe(res => {
      console.log('updated Settings');

      //three second snackbar pop up notification
      let snackbarRef = this.snackbar.open('Settings Updated!', 'Ok', { duration: 3000 });

    }, error => {
      console.log(error.message);
      //three second snackbar pop up notification
      let snackbarRef = this.snackbar.open('Settings werent updated', 'Ok', { duration: 3000 });

    })
    */
  }
  onResetPassword() {
    this.router.navigateByUrl('/reset/password');
  }

  onUnregister() {

    const dialogRef = this.dialog.open(UnregisterDialog, {
      width: '250px',
      height: '250px',
    });

    dialogRef.afterClosed().subscribe((res) => {
      if (res != null) {
        let userId = this.auth.getUserId();
        this.backend.deleteUser(userId).subscribe(res => {
          this.auth.setLoggedOut();
          window.alert('Account unregistered');
          this.router.navigateByUrl('/login');
        }, error => {
          window.alert('Unable to unregister your account.')
        });
      } 
    })

  }


}
