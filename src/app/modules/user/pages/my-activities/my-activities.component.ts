import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { SnackBarService } from '../../../auth/services/snack-bar.service';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { ConfirmationDialogComponent } from '../../../shared/pages/confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-my-activities',
  templateUrl: './my-activities.component.html',
  styleUrls: ['./my-activities.component.scss'],
  providers:[DatePipe]
})
export class MyActivitiesComponent {
  public myActivity: any[] = [];
  private userEmail: string | null = null;
  public actDate:string | null = null;
  public isLoading: boolean = true;


  constructor(
    private afAuth: AngularFireAuth,
    private firestore: AngularFirestore,
    private snackbarService: SnackBarService,
    private router: Router,
    private datePipe: DatePipe,
    private dialog: MatDialog
  ) {}

  public ngOnInit(): void {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.userEmail = user.email;
        this.loadActivities();
      } else {
        this.snackbarService.show('No user is logged in');
      }
    });
  }
  public editActivity(activityId: string): void {
    this.router.navigate(['/edit', activityId]);
  }

  public deleteActivity(activityId: string): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '300px',
      data: {
        title: 'Confirm Deletion',
        message: 'Are you sure you want to delete this activity?'
      }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.firestore.collection('activities').doc(activityId).delete()
          .then(() => {
            this.snackbarService.show('Activity deleted successfully.');
            this.loadActivities();
          })
          .catch(error => {
            this.snackbarService.show('Error deleting activity: ' + error.message);
          });
      }
    });
  }

  public loadActivities(): void {
    if (this.userEmail) {
      this.firestore.collection('activities', ref => ref.where('createdBy', '==', this.userEmail))
        .valueChanges()
        .subscribe(
          activities => {
            this.myActivity = activities;
            this.isLoading = false;
          },
          error => {
            this.snackbarService.show('Error loading activities: ' + error.message, 'Close', { duration: 5000 });
          }
        );
    } else {
      this.snackbarService.show('User email is not available.', 'Close', { duration: 5000 });
    }
  }
}
