import { TestBed, inject } from '@angular/core/testing';

import { BackendService } from './backend.service';
import { HttpClientModule } from '@angular/common/http';
import { MaterialModule } from './material/material.module';


describe('BackendService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BackendService],
      imports: [HttpClientModule, MaterialModule],
    });
  });

  it('should be created', inject([BackendService], (service: BackendService) => {
    expect(service).toBeTruthy();
  }));
});
