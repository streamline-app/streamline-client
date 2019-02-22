import { TestBed, inject, getTestBed } from '@angular/core/testing';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate, Routes, RouterModule } from '@angular/router';
import { Observable } from 'rxjs';


import { AuthService } from './auth.service';
import { LoginComponent } from './login/login.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { APP_BASE_HREF } from '@angular/common';
import { ReactiveFormsModule, FormsModule} from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MaterialModule } from './material/material.module';


let injector : TestBed;
let service: AuthService;

const appRoutes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignUpComponent }, 
];

describe('AuthService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LoginComponent, SignUpComponent, ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
      providers: [AuthService, {provide: APP_BASE_HREF, useValue: '/'}],
      imports: [
        ReactiveFormsModule,
        FormsModule,
        MaterialModule,
        RouterModule.forRoot(
          appRoutes,
          { enableTracing: true } 
        ),
      ]
    });

    injector = getTestBed();
    service = injector.get(AuthService);

  });

  it('should be created', inject([AuthService], (service: AuthService) => {
    expect(service).toBeTruthy();
  }));

  it ('should set user id', () => {
    service.setUserId(1);
    expect(service.getUserId()).toEqual(1);
  })

  it ('should get the user id', () => {
    service.setUserId(1);
    expect(service.getUserId()).toEqual(1);
  })

  it ('should set the user name', () => {
    service.setUserName('Dan');
    expect(service.getUserName()).toEqual('Dan');
  })

  it ('should get the user name', () => {
    service.setUserName('Dan');
    expect(service.getUserName()).toEqual('Dan');
  })

  it ('should set a token', () => {
    service.setToken('eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC9sb2NhbGhvc3Q6ODAwMFwvYXBpXC9hdXRoXC9sb2dpbiIsImlhdCI6MTU1MDgwNTIzMiwiZXhwIjoxNTUwODA4ODMyLCJuYmYiOjE1NTA4MDUyMzIsImp0aSI6Ik1JaGwxRHROYUlES1lrQVoiLCJzdWIiOjEsInBydiI6Ijg3ZTBhZjFlZjlmZDE1ODEyZmRlYzk3MTUzYTE0ZTBiMDQ3NTQ2YWEifQ.zzwuWXwAS8vDjzQLRI72q_29kMqr6kPc_irT4vTNd3Y');
    expect(service.getToken()).toEqual('eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC9sb2NhbGhvc3Q6ODAwMFwvYXBpXC9hdXRoXC9sb2dpbiIsImlhdCI6MTU1MDgwNTIzMiwiZXhwIjoxNTUwODA4ODMyLCJuYmYiOjE1NTA4MDUyMzIsImp0aSI6Ik1JaGwxRHROYUlES1lrQVoiLCJzdWIiOjEsInBydiI6Ijg3ZTBhZjFlZjlmZDE1ODEyZmRlYzk3MTUzYTE0ZTBiMDQ3NTQ2YWEifQ.zzwuWXwAS8vDjzQLRI72q_29kMqr6kPc_irT4vTNd3Y');
  })

  it ('should get a token', () => {
    service.setToken('eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC9sb2NhbGhvc3Q6ODAwMFwvYXBpXC9hdXRoXC9sb2dpbiIsImlhdCI6MTU1MDgwNTIzMiwiZXhwIjoxNTUwODA4ODMyLCJuYmYiOjE1NTA4MDUyMzIsImp0aSI6Ik1JaGwxRHROYUlES1lrQVoiLCJzdWIiOjEsInBydiI6Ijg3ZTBhZjFlZjlmZDE1ODEyZmRlYzk3MTUzYTE0ZTBiMDQ3NTQ2YWEifQ.zzwuWXwAS8vDjzQLRI72q_29kMqr6kPc_irT4vTNd3Y');
    expect(service.getToken()).toEqual('eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC9sb2NhbGhvc3Q6ODAwMFwvYXBpXC9hdXRoXC9sb2dpbiIsImlhdCI6MTU1MDgwNTIzMiwiZXhwIjoxNTUwODA4ODMyLCJuYmYiOjE1NTA4MDUyMzIsImp0aSI6Ik1JaGwxRHROYUlES1lrQVoiLCJzdWIiOjEsInBydiI6Ijg3ZTBhZjFlZjlmZDE1ODEyZmRlYzk3MTUzYTE0ZTBiMDQ3NTQ2YWEifQ.zzwuWXwAS8vDjzQLRI72q_29kMqr6kPc_irT4vTNd3Y');
  })

  it ('should validate a token', () => {
    service.setToken('eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC9sb2NhbGhvc3Q6ODAwMFwvYXBpXC9hdXRoXC9sb2dpbiIsImlhdCI6MTU1MDgwNTIzMiwiZXhwIjoxNTUwODA4ODMyLCJuYmYiOjE1NTA4MDUyMzIsImp0aSI6Ik1JaGwxRHROYUlES1lrQVoiLCJzdWIiOjEsInBydiI6Ijg3ZTBhZjFlZjlmZDE1ODEyZmRlYzk3MTUzYTE0ZTBiMDQ3NTQ2YWEifQ.zzwuWXwAS8vDjzQLRI72q_29kMqr6kPc_irT4vTNd3Y');
    expect(service.isValidToken()).toEqual(true);
  })
});
 