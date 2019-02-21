import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import { BackendService } from '../backend.service';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';


/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.css']
})
export class PasswordResetComponent {

  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);
  constructor(private router: Router, private backend: BackendService, private snackbar: MatSnackBar) { }

  onSubmit() {
    let request = {
      email: this.emailFormControl.value
    }

    this.backend.sendPasswordResetLink(request).subscribe((res) => {
        window.alert('Password reset email sent. Check your inbox.');
        this.emailFormControl = new FormControl('', [
          Validators.required,
          Validators.email,
        ]);
    },
  (error) => {
    window.alert('User with that email not found in database.');

  })
  }

  onCancel() {
    this.router.navigateByUrl('/login');
  }
  
}
