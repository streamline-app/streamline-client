import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements CanActivate {

  // Variables to remember current user
  private id: number = 0;
  private name: string = '';
  private loggedIn: boolean = false;
  private root: string = 'http://localhost:8000';
  private auth: string = '/api/auth';
  private iss = {
    login : this.root + this.auth + '/login',
    signup: this.root + this.auth + '/signup'
  }

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

  getUserId() {
  //  console.log('Current User Id: ' + this.id);
    return this.id;
  }

  setUserName(_name) {
    this.name = _name;
  }

  getUserName() {
    return this.name;
  }

  setLoggedIn(_name, _id) {
    this.setUserId(_id);
    this.setUserName(_name);
    this.loggedIn = true;
  }

  setLoggedOut() {
    this.loggedIn = false;
    this.name = '';
    this.id = 0;
    this.removeToken();
  }

  isLoggedIn() {
    if (this.isValidToken()) {
      const token = this.getToken();
      var payload = this.payload(token);
      this.setUserId(payload.sub);
      return true;
    }

    return false;
  }

  handleToken(token) {
    this.setToken(token);
    console.log(this.isValidToken());
  }

  setToken(token) {
    localStorage.setItem('token', token);
  }

  getToken() {
    return localStorage.getItem('token');
  }

  removeToken() {
    return localStorage.removeItem('token');
  }

  isValidToken() {
    const token = this.getToken();
    if (this.getToken()) {
      const payload = this.payload(token);
      if (payload) {
        return Object.values(this.iss).indexOf(payload.iss) > -1 ? true : false;
      }
    }

    return false;
  }

  payload(token) {
    const payload = token.split('.')[1];
    return this.decode(payload);
  }

  decode(payload) {
    return JSON.parse(atob(payload));
  }

  
}
