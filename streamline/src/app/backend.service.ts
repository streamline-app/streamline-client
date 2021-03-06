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
    'Authorization': 'Basic ' + btoa('user1:abc123')
  })
};

@Injectable({
  providedIn: 'root'
})
export class BackendService {

  public root: string = 'localhost:8000';
  // public analRoot: string = 'localhost:8080';
  public analRoot: string = 'localhost:8080'
  //public analRoot: string = 'streamline-scott.us-east-2.elasticbeanstalk.com';


  /* User URLs */
  public getUserIDfromNameURL: string = 'http://' + this.analRoot + '/api/users/identity/'
  public getTeamIDfromNameURL: string = 'http://' + this.analRoot + '/api/teams/identity/'
  public getProfileInfoURL: string = 'http://' + this.analRoot + '/api/users/';
  public getTagDataURL: string = 'http://' + this.analRoot + '/api/users/';
  public estimationDataURL: string = 'http://' + this.analRoot + '/api/users/'

  /* Task URLs */
  public createTaskURL: string = 'http://' + this.root + '/api/tasks/create';
  public getUserTasksURL: string = 'http://' + this.root + '/api/tasks/';
  public getTaskTagsURL: string = 'http://' + this.root + '/api/tasks/tags';
  public removeTagURL: string = 'http://' + this.root + '/api/tasks/removeTag';
  public deleteTaskURL: string = 'http://' + this.root + '/api/tasks/delete';
  public editTaskURL: string = 'http://' + this.root + '/api/tasks/update';
  public addTagtoTaskURL: string = 'http://' + this.root + '/api/tasks/addTag';
  public assignUserToTaskURL: string = 'http://' + this.root + '/api/tasks/';

  public getPredictionURL: string = 'http://' + this.analRoot + '/api/users/'; //append user UUID and /predictions

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
  public deleteUserURL: string = 'http://' + this.root + '/api/auth/user/delete';

  /* Auth Token URLs */
  public setTokenURL: string = 'http://' + this.root + '/api/tokens/create';
  public removeTokenURL: string = 'http://' + this.root + '/api/tokens/delete';

  /* Team's URLs */
  public createTeamURL: string = 'http://' + this.root + '/api/teams/create';
  public getTeamsURL: string = 'http://' + this.root + '/api/teams/';
  public deleteTeamURL: string = 'http://' + this.root + '/api/teams/delete/';
  public getTeamUrl: string = 'http://' + this.root + '/api/team/';
  public getTeamMembersURL: string = 'http://' + this.root + '/api/teams/members/';
  public leaveTeamURL: string = 'http://' + this.root + '/api/teams/leave';
  public getTeamTasksURL: string = 'http://' + this.root + '/api/teamtasks';
  public getTeamTagsURL: string = 'http://' + this.root + '/api/teamtags';
  public updateTeamURL: string = 'http://' + this.root + '/api/teams/update/';
  public promoteTeamMemberURL: string = 'http://' + this.root + '/api/teams/promote';
  public demoteTeamMemberURL: string = 'http://' + this.root + '/api/teams/demote';
  public checkTeamAdminURL: string = 'http://' + this.root + '/api/teams/checkAdmin';
  public transferTeamOwnershipURL: string = 'http://' + this.root + '/api/teams/transfer';

  public uploadFileURL: string = 'http://' + this.root + '/api/team/upload/';
  public getTeamFilesURL: string = 'http://' + this.root + '/api/team/fetchDocs/'
  public downloadFileURL: string = 'http://' + this.root + '/api/team/downloadDoc/'

  public getUserIdURL: string = 'http://' + this.root + '/api/user/';

  /* Invitation URLs */
  public sendInvitationURL: string = 'http://' + this.root + '/api/invitations/create';
  public sentInvitationsURL: string = 'http://' + this.root + '/api/sentInvitations/';
  public recievedInvitationsURL: string = 'http://' + this.root + '/api/recievedInvitations/';
  public acceptInvitationURL: string = 'http://' + this.root + '/api/invitations/accept';
  public declineInvitationURL: string = 'http://' + this.root + '/api/invitations/decline';
  public revokeInvitationURL: string = 'http://' + this.root + '/api/invitations/revoke';

  public favoriteTeamMemberURL: string = 'http://' + this.root + '/api/favorite/favoriteTeamMember';
  public unFavoriteTeamMemberURL: string = 'http://' + this.root + '/api/favorite/unFavoriteTeamMember';
  public getFavoritesURL: string = 'http://' + this.root + '/api/favorite/getFavorites/';
  public getFavoriteEmailsURL: string = 'http://' + this.root + '/api/favorite/getFavoriteEmails/';


  constructor(private http: HttpClient, private auth: AuthService) { }
  /* ============ Profile Functions ========= */
  getUUID(ID: number, isUser: boolean) {
    if (isUser) {
      return this.http.get<string>(this.getUserIDfromNameURL + ID, httpOptions)
        .pipe(
          catchError(this.handleError)
        );
    }
    else { //is team
      return this.http.get<string>(this.getTeamIDfromNameURL + ID, httpOptions)
        .pipe(
          catchError(this.handleError)
        );
    }
  }

  getProfileInfo(UUID: string) { //MUST USE UUID OF ANALYTICS
    return this.http.get<UserDataResponse>(this.getProfileInfoURL + UUID, httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  getTagData(UUID: string, tagName: string) { //MUST USE UUID OF ANALYTICS
    return this.http.get<UserDataResponse>(this.getTagDataURL + UUID, {
      params: { tags: tagName },
      headers: {
        Authorization: 'my-auth-token'
      }
    })
      .pipe(
        catchError(this.handleError)
      );
  }

  getEstimationData(UUID: string) {
    return this.http.get<any>(this.estimationDataURL + UUID + '/tasks/timeseries', httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  /* ======================================= */
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

  finishTask(taskID: number): Observable<FinishResponse> {
    return this.http.post<FinishResponse>(this.startTaskURL + taskID + '/finish', '', httpOptions) //empty post
      .pipe(
        catchError(this.handleError)
      );
  }

  getPrediction(UUID: string, taskData: TaskData) {
    return this.http.post<string>(this.getPredictionURL + UUID + '/predictions', taskData, httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }
  
  assignUserToTask(taskId: number, userId: number) {
    return this.http.get(this.assignUserToTaskURL + taskId + '/assign/' + userId )
    .pipe(
      catchError(this.handleError)
    )
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
      .pipe(
        catchError(this.handleError)
      )
  }

  createTeam(request: CreateTeamRequest) {
    return this.http.post<CreateTeamResponse>(this.createTeamURL, request, httpOptions)
      .pipe(
        catchError(this.handleError)
      )
  }

  transferTeamOwnership(request: TransferOwnershipRequest) {
    return this.http.post<TransferOwnershipResponse>(this.transferTeamOwnershipURL, request, httpOptions)
    .pipe(
      catchError(this.handleError)
    )
  }

  getTeams(id) {
    return this.http.get(this.getTeamsURL + id, httpOptions)
      .pipe(
        catchError(this.handleError)
      )
  }

  getTeam(id) {
    return this.http.get(this.getTeamUrl + id, httpOptions)
      .pipe(
        catchError(this.handleError)
      )
  }

  deleteTeam(teamId: number): Observable<any> {
    return this.http.delete(this.deleteTeamURL + teamId, httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  favoriteTeamMember(request: FavoriteRequest) {
    return this.http.post<FavoriteResponse>(this.favoriteTeamMemberURL, request, httpOptions)
      .pipe(
        catchError(this.handleError)
      )
  }

  unFavoriteTeamMember(request: FavoriteRequest) {
    return this.http.post<FavoriteResponse>(this.unFavoriteTeamMemberURL, request, httpOptions)
      .pipe(
        catchError(this.handleError)
      )
  }

  getFavoriteTeamMembers(id: number) {
    return this.http.get(this.getFavoritesURL + id, httpOptions)
      .pipe(
        catchError(this.handleError)
      )
  }

  getFavoriteTeamMemberEmails(id: number) {
    return this.http.get(this.getFavoriteEmailsURL + id, httpOptions)
      .pipe(
        catchError(this.handleError)
      )
  }

  getUserId(email: string) {
    return this.http.get(this.getUserIdURL + email, httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  sendInvitation(request) {
    return this.http.post<InvitationResponse>(this.sendInvitationURL, request, httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  sentInvitations(id) {
    return this.http.get(this.sentInvitationsURL + id, httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  recievedInvitations(id) {
    return this.http.get(this.recievedInvitationsURL + id, httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  acceptInvitation(request: InvRequest) {
    return this.http.post<InvitationResponse>(this.acceptInvitationURL, request, httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  declineInvitation(request: InvRequest) {
    return this.http.post<InvitationResponse>(this.declineInvitationURL, request, httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  revokeInvitation(request: RevokeInvRequest) {
    return this.http.post<InvitationResponse>(this.revokeInvitationURL, request, httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  getTeamMembers(id) {
    return this.http.get(this.getTeamMembersURL + id, httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  leaveTeam(request: LeaveTeamRequest) {
    return this.http.post(this.leaveTeamURL, request, httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  promoteTeamMember(request: PromoteTeamMemberRequest) {
    return this.http.post<PromotionResponse>(this.promoteTeamMemberURL, request, httpOptions)
      .pipe(
        catchError(this.handleError)
      )
  }

  checkTeamAdmin(request: CheckAdminRequest) {
    return this.http.post<any[]>(this.checkTeamAdminURL, request, httpOptions)
      .pipe(
        catchError(this.handleError)
      )
  }

  demoteTeamMember(request: PromoteTeamMemberRequest) {
    return this.http.post<PromotionResponse>(this.demoteTeamMemberURL, request, httpOptions)
      .pipe(
        catchError(this.handleError)
      )
  }

  uploadFile(file: File, teamID: number) {
    let header = new HttpHeaders();
    header.append('Authorization', 'Basic ' + btoa('user1:abc123'));

    let formData = new FormData();
    formData.append('teamID', '' + teamID);
    formData.append('upload', file);

    console.log(formData.get('teamID'));

    return this.http.post(this.uploadFileURL, formData, { headers: header })
      .pipe(
        catchError(this.handleError)
      );
  }

  getTeamFiles(teamID: number): Observable<FileHandle[]> {
    return this.http.get<FileHandle[]>(this.getTeamFilesURL + teamID, httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  downloadFile(docID: number) {
    return this.http.options(this.downloadFileURL + docID, {
      observe: 'response',
      responseType: 'blob',
      headers: {
        'Content-Type': 'application/pdf',
        'Authorization': 'Basic ' + btoa('user1:abc123'),
      }
    })
      .pipe(
        catchError(this.handleError)
      );
  }

  getTeamTasks(teamID: number): Observable<(Task[])> {
    return this.http.get<Task[]>(this.getTeamTasksURL, {
      params: { teamID: teamID.toString() },
      headers: {
        Authorization: 'my-auth-token'
      }
    })
      .pipe(catchError(this.handleError));
  }

  getTeamTags(teamID: number): Observable<(Tag[])> {
    return this.http.get<Tag[]>(this.getTeamTagsURL, {
      params: { teamID: teamID.toString() },
      headers: {
        Authorization: 'my-auth-token'
      }
    })
      .pipe(catchError(this.handleError));
  }

  updateTeam(teamID: number, edit: TeamEditRequest): Observable<any> {
    return this.http.put(this.updateTeamURL + teamID, edit, httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }


  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error);
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

export interface TaskEdit {
  title: string,
  body: string,
  workedDuration: number,
  estimatedMin: number,
  estimatedHour: number,
  expDuration: number,
  completeDate: string
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

export interface UserDataResponse {
  avgTaskTime: number,
  taskEstFactor: number,
  totalOverTasks: number,
  totalTasksCompleted: number,
  totalUnderTasks: 0
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

interface InvitationResponse {
  message: string
}

interface InvRequest {
  userId: number,
  teamId: number,
  invitationId: number
}

interface LeaveTeamRequest {
  user: number,
  team: number
}

interface TeamEditRequest {
  title: string,
  description: string,
  color: string
}

interface FinishResponse {
  expDuration: number,
  actualDuration: number
}

export interface FileHandle {
  fileName: string,
  fileID: number
}

interface FavoriteRequest {
  user: number,
  favorite: number
}

interface FavoriteResponse {
  message: string
}

interface RevokeInvRequest {
  id: number
}

interface PromoteTeamMemberRequest {
  id: number,
  teamId: number,
  promotion: string
}

interface PromotionResponse {
  message: string
}

interface CheckAdminRequest {
  id: number,
  teamId: number
}

export interface TaskData {
  actualDuration: number,
  expDuration: number,
  tags?: string[]
}

interface TransferOwnershipRequest {
  previous: number,
  newOwner: number,
  team: number
}

interface TransferOwnershipResponse {
  message: string
}