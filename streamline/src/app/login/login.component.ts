import {Component} from '@angular/core';
import {FormControl, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import { BackendService } from '../backend.service';
import { MatSnackBar } from '@angular/material';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';


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

  constructor(private backend: BackendService, private snackbar: MatSnackBar, private auth: AuthService, private router: Router) { }


  onSubmit() {
    let loginRequest: any = {
      email : this.emailFormControl.value,
      password : this.passwordFormContol.value
    }

    this.backend.login(loginRequest).subscribe(res => this.postLogin(res), error => this.invalidLogin());
  }

  postLogin(result) {
    this.auth.setLoggedIn(result.name, result.id);
    this.auth.handleToken(result.access_token);

    var tokenRequest = {
      userId: result.id,
      token: result.access_token
    }
    this.backend.setAuthToken(tokenRequest).subscribe();
    this.router.navigateByUrl('/home');
  }

  invalidLogin() {
    this.snackbar.open('Invalid login', 'Okay', {
      duration: 2000
    });
  }
}