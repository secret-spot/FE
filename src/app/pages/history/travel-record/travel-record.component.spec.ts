import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TravelRecordComponent } from './travel-record.component';

describe('TravelRecordComponent', () => {
  let component: TravelRecordComponent;
  let fixture: ComponentFixture<TravelRecordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TravelRecordComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TravelRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
