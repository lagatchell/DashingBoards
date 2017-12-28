import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartPrintComponent } from './chart-print.component';

describe('ChartPrintComponent', () => {
  let component: ChartPrintComponent;
  let fixture: ComponentFixture<ChartPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChartPrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
