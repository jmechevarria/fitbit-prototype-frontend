import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FitbitClientIDFormComponent } from './fitbit-client-idform.component';

describe('FitbitClientIDFormComponent', () => {
  let component: FitbitClientIDFormComponent;
  let fixture: ComponentFixture<FitbitClientIDFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FitbitClientIDFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FitbitClientIDFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
