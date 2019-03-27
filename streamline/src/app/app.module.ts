import { BrowserModule, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { GestureConfig } from '@angular/material';
import { MaterialModule } from './material/material.module';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { TagsComponent } from './tags/tags.component';
import { ProfileComponent } from './profile/profile.component';
import { CreateTaskComponent } from './create-task/create-task.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './login/login.component';
import { NavigationComponent } from './navigation/navigation.component';
import { FormsModule } from '@angular/forms';
import { SignUpComponent } from './sign-up/sign-up.component';
import { AuthService } from './auth.service';
import { TasksComponent } from './tasks/tasks.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtInterceptor } from './jwt.interceptor';
import { DialogsModule, DeleteConfirmDialog, ConfirmLeaveDialog, EditTagDialog, CreateTagDialog, EditTaskDialog, UnregisterDialog, AddTagDialog } from './dialogs/dialogs.module';
import { PasswordResetComponent } from './password-reset/password-reset.component';
import { PasswordResetFormComponent } from './password-reset-form/password-reset-form.component';
import { SettingsComponent } from './settings/settings.component';
import { CreateTeamComponent } from './create-team/create-team.component';
import { TeamsComponent } from './teams/teams.component';
import { ManageTeamComponent } from './manage-team/manage-team.component';
import { InvitationsComponent } from './invitations/invitations.component';
import { TeamNavigationComponent } from './team-navigation/team-navigation.component';

const appRoutes: Routes = [
  { path: 'home', component: HomeComponent, canActivate: [AuthService] },
  { path: 'tags', component: TagsComponent, canActivate: [AuthService] },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthService] },
  { path: 'create/task', component: CreateTaskComponent, canActivate: [AuthService] },
  { path: 'create/team', component: CreateTeamComponent, canActivate: [AuthService] },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignUpComponent }, 
  { path: 'reset/password', component: PasswordResetComponent},
  { path: 'reset/password/form', component: PasswordResetFormComponent},
  { path: 'settings', component: SettingsComponent, canActivate: [AuthService] },
  { path: 'teams', component: TeamsComponent, canActivate: [AuthService] },
  { path: 'teams/:id', component: ManageTeamComponent, canActivate: [AuthService]},
  { path: 'invitations', component: InvitationsComponent, canActivate: [AuthService]}
];

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    TagsComponent,
    ProfileComponent,
    CreateTaskComponent,
    LoginComponent,
    NavigationComponent,
    SignUpComponent,
    TasksComponent,
    DeleteConfirmDialog,
    ConfirmLeaveDialog,
    CreateTagDialog,
    EditTagDialog,
    EditTaskDialog,
    UnregisterDialog,
    AddTagDialog,
    PasswordResetComponent,
    PasswordResetFormComponent,
    SettingsComponent,
    CreateTeamComponent,
    TeamsComponent,
    ManageTeamComponent,
    InvitationsComponent,
    TeamNavigationComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
    DialogsModule,
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true } 
    ),
  ],
  providers: [ 
    {provide: HAMMER_GESTURE_CONFIG, useClass: GestureConfig},
    {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true}
  ],
  bootstrap: [AppComponent],
  entryComponents: [DeleteConfirmDialog, ConfirmLeaveDialog, EditTagDialog, CreateTagDialog, EditTaskDialog, UnregisterDialog, AddTagDialog]
})
export class AppModule { }

export interface Tag {
  id: number,
  name: string,
  description: string,
  tasks_comp: number,
  average_time: number,
  average_acc: number,
  task_overunder: number,
  color: string,
  team: number
  userID: number
};

export interface Task {
  id: number;
  title: string,
  body: string,
  workedDuration: number,
  estimatedMin: number,
  estimatedHour: number,
  lastWorkedAt: number,
  expDuration: number,
  isFinished: number,
  priority: number,
  completeDate: Date,
  created_at: Date, //matches laravel column
  team: number,
  tags: Tag[]
};

export interface Team {
  id: number,
  owner: number,
  name: string,
  description: string,
  color: string,
  created_at: string,
  updated_at: string
}