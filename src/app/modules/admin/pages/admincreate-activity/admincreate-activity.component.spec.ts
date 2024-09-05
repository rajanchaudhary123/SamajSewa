import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmincreateActivityComponent } from './admincreate-activity.component';

describe('AdmincreateActivityComponent', () => {
  let component: AdmincreateActivityComponent;
  let fixture: ComponentFixture<AdmincreateActivityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdmincreateActivityComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdmincreateActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
