import { BrowserModule, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { GestureConfig } from '@angular/material';
import { MaterialModule } from './material/material.module';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { TagsComponent, CreateTagDialog, DeleteConfirmDialog, EditTagDialog } from './tags/tags.component';
import { ProfileComponent } from './profile/profile.component';
import { CreateTaskComponent, TaskCreateTagDialog } from './create-task/create-task.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './login/login.component';
import { NavigationComponent } from './navigation/navigation.component';
import { FormsModule } from '@angular/forms';
import { SignUpComponent } from './sign-up/sign-up.component';
import { AuthService } from './auth.service';
import { TasksComponent } from './tasks/tasks.component';


const appRoutes: Routes = [
  { path: 'home', component: HomeComponent, canActivate: [AuthService] },
  { path: 'tags', component: TagsComponent, canActivate: [AuthService] },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthService] },
  { path: 'create/task', component: CreateTaskComponent, canActivate: [AuthService] },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignUpComponent }, 
];

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    TagsComponent,
    CreateTagDialog,
    DeleteConfirmDialog,
    EditTagDialog,
    ProfileComponent,
    CreateTaskComponent,
    LoginComponent,
    NavigationComponent,
    SignUpComponent,
    TasksComponent,
    TaskCreateTagDialog
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true } 
    ),
  ],
  providers: [ 
    {provide: HAMMER_GESTURE_CONFIG, useClass: GestureConfig},
  ],
  bootstrap: [AppComponent],
  entryComponents: [CreateTagDialog, DeleteConfirmDialog, EditTagDialog, TaskCreateTagDialog]
})
export class AppModule { }
