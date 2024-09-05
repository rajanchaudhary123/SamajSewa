import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditActComponent } from './edit-act.component';

describe('EditActComponent', () => {
  let component: EditActComponent;
  let fixture: ComponentFixture<EditActComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditActComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditActComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
