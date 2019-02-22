import { async, ComponentFixture, TestBed, getTestBed } from '@angular/core/testing';
import { MaterialModule } from '../material/material.module';

import { TagsComponent } from './tags.component';
import { BackendService } from '../backend.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Routes, RouterModule } from '@angular/router';
import { APP_BASE_HREF } from '@angular/common';
import { HomeComponent } from '../home/home.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

const appRoutes: Routes = [
  { path: 'home', component: HomeComponent },

];

describe('TagsComponent', () => {
  let component: TagsComponent;
  let fixture: ComponentFixture<TagsComponent>;
  let injector : TestBed;
  let service: BackendService;
  let httpMock : HttpTestingController;


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TagsComponent, HomeComponent ],
      providers: [BackendService, {provide: APP_BASE_HREF, useValue: '/'}],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [
        MaterialModule,
        HttpClientTestingModule, 
        ReactiveFormsModule,
        FormsModule,
        RouterModule.forRoot(
          appRoutes,
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
    fixture = TestBed.createComponent(TagsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
