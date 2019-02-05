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

const appRoutes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'tags', component: TagsComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'create/task', component: CreateTaskComponent },
  { path: 'login', component: LoginComponent }
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
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true } 
    ),
  ],
  providers: [ 
    {provide: HAMMER_GESTURE_CONFIG, useClass: GestureConfig},
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
