import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifyActivityComponent } from './verify-activity.component';

describe('VerifyActivityComponent', () => {
  let component: VerifyActivityComponent;
  let fixture: ComponentFixture<VerifyActivityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VerifyActivityComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VerifyActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
