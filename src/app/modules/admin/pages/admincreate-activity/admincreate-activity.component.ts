import { Component, OnDestroy, OnInit } from '@angular/core';
import { SnackBarService } from '../../../auth/services/snack-bar.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ActivityService } from '../../../user/services/activity.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Subscription } from 'rxjs';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-admincreate-activity',
  templateUrl: './admincreate-activity.component.html',
  styleUrl: './admincreate-activity.component.scss',
  providers:[DatePipe]
})
export class AdmincreateActivityComponent {
  public activityForm!: FormGroup;
  public focusStates: { [key: string]: boolean } = {
    title: false,
    description: false,
    date: false,
    time: false,
    location: false,
    organizedBy: false,
    contactNumber: false
  };


  constructor(
    private fb: FormBuilder,
    private afAuth: AngularFireAuth,
    private firestore: AngularFirestore,
    private router: Router,
    private snackbarService: SnackBarService,
    private datePipe: DatePipe
  ) {}

  public ngOnInit(): void {
    this.activityForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      date: ['', [Validators.required, this.futureDateValidator.bind(this)]],
      time: ['', [Validators.required, this.futureTimeValidator.bind(this)]],
      location: ['', Validators.required],
      organizedBy: ['', Validators.required],
      contactNumber: ['', [Validators.required, Validators.minLength(10)]],
    });

    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.activityForm.addControl('createdBy', this.fb.control(user.email));
      }
    });
  }

  private futureDateValidator(control: AbstractControl): ValidationErrors | null {
    const selectedDate = new Date(control.value);
    const currentDate = new Date();

    if (selectedDate < currentDate) {
      return { invalidDate: true };
    }
    return null;
  }

  private futureTimeValidator(control: AbstractControl): ValidationErrors | null {
    const selectedDate = new Date(this.activityForm?.get('date')?.value);
    const selectedTime = control.value;
    const currentDate = new Date();

    if (selectedDate.setHours(0, 0, 0, 0) === currentDate.setHours(0, 0, 0, 0)) {
      const [hours, minutes] = selectedTime.split(':').map((part: string) => parseInt(part, 10));
      const selectedDateTime = new Date();
      selectedDateTime.setHours(hours, minutes);

      if (selectedDateTime <= currentDate) {
        return { invalidTime: true };
      }
    }
    return null;
  }
  public onFocus(field: string): void {
    this.focusStates[field] = true;
  }

  public onBlur(field: string): void {
    this.focusStates[field] = false;
  }


  public onSubmit(): void {
    if (this.activityForm.valid) {
      const activityId = this.firestore.createId();
      const formattedDate = this.datePipe.transform(this.activityForm.get('date')?.value, 'MMM d, yyyy');
      const activityData = {
        ...this.activityForm.value,
        date: formattedDate,
        activityId,
        peopleInvolved: 0,
        verified: true
      };

      this.firestore.collection('activities').doc(activityId).set(activityData)
        .then(() => {
          this.snackbarService.show('Activity created successfully!');
          this.router.navigate(['/admin']);
        })
        .catch(error => {
          this.snackbarService.show('Error creating activity: ' + error.message);
        });
    }
  }
}

