import { async, ComponentFixture, TestBed, getTestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MaterialModule } from '../material/material.module';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from '../home/home.component';
import { BackendService } from '../backend.service';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { APP_BASE_HREF } from '@angular/common';
import { AccuracyGraphComponent } from './accuracy-graph.component';

describe('AccuracyGraphComponent', () => {
  let component: AccuracyGraphComponent;
  let fixture: ComponentFixture<AccuracyGraphComponent>;
  let injector : TestBed;
  let service: BackendService;
  let httpMock : HttpTestingController;

  const appRoutes: Routes = [
    { path: 'home', component: HomeComponent },
  ];
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccuracyGraphComponent, HomeComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [BackendService, {provide: APP_BASE_HREF, useValue: '/'}],
      imports: [
        MaterialModule,
        HttpClientTestingModule, 
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
    fixture = TestBed.createComponent(AccuracyGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
