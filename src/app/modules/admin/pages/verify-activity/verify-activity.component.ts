import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { SnackBarService } from '../../../auth/services/snack-bar.service';

@Component({
  selector: 'app-verify-activity',
  templateUrl: './verify-activity.component.html',
  styleUrls: ['./verify-activity.component.scss']
})
export class VerifyActivityComponent implements OnInit {
  activities: any[] = [];

  constructor(
    private firestore: AngularFirestore,
    private snackBar: SnackBarService
  ) {}

  ngOnInit(): void {
    this.firestore.collection('activities', ref => ref.where('verified', '==', false))
      .valueChanges({ idField: 'id' })
      .subscribe(
        (data: any[]) => {
          this.activities = data;
        },
        (error) => {
          this.snackBar.show('Failed to load activities.');
        }
      );
  }

  public verifyActivity(activityId: string): void {
    this.firestore.collection('activities').doc(activityId).update({ verified: true })
      .then(() => {
        this.snackBar.show('Activity verified successfully.');
        this.activities = this.activities.filter(activity => activity.id !== activityId);
      })
      .catch((error) => {
        this.snackBar.show('Failed to verify activity.');
      });
  }
}
