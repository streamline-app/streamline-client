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
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  
  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);

  passwordFormContol = new FormControl('', [
    Validators.required
  ]);

  matcher = new MyErrorStateMatcher();

  constructor(private backend: BackendService, private snackbar: MatSnackBar) { }


  onSubmit() {
    let loginRequest: any = {
      email : this.emailFormControl.value,
      password : this.passwordFormContol.value
    }

    this.backend.login(loginRequest).subscribe(res => window.alert(res.user), error => this.invalidLogin());
  }

  invalidLogin() {
    this.snackbar.open('Invalid login', 'Okay', {
      duration: 2000
    });
  }
}