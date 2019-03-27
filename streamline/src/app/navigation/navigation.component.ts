import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { BackendService } from '../backend.service';
import { StateService } from '../state.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent{

  constructor(private router: Router, private auth: AuthService, private backend: BackendService, private state: StateService) { }

  public onLogin() {
    this.router.navigateByUrl('login');
  }

  public onRegister() {
    this.router.navigateByUrl('signup');
  }

  public onSettings() {
    this.router.navigateByUrl('settings');
  }

  public onHome() {
    this.router.navigateByUrl('home');
  }

  public onTeams() {
    this.router.navigateByUrl('teams');
  }

  public onLogout() {
    this.backend.removeAuthToken(this.auth.getToken()).subscribe(res => {
      this.auth.setLoggedOut();
      this.state.setUserView();
      this.router.navigateByUrl('login');
    });
  }


}
