import {Component} from '@angular/core';
import {FormControl, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import { BackendService } from '../backend.service';
import { MatSnackBar } from '@angular/material';

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent {

  nameFormControl = new FormControl('', [
    Validators.required,
  ]);

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


  constructor(private snackbar: MatSnackBar, private backend: BackendService) { }

  onSubmit() {
    
    if (this.confirmPasswordFormControl.value != this.passwordFormControl.value) {
      this.snackbar.open('Passwords do not match.', 'Okay', {
        duration: 2000
      });
    }
    let signUpRequest: any = {
      name : this.nameFormControl.value,
      email : this.emailFormControl.value,
      password : this.passwordFormControl.value,
    }

    // backend interaction
    this.backend.signup(signUpRequest).subscribe(res => window.alert('Registration Successful. You can now log in with your provided credentials.'), error => window.alert('Sign up not successful'));

  }

  invalidSignUp() {
    this.snackbar.open('Invalid registration information', 'Okay', {
      duration: 2000
    });
  }

}
