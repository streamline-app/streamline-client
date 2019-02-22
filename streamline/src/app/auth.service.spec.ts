import { TestBed, inject } from '@angular/core/testing';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate, Routes, RouterModule } from '@angular/router';
import { Observable } from 'rxjs';


import { AuthService } from './auth.service';
import { LoginComponent } from './login/login.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { APP_BASE_HREF } from '@angular/common';
import { ReactiveFormsModule, FormsModule} from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MaterialModule } from './material/material.module';




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
  });

  it('should be created', inject([AuthService], (service: AuthService) => {
    expect(service).toBeTruthy();
  }));
});
