import { TestBed, inject, getTestBed } from '@angular/core/testing';

import { BackendService } from './backend.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MaterialModule } from './material/material.module';

let injector : TestBed;
let service: BackendService;
let httpMock : HttpTestingController;

describe('BackendService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BackendService],
      imports: [HttpClientTestingModule, MaterialModule],
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
      estimatedMin: 20,
      estimatedHour: 20,
      expDuration: 0,
      tags: []
    }

    service.createTask(request).subscribe(response => {
      expect(response).toEqual( {
        id: 0,
        title: 'title',
        body: 'body',
        estimatedMin: 20,
        estimatedHour: 20,
        expDuration: 0,
        tags: [],
      }
      );
    })

    const req = httpMock.expectOne(`${service.createTaskURL}`);
    expect(req.request.method).toBe("POST");
    req.flush(request);
  });

});




