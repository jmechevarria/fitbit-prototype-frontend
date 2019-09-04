import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FitbitDataComponent } from './fitbit-data.component';

describe('FitbitDataComponent', () => {
  let component: FitbitDataComponent;
  let fixture: ComponentFixture<FitbitDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FitbitDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FitbitDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
