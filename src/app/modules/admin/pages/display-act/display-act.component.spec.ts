import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayActComponent } from './display-act.component';

describe('DisplayActComponent', () => {
  let component: DisplayActComponent;
  let fixture: ComponentFixture<DisplayActComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DisplayActComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DisplayActComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
