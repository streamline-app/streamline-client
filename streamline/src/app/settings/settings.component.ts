import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { AuthService } from '../auth.service';
import { BackendService } from '../backend.service';


@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent {

  constructor(private router: Router, public dialog: MatDialog, private auth: AuthService, private backend: BackendService) { }

  onResetPassword() {
    this.router.navigateByUrl('/reset/password');
  }

  onUnregister() {
    let userId = this.auth.getUserId();
    this.backend.deleteUser(userId).subscribe(res => {
      this.auth.setLoggedOut();
      window.alert('Account unregistered');
      this.router.navigateByUrl('/login');
    }, error => {
      window.alert('Unable to unregister your account.')
    });
  }


}
