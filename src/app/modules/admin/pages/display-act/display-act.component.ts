import { Component, OnDestroy, OnInit } from '@angular/core';
import { SnackBarService } from '../../../auth/services/snack-bar.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ActivityService } from '../../../user/services/activity.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../../shared/pages/confirmation-dialog/confirmation-dialog.component';
@Component({
  selector: 'app-display-act',
  templateUrl: './display-act.component.html',
  styleUrls: ['./display-act.component.scss']
})
export class DisplayActComponent implements OnInit, OnDestroy {
  public activity: any;
  private activitySubscription!: Subscription;
  public userEmail: string = '';

  constructor(
    private route: ActivatedRoute,
    private firestore: AngularFirestore,
    private router: Router,
    private activityService: ActivityService,
    private auth: AngularFireAuth,
    private snackBar: SnackBarService,
    private dialog: MatDialog
  ) {}

  public ngOnInit(): void {
    const activityId = this.route.snapshot.paramMap.get('actid');
    if (activityId) {
      this.activitySubscription = this.activityService.getActivityById(activityId).subscribe(
        (data: any) => {
          this.activity = data;
        },
        (error) => {
          this.snackBar.show('Failed to load activity details.');
        }
      );
    }

    this.auth.user.subscribe((user) => {
      if (user) {
        this.userEmail = user.email || '';
      }
    });
  }

  public editActivity(): void {
    const activityId = this.route.snapshot.paramMap.get('actid');
    if (activityId) {
      this.router.navigate(['/admin/edit', activityId]);
    }
  }

  public deleteActivity(): void {
    const activityId = this.route.snapshot.paramMap.get('actid');
    if (activityId) {
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        width: '300px',
        disableClose: true,
        data: {
          title: 'Confirm Deletion',
          message: 'Are you sure you want to delete this activity? This action cannot be undone.'
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.firestore.collection('activities').doc(activityId).delete()
            .then(() => {
              this.snackBar.show('Activity deleted successfully.');
              this.router.navigate(['/admin']);
            })
            .catch(error => {
              this.snackBar.show('Error deleting activity: ' + error.message);
            });
        }
      });
    }
  }

  public goBack(): void {
    this.router.navigate(['/admin']);
  }

  public ngOnDestroy(): void {
    if (this.activitySubscription) {
      this.activitySubscription.unsubscribe();
    }
  }
}
