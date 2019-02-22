import { async, ComponentFixture } from '@angular/core/testing';

import { NavigationComponent } from './navigation.component';
import { MaterialModule } from '../material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from '../home/home.component';
import { TagsComponent } from '../tags/tags.component';
import { ProfileComponent } from '../profile/profile.component';
import { CreateTaskComponent } from '../create-task/create-task.component';
import { LoginComponent } from '../login/login.component';
import { SignUpComponent } from '../sign-up/sign-up.component';
import {APP_BASE_HREF} from '@angular/common';
import { BackendService } from '../backend.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed, inject, getTestBed } from '@angular/core/testing';

let injector : TestBed;
let service: BackendService;
let httpMock : HttpTestingController;



const appRoutes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'tags', component: TagsComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'create/task', component: CreateTaskComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignUpComponent }, 
];

describe('NavigationComponent', () => {
  let component: NavigationComponent;
  let fixture: ComponentFixture<NavigationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NavigationComponent, HomeComponent, TagsComponent, ProfileComponent, CreateTaskComponent, LoginComponent, SignUpComponent ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
      imports: [ MaterialModule, ReactiveFormsModule, FormsModule, HttpClientTestingModule, RouterModule,
        RouterModule.forRoot(
          appRoutes,
          { enableTracing: true } 
        ),
       ],
       providers: [{provide: APP_BASE_HREF, useValue: '/'}]
    })
    .compileComponents();
    injector = getTestBed();
    service = injector.get(BackendService);
    httpMock = injector.get(HttpTestingController);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
