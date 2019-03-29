import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccuracyGraphComponent } from './accuracy-graph.component';

describe('AccuracyGraphComponent', () => {
  let component: AccuracyGraphComponent;
  let fixture: ComponentFixture<AccuracyGraphComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccuracyGraphComponent ]
    })
    .compileComponents();
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
