import { async, ComponentFixture, TestBed, getTestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MaterialModule } from '../material/material.module';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from '../home/home.component';
import { BackendService } from '../backend.service';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { APP_BASE_HREF } from '@angular/common';
import { CreateTeamComponent } from './create-team.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('CreateTeamComponent', () => {
  let component: CreateTeamComponent;
  let fixture: ComponentFixture<CreateTeamComponent>;
  let injector : TestBed;
  let service: BackendService;
  let httpMock : HttpTestingController;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateTeamComponent, HomeComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [BackendService, {provide: APP_BASE_HREF, useValue: '/'}],
      imports: [
        MaterialModule,
        HttpClientTestingModule, 
        ReactiveFormsModule,
        BrowserAnimationsModule,
        FormsModule,
        BrowserAnimationsModule,
        RouterModule.forRoot(
          [],
          { enableTracing: true } 
        ),
      ]
    })
    .compileComponents();
    injector = getTestBed();
    service = injector.get(BackendService);
    httpMock = injector.get(HttpTestingController);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateTeamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
