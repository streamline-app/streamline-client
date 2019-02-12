import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // Variables to remember current user
  private id: number = 0;
  private name: string = '';
  private loggedIn: boolean = false;

  constructor(private router: Router) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean>|Promise<boolean>|boolean {
    if (!this.isLoggedIn()) {
      this.router.navigateByUrl('/login');
      return false;
    }
    return true;
  }

  setUserId(_id) {
    this.id = _id;
  }

  setUserName(_name) {
    this.name = _name;
  }

  setLoggedIn(_name, _id) {
    this.setUserId(_id);
    this.setUserName(_name);
    this.loggedIn = true;
  }

  isLoggedIn() {
    return this.loggedIn;
  }

  
}
