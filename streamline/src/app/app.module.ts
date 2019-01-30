import { BrowserModule } from '@angular/platform-browser';
import { MaterialModule } from './material/material.module';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { TagsComponent } from './tags/tags.component';
import { ProfileComponent } from './profile/profile.component';

const appRoutes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'tags', component: TagsComponent },
  { path: 'profile', component: ProfileComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    TagsComponent,
    ProfileComponent,
  ],
  imports: [
    BrowserModule,
    MaterialModule,
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true } 
    )
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
