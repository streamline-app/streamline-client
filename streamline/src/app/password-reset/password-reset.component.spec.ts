import { async, ComponentFixture, TestBed, getTestBed } from '@angular/core/testing';
import { PasswordResetComponent } from './password-reset.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MaterialModule } from '../material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { APP_BASE_HREF } from '@angular/common';
import { LoginComponent } from '../login/login.component';
import { BackendService } from '../backend.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

const appRoutes: Routes = [
  { path: 'login', component: LoginComponent },
];


describe('PasswordResetComponent', () => {
  let component: PasswordResetComponent;
  let fixture: ComponentFixture<PasswordResetComponent>;
  let injector : TestBed;
  let service: BackendService;
  let httpMock : HttpTestingController;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PasswordResetComponent, LoginComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [BackendService, {provide: APP_BASE_HREF, useValue: '/'}],
      imports: [
        MaterialModule,
        ReactiveFormsModule, 
        BrowserAnimationsModule,
        HttpClientTestingModule,
        FormsModule,
        RouterModule.forRoot(
          appRoutes,
          {enableTracing: true}
        )
      ]
    })
    .compileComponents();
    injector = getTestBed();
    service = injector.get(BackendService);
    httpMock = injector.get(HttpTestingController);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PasswordResetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
