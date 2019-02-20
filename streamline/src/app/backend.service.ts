import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { HttpHeaders } from '@angular/common/http';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material';


const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': 'my-auth-token'
  })
};

@Injectable({
  providedIn: 'root'
})
export class BackendService {

  public root: string = 'localhost:8000';

  /* Task URLs */
  public createTaskURL: string = 'http://' + this.root + '/api/tasks';
  public getUserTasksURL: string = 'http://' + this.root + '/api/tasks/all';
  public getTaskTagsURL: string = 'http://' + this.root + '/api/tasks/tags';
  public removeTagURL: string = 'http://' + this.root + '/api/tasks/removeTag';

  /*  Tag URLs */
  public createTagURL: string = 'http://' + this.root + '/api/tags';
  public getUserTagsURL: string = 'http://' + this.root + '/api/tags';
  public deleteTagURL: string = 'http://' + this.root + '/api/tags';
  public editTagURL: string = 'http://' + this.root + '/api/tags';


  /*  Auth URLs */
  public loginURL: string = 'http://' + this.root + '/api/auth/login';
  public signupURL: string = 'http://' + this.root + '/api/auth/signup';


  constructor(private http: HttpClient, private snackbar: MatSnackBar) { }

  /* ============ Task Functions ========== */
  createTask(task: Task): Observable<Task> {
    return this.http.post<Task>(this.createTaskURL, task, httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  getUserTasks(userID: number): Observable<(Task[])>{
    return this.http.get<Task[]>(this.getUserTasksURL + '/' + userID,{
      headers: {
        Authorization: 'my-auth-token'
      }
    })
    .pipe(catchError(this.handleError));
  }

  removeTag(taskID: number, tagID: number){
    return this.http.post(this.removeTagURL + '/' + taskID + '/' + tagID, httpOptions) //append taskID then tagID
    .pipe(
      catchError(this.handleError)
    );
  }

  /* ==================================== */

  /* =======  Tag Functions ======== */
  createTag(tag: Tag): Observable<Tag> {
    return this.http.post<Tag>(this.createTagURL, tag, httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  getUserTags(userID: number): Observable<Tag[]> {
    return this.http.get<Tag[]>(this.getUserTagsURL,
      {
        params: { userID: userID.toString() }, //string is required for params
        headers: {
          Authorization: 'my-auth-token'
        }
      }) 
      .pipe(
        catchError(this.handleError)
      );
  }

  getTaskTags(taskID: number): Observable<Tag[]> {
    return this.http.get<Tag[]>(this.getTaskTagsURL + '/' + taskID,
      {
        params: { taskID: taskID.toString() },
        headers:{
          Authorization: 'my-auth-token'
        }
      })
      .pipe(
        catchError(this.handleError)
      );
  }

  deleteTag(id: number): Observable<any> {
    return this.http.delete(this.deleteTagURL + '/' + id, httpOptions)
      .pipe(catchError(this.handleError));
  }

  editTag(id: number, edit: TagEdit): Observable<any> {
    return this.http.post(this.editTagURL + '/' + id, edit, httpOptions)
    .pipe(catchError(this.handleError));
  }
  /* ============================== */

  login(login: LoginRequest) {
    return this.http.post<LoginResponse>(this.loginURL, login, httpOptions)
      .pipe(
        catchError(this.handleError)
      )
  }

  signup(signup: SignUpRequest) {
    return this.http.post<LoginResponse>(this.signupURL, signup, httpOptions)
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
        `body was: ${error.error.message}`);
    }
    // return an observable with a user-facing error message
    return throwError(
      'Something bad happened; please try again later.');
  };
}

interface Task {
  id: number,
  title: string,
  body: string,
  estimatedMin: number,
  estimatedHour: number,
  tags: Tag[]
}

interface Tag {
  id: number,
  name: string,
  description: string,
  tasks_comp: number,
  average_time: number,
  average_acc: number,
  task_overunder: number,
  color: string,
  userID: number
};

interface TagEdit {
  name:string,
  desc: string,
  color: string
};

interface LoginRequest {
  email: string,
  password: string
}

interface SignUpRequest {
  name: string,
  email: string,
  password: string
}

interface LoginResponse {
  access_token: string,
  expires_in: number,
  token_type: string,
  user: string
}
