import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { HttpHeaders } from '@angular/common/http';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';


const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
    'Authorization': 'my-auth-token'
  })
};

@Injectable({
  providedIn: 'root'
})
export class BackendService {

  public root : string = 'localhost:8000';
  public createTaskURL : string = 'http://' + this.root + '/api/tasks';
  public loginURL : string = 'http://' + this.root + '/api/auth/login';
  

  constructor(private http: HttpClient) { }

  createTask(task: Task): Observable<Task> {
    return this.http.post<Task>(this.createTaskURL, task, httpOptions)
    .pipe(
      catchError(this.handleError)
    );
  }

  login(login: LoginRequest) {
    return this.http.post<LoginResponse>(this.loginURL, login, httpOptions)
    .pipe(
      catchError(this.handleError)
    )
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError(
      'Something bad happened; please try again later.');
  };
}

interface Task {
  title: string,
  body: string,
  estimatedMin: number,
  estimatedHour: number 
}

interface LoginRequest {
  email: string,
  password: string
}

interface LoginResponse {
  access_token: string,
  expires_in: number,
  token_type: string,
  user: string
}