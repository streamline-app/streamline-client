import { async, ComponentFixture, TestBed, getTestBed } from '@angular/core/testing';
import { MaterialModule } from '../material/material.module';
import { SettingsComponent } from './settings.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BackendService } from '../backend.service';
import { APP_BASE_HREF } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomeComponent } from '../home/home.component';


describe('SettingsComponent', () => {
  let component: SettingsComponent;
  let fixture: ComponentFixture<SettingsComponent>;
  let injector : TestBed;
  let service: BackendService;
  let httpMock : HttpTestingController;

  const appRoutes: Routes = [
    { path: 'login', component: HomeComponent },
  ];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SettingsComponent, HomeComponent ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
      providers: [BackendService, {provide: APP_BASE_HREF, useValue: '/'}],
      imports: [
        MaterialModule,
        HttpClientTestingModule, 
        BrowserAnimationsModule, 
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
    fixture = TestBed.createComponent(SettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
