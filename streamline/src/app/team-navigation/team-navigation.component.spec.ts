import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamNavigationComponent } from './team-navigation.component';

describe('TeamNavigationComponent', () => {
  let component: TeamNavigationComponent;
  let fixture: ComponentFixture<TeamNavigationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeamNavigationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamNavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
