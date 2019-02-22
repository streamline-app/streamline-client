import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import { BackendService } from '../backend.service';
import { MatSnackBar } from '@angular/material';
import { AuthService } from '../auth.service';
import { Router, ActivatedRoute } from '@angular/router';

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-password-reset-form',
  templateUrl: './password-reset-form.component.html',
  styleUrls: ['./password-reset-form.component.css']
})
export class PasswordResetFormComponent {


  token: string;

  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);

  passwordFormControl = new FormControl('', [
    Validators.required
  ]);

  confirmPasswordFormControl = new FormControl('', [
    Validators.required
  ]);


  constructor(private snackbar: MatSnackBar, private backend: BackendService, private route: ActivatedRoute, private router: Router) {
    route.queryParams.subscribe(params => {
      this.token = params['token'];
    })
  }

  onSubmit() {
    console.log(this.token);
    if (this.confirmPasswordFormControl.value != this.passwordFormControl.value) {
      this.snackbar.open('Passwords do not match.', 'Okay', {
        duration: 2000
      });
    } 

    let email = this.emailFormControl.value;
    let password = this.passwordFormControl.value;
    let resetToken = this.token;
    let request = {
      email: email,
      password: password,
      token: resetToken
    }

    this.backend.changePassword(request).subscribe(res => {
      if (res) {
        window.alert('Password reset successful!');
        this.router.navigateByUrl('login');
      } else {
        window.alert('Invalid information given');
      }
    })
  }

  onCancel() {
    this.router.navigateByUrl('/login');
  }

}
