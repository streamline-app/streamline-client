import { async, ComponentFixture, TestBed, getTestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PasswordResetFormComponent } from './password-reset-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '../material/material.module';
import { Routes, RouterModule } from '@angular/router';
import { APP_BASE_HREF } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { LoginComponent } from '../login/login.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { BackendService } from '../backend.service';




describe('PasswordResetFormComponent', () => {
  let component: PasswordResetFormComponent;
  let fixture: ComponentFixture<PasswordResetFormComponent>;
  let injector : TestBed;
  let service: BackendService;
  let httpMock : HttpTestingController;

  const appRoutes: Routes = [
    { path: 'login', component: LoginComponent },
  ];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PasswordResetFormComponent, LoginComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [BackendService, {provide: APP_BASE_HREF, useValue: '/'}],
      imports: [HttpClientTestingModule, MaterialModule, BrowserAnimationsModule, FormsModule, ReactiveFormsModule, RouterModule.forRoot(
        appRoutes,
        {enableTracing: true}
      )]
    })
    .compileComponents();
    injector = getTestBed();
    service = injector.get(BackendService);
    httpMock = injector.get(HttpTestingController);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PasswordResetFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
