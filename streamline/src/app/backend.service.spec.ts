import { TestBed, inject, getTestBed } from '@angular/core/testing';

import { BackendService } from './backend.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MaterialModule } from './material/material.module';
import { APP_BASE_HREF } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';


const appRoutes: Routes = [
  { path: 'home', component: HomeComponent },
];

let injector : TestBed;
let service: BackendService;
let httpMock : HttpTestingController;

describe('BackendService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
    declarations: [HomeComponent],
      providers: [BackendService, {provide: APP_BASE_HREF, useValue: '/'}],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [HttpClientTestingModule, MaterialModule, ReactiveFormsModule, FormsModule,
      RouterModule.forRoot(
        appRoutes,
        { enableTracing: true }
      )
      ],
    });
    injector = getTestBed();
    service = injector.get(BackendService);
    httpMock = injector.get(HttpTestingController);

  });

  afterEach(() => {
    httpMock.verify();
  });

  

  it('should be created', inject([BackendService], (service: BackendService) => {
    expect(service).toBeTruthy();
  }));

  it ('signup should signup a user and return a Observable<LoginResponse>', () => {
        let request : any = {
          name : 'Automated Test Bill',
          email : 'email@EmailValidator.com',
          password : 'Password'
        }

        service.signup(request).subscribe(response => {
          expect(response).toEqual({
            access_token: 'token',
            expires_in: 10,
            token_type: 'type',
            user: 'Lars Deepspace'
          });
        })

        const req = httpMock.expectOne(`${service.signupURL}`);
        expect(req.request.method).toBe("POST");
        req.flush({
          access_token: 'token',
          expires_in: 10,
          token_type: 'type',
          user: 'Lars Deepspace'
        });
     });

  it ('login should login a user and return an Obeservable<LoginResponse>', () => {
    let request : any = {
      email: 'email@email.com',
      password: 'password'
    }

    service.login(request).subscribe(response => {
      expect(response).toEqual({
        access_token: 'token',
        expires_in: 10,
        token_type: 'type',
        user: 'Lars Deepspace'
      });
    })

    const req = httpMock.expectOne(`${service.loginURL}`);
    expect(req.request.method).toBe("POST");
    req.flush({
      access_token: 'token',
      expires_in: 10,
      token_type: 'type',
      user: 'Lars Deepspace'
    });
  });

  it ('Create Task should create a task and return an Obeservable<Task>', () => {
    let request : any = {
      id: 0,
      title: 'title',
      body: 'body',
      workedDuration: 0,
      lastWorkedAt: 0,
      estimatedMin: 20,
      estimatedHour: 20,
      expDuration: 0,
      isFinished: 0,
      tags: []
    }

    service.createTask(request).subscribe(response => {
      expect(response).toEqual( {
        id: 0,
        title: 'title',
        body: 'body',
        workedDuration: 0,
        lastWorkedAt: 0,
        estimatedMin: 20,
        estimatedHour: 20,
        expDuration: 0,
        isFinished: 0,
        tags: [],
      }
      );
    })

    const req = httpMock.expectOne(`${service.createTaskURL}`);
    expect(req.request.method).toBe("POST");
    req.flush(request);
  });

  it ('Get Task should get a task and return an observable<task>', () => {
    service.getTask(1).subscribe(response => {
      expect(response).toEqual( {
        id: 0,
        title: 'title',
        body: 'body',
        workedDuration: 0,
        lastWorkedAt: 0,
        estimatedMin: 20,
        estimatedHour: 20,
        expDuration: 0,
        isFinished: 0,
        tags: [],
      });
    })

    const req = httpMock.expectOne(`${service.getUserTasksURL}` + '1');
    expect(req.request.method).toBe("GET");
    req.flush( {
      id: 0,
        title: 'title',
        body: 'body',
        workedDuration: 0,
        lastWorkedAt: 0,
        estimatedMin: 20,
        estimatedHour: 20,
        expDuration: 0,
        isFinished: 0,
        tags: [],
    });    
  })

  it ('Get User Tasks should get a task and return an observable<task[]>', () => {
    service.getTask(1).subscribe(response => {
      expect(response).toEqual( [{
        id: 0,
        title: 'title',
        body: 'body',
        workedDuration: 0,
        lastWorkedAt: 0,
        estimatedMin: 20,
        estimatedHour: 20,
        expDuration: 0,
        isFinished: 0,
        tags: [],
      }]);
    })

    const req = httpMock.expectOne(`${service.getUserTasksURL}` + '1');
    expect(req.request.method).toBe("GET");
    req.flush( [{
      id: 0,
        title: 'title',
        body: 'body',
        workedDuration: 0,
        lastWorkedAt: 0,
        estimatedMin: 20,
        estimatedHour: 20,
        expDuration: 0,
        isFinished: 0,
        tags: [],
    }]);    
  })


  it ('Delete task should request to delete a task from the database', () => {
    service.deleteTask(1).subscribe(res => {
      expect(res).toEqual({
        message: 'success'
      })
    })


    const req = httpMock.expectOne(`${service.deleteTaskURL}` + '/1');
    expect(req.request.method).toBe("DELETE");
    req.flush({
      message: 'success'
    })
  })


  it ('Edit task should edit a task in the database', () => {
    let request = {
      title: '',
      body: '',
      workedDuration: 0,
      estimatedMin: 0,
      estimatedHour: 0,
      expDuration: 0
    }

    service.editTask(1, request).subscribe(res => {
      expect(res).toEqual([]);
    })

    const req = httpMock.expectOne(`${service.editTaskURL}` + '/1');
    expect(req.request.method).toBe("PUT");
    req.flush([])
  })

  it ('Start task should request to start a task in our database', () => {
    service.startTask(1).subscribe(res => {
      expect(res).toEqual([]);
    })

    const req = httpMock.expectOne(`${service.startTaskURL}` + '1' + '/start');
    expect(req.request.method).toBe("POST");
    req.flush([])
  })


});




