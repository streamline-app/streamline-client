import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent{

  constructor(private router: Router) { }

  public onLogin() {
    this.router.navigateByUrl('login');
  }

  public onRegister() {
    this.router.navigateByUrl('signup');
  }


}
