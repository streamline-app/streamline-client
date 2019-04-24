import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferTeamOwnershipComponent } from './transfer-team-ownership.component';

describe('TransferTeamOwnershipComponent', () => {
  let component: TransferTeamOwnershipComponent;
  let fixture: ComponentFixture<TransferTeamOwnershipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransferTeamOwnershipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransferTeamOwnershipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
