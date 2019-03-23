import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpHeaders } from '@angular/common/http';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Tag, Task } from './app.module'


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
  public createTaskURL: string = 'http://' + this.root + '/api/tasks/create';
  public getUserTasksURL: string = 'http://' + this.root + '/api/tasks/';
  public getTaskTagsURL: string = 'http://' + this.root + '/api/tasks/tags';
  public removeTagURL: string = 'http://' + this.root + '/api/tasks/removeTag';
  public deleteTaskURL: string = 'http://' + this.root + '/api/tasks/delete';
  public editTaskURL: string = 'http://' + this.root + '/api/tasks/update';
  public addTagtoTaskURL: string = 'http://' + this.root + '/api/tasks/addTag';

  /* Task Control URLs */
  public startTaskURL: string = 'http://' + this.root + '/api/tasks/';
  public stopTaskURL: string = 'http:://' + this.root + '/api/tasks/';
  public finishTaskURL: string = 'http:://' + this.root + '/api/tasks/';

  /*  Tag URLs */
  public createTagURL: string = 'http://' + this.root + '/api/tags/create';
  public getUserTagsURL: string = 'http://' + this.root + '/api/tags';
  public deleteTagURL: string = 'http://' + this.root + '/api/tags/delete';
  public editTagURL: string = 'http://' + this.root + '/api/tags/edit';


  /*  Setting URLs */
  public getUserSettingsURL: string = 'http://' + this.root + '/api/settings';
  public updateSettingsURL: string = 'http://' + this.root + '/api/settings';
  /*  Auth URLs */
  public loginURL: string = 'http://' + this.root + '/api/auth/login';
  public signupURL: string = 'http://' + this.root + '/api/auth/signup';
  public passwordResetURL: string = 'http://' + this.root + '/api/auth/reset/password';
  public changePasswordURL: string = 'http://' + this.root + '/api/auth/change/password';
  public deleteUserURL : string = 'http://' + this.root + '/api/auth/user/delete';

  /* Auth Token URLs */
  public setTokenURL: string = 'http://' + this.root + '/api/tokens/create';
  public removeTokenURL: string = 'http://' + this.root + '/api/tokens/delete';

  /* Team's URLs */
  public createTeamURL: string = 'http://' + this.root + '/api/teams/create';
  public getTeamsURL: string = 'http://' + this.root + '/api/teams/';
  public deleteTeamURL: string = 'http://' + this.root + '/api/teams/delete/';



  constructor(private http: HttpClient, private auth: AuthService) { }

  /* ============ Task Functions ========== */
  createTask(task: Task): Observable<Task> {
    return this.http.post<Task>(this.createTaskURL, task, httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  getTask(taskID: number): Observable<Task> {
    return this.http.get<Task>(this.getUserTasksURL + taskID, httpOptions)
    .pipe(
      catchError(this.handleError)
    );
  }

  getUserTasks(userID: number): Observable<(Task[])> {
    return this.http.get<Task[]>(this.getUserTasksURL, {
      params: { userID: userID.toString() },
      headers: {
        Authorization: 'my-auth-token'
      }
    })
      .pipe(catchError(this.handleError));
  }

  removeTag(taskID: number, tagID: number): Observable<any> {
    return this.http.put(this.removeTagURL + '/' + taskID + '/' + tagID, httpOptions) //append taskID then tagID
      .pipe(
        catchError(this.handleError)
      );
  }

  addTag(taskID: number, tagID: number): Observable<any> {
    return this.http.put(this.addTagtoTaskURL + '/' + taskID + '/' + tagID, httpOptions)
    .pipe(
      catchError(this.handleError)
    );
  }

  getTaskTags(taskID: number): Observable<Tag[]> {
    return this.http.get<Tag[]>(this.getTaskTagsURL + '/' + taskID,
      {
        params: { taskID: taskID.toString() },
        headers: {
          Authorization: 'my-auth-token'
        }
      })
      .pipe(
        catchError(this.handleError)
      );
  }

  deleteTask(taskID: number): Observable<any> {
    return this.http.delete(this.deleteTaskURL + '/' + taskID, httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  editTask(taskID: number, edit: TaskEdit): Observable<any> {
    return this.http.put(this.editTaskURL + '/' + taskID, edit, httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  startTask(taskID: number): Observable<any> {
    return this.http.post(this.startTaskURL + taskID + '/start', '', httpOptions) //empty post
    .pipe(
      catchError(this.handleError)
    );
  }

  stopTask(taskID: number): Observable<any> {
    return this.http.post(this.startTaskURL + taskID + '/stop', '', httpOptions) //empty post
    .pipe(
      catchError(this.handleError)
    );
  }

  finishTask(taskID: number): Observable<any> {
    return this.http.post(this.startTaskURL + taskID + '/finish', '', httpOptions) //empty post
    .pipe(
      catchError(this.handleError)
    );
  }
  /* ==================================== */


  /* =======  Settings Functions ======== */
  getUserSettings(userID: number): Observable<Setting> {
    return this.http.get<Setting>(this.getUserSettingsURL,
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

  updateSettings(settings: Setting): Observable<Setting> {
    return this.http.put<Setting>(this.updateSettingsURL, settings, httpOptions)
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

  setAuthToken(token: TokenRequest) {
    return this.http.post<Token>(this.setTokenURL, token, httpOptions)
      .pipe(
        catchError(this.handleError)
      )
  }

  removeAuthToken(token: string) {
    return this.http.delete(this.removeTokenURL + '/' + token)
      .pipe(
        catchError(this.handleError)
      )
  }

  sendPasswordResetLink(request: PasswordResetRequest) {
    console.log(request);
    return this.http.post<PasswordResetResponse>(this.passwordResetURL, request, httpOptions) 
      .pipe(
        catchError(this.handleError)
      )
  }

  changePassword(request: ChangePasswordRequest) {
    return this.http.post<PasswordResetResponse>(this.changePasswordURL, request, httpOptions)
      .pipe(
        catchError(this.handleError)
      )
  }

  deleteUser(id) {
    return this.http.get(this.deleteUserURL + '/' + id, httpOptions)
    .pipe (
      catchError(this.handleError)
    )
  }

  createTeam(request: CreateTeamRequest) {
    return this.http.post<CreateTeamResponse>(this.createTeamURL, request, httpOptions)
    .pipe(
      catchError(this.handleError)
    )
  }

  getTeams(id) {
    return this.http.get(this.getTeamsURL + id, httpOptions)
    .pipe (
      catchError(this.handleError)
    )
  }

  deleteTeam(teamId: number): Observable<any> {
    return this.http.delete(this.deleteTeamURL + teamId, httpOptions)
      .pipe(
        catchError(this.handleError)
      );
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

interface Setting {
  theme: string
}

interface TagEdit {
  name: string,
  desc: string,
  color: string
};

interface TaskEdit {
  title: string,
  body: string,
  workedDuration: number,
  estimatedMin: number,
  estimatedHour: number,
  expDuration: number,
}

interface LoginRequest {
  email: string,
  password: string
}

interface SignUpRequest {
  name: string,
  email: string,
  password: string,
  settings: string
}

interface LoginResponse {
  access_token: string,
  expires_in: number,
  token_type: string,
  user: string
}

interface TokenRequest {
  userId: number,
  token: string
}

interface Token {
  user: number,
  token: string
}

interface PasswordResetRequest {
  email: string
}

interface PasswordResetResponse {
  response: string
}

interface ChangePasswordRequest {
  email: string,
  password: string,
  token: string
}

interface CreateTeamRequest {
  title: string,
  description: string,
  color: string
  userId: number,
}

interface CreateTeamResponse {
  message: string
}