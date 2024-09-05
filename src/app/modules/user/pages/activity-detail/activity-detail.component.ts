import { Component, OnInit, OnDestroy } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ActivityService } from '../../services/activity.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { SnackBarService } from '../../../auth/services/snack-bar.service';
import firebase from 'firebase/compat/app'; 

@Component({
  selector: 'app-activity-detail',
  templateUrl: './activity-detail.component.html',
  styleUrls: ['./activity-detail.component.scss']
})
export class ActivityDetailComponent implements OnInit, OnDestroy {
  public activity: any;
  private activitySubscription!: Subscription;
  public isFavorited: boolean = false;
  private userEmail: string = '';

  constructor(
    private route: ActivatedRoute,
    private firestore: AngularFirestore,
    private router: Router,
    private activityService: ActivityService,
    private auth: AngularFireAuth,
    private snackBar: SnackBarService
  ) {}

  public ngOnInit(): void {
    const activityId = this.route.snapshot.paramMap.get('actid');
    if (activityId) {
      this.activitySubscription = this.activityService.getActivityById(activityId).subscribe(
        (data: any) => {
          this.activity = data;
          this.checkIfFavorited(activityId);
        },
        error => {
          console.error('Error fetching activity details:', error);
        }
      );
    }

    this.auth.user.subscribe(user => {
      if (user) {
        this.userEmail = user.email || '';
      }
    });
  }

  private checkIfFavorited(activityId: string): void {
    if (!this.userEmail) return;

    this.firestore.collection('favourites', ref =>
      ref.where('email', '==', this.userEmail)
         .where('activityId', '==', activityId)
    ).get().toPromise().then(querySnapshot => {
      if (querySnapshot) {
        this.isFavorited = !querySnapshot.empty;
      } else {
        this.isFavorited = false;
      }
    }).catch(error => {
      console.error('Error checking if activity is favorited:', error);
      this.isFavorited = false;
    });
  }

  public toggleFavorite(): void {
    if (!this.activity || !this.userEmail) {
      return;
    }

    if (this.isFavorited) {
      this.removeFavorite();
    } else {
      this.addFavorite();
    }
  }

  private addFavorite(): void {
    this.firestore.collection('favourites').add({
      email: this.userEmail,
      activityId: this.activity.activityId
    }).then(() => {
      this.firestore.doc(`activities/${this.activity.activityId}`).update({
        peopleInvolved: firebase.firestore.FieldValue.increment(1)
      });
      this.isFavorited = true;
      this.snackBar.show('Added to interested!');
    }).catch(error => {
      this.snackBar.show('Error adding to favorites: ' + error.message);
    });
  }

  private removeFavorite(): void {
    this.firestore.collection('favourites', ref =>
      ref.where('email', '==', this.userEmail)
         .where('activityId', '==', this.activity.activityId)
    ).get().toPromise().then(querySnapshot => {
      if (querySnapshot && !querySnapshot.empty) {
        querySnapshot.forEach(doc => {
          doc.ref.delete();
        });
        this.firestore.doc(`activities/${this.activity.activityId}`).update({
          peopleInvolved: firebase.firestore.FieldValue.increment(-1)
        });
        this.isFavorited = false;
        this.snackBar.show('Removed from interested!');
      } else {
        this.snackBar.show('No favorite entry found to remove.');
      }
    }).catch(error => {
      this.snackBar.show('Error removing from favorites: ' + error.message);
    });
  }

  public ngOnDestroy(): void {
    if (this.activitySubscription) {
      this.activitySubscription.unsubscribe();
    }
  }

  public goBack(): void {
    this.router.navigate(['user/']);
  }
}
