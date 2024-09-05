import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SnackBarService } from '../../../auth/services/snack-bar.service';
import { DatePipe } from '@angular/common';
import { ActivityService } from '../../../user/services/activity.service';

@Component({
  selector: 'app-edit-act',
  templateUrl: './edit-act.component.html',
  styleUrl: './edit-act.component.scss',
  providers:[DatePipe]
})
export class EditActComponent {
  public activityForm!: FormGroup;
  private activityId: string = '';
  public isLoading: boolean = true;

  constructor(
    private fb: FormBuilder,
    private afAuth: AngularFireAuth,
    private firestore: AngularFirestore,
    private router: Router,
    private snackbarService: SnackBarService,
    private datePipe: DatePipe,
    private activityService: ActivityService,
    private route: ActivatedRoute
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

    this.route.paramMap.subscribe(params => {
      this.activityId = params.get('actid') || '';
      if (this.activityId) {
        this.loadActivity();
      }
    });

    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.activityForm.addControl('createdBy', this.fb.control(user.email));
      }
    });
  }

  private loadActivity(): void {
    this.activityService.getActivityById(this.activityId).subscribe(activity => {
      if (activity) {
        const parsedDate = new Date(activity.date);
        const formattedDate = this.datePipe.transform(parsedDate, 'yyyy-MM-dd');
        this.activityForm.patchValue({...activity,date:formattedDate});
        this.isLoading = false;
      }
    }, error => {
      this.snackbarService.show('Error loading activity: ' + error);
      this.isLoading = false;
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

  public onSubmit(): void {
    if (this.activityForm.valid) {
      const formattedDate = this.datePipe.transform(this.activityForm.get('date')?.value, 'MMM d, yyyy');
      const activityData = {
        ...this.activityForm.value,
        date: formattedDate
      };

      this.activityService.updateActivity(this.activityId, activityData)
        .then(() => {
          this.snackbarService.show('Activity updated successfully!');
          this.router.navigate(['/admin']);
        })
        .catch(error => {
          this.snackbarService.show('Error updating activity: ' + error.message);
        });
    }
  }
}
