import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent{

  constructor(private router: Router, private auth: AuthService) { }

  public onLogin() {
    this.router.navigateByUrl('login');
  }

  public onRegister() {
    this.router.navigateByUrl('signup');
  }

  public onSettings() {
    window.alert('settings clicked');
  }

  public onLogout() {
    this.auth.setLoggedOut();
    this.router.navigateByUrl('login');
  }


}
