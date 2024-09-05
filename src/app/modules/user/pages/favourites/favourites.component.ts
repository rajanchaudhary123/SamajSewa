import { Component, OnInit, OnDestroy } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Subscription, combineLatest } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { ActivityService } from '../../services/activity.service';
import { Activity } from '../../../shared/interfaces/activity';

@Component({
  selector: 'app-favourites',
  templateUrl: './favourites.component.html',
  styleUrls: ['./favourites.component.scss']
})
export class FavouritesComponent implements OnInit, OnDestroy {
  public favorites: Activity[] = [];
  public isLoading = true;
  private userEmail: string = '';
  private subscriptions: Subscription[] = [];
  public favorite!:any;

  constructor(
    private firestore: AngularFirestore,
    private auth: AngularFireAuth,
    private activityService: ActivityService
  ) {}

  public ngOnInit(): void {
    const authSubscription = this.auth.user.pipe(
      switchMap(user => {
        if (user && user.email) {
          this.userEmail = user.email;
          return this.firestore.collection('favourites', ref =>
            ref.where('email', '==', this.userEmail)
          ).snapshotChanges();
        } else {
          this.isLoading = false;
          return [];
        }
      }),
      map(favorites => {
        return favorites.map(favorite => favorite.payload.doc.data() as { activityId: string });
      }),
      switchMap(favoriteActivities => {
        const activityObservables = favoriteActivities.map(favorite =>
          this.activityService.getActivityById(favorite.activityId)
        );
        return activityObservables.length ? combineLatest(activityObservables) : [];
      })
    ).subscribe(
      (activityData) => {
        this.favorite = activityData;
        this.isLoading = false;
      },
      error => {
        console.error('Error fetching favorite activities:', error);
        this.isLoading = false;
      }
    );

    this.subscriptions.push(authSubscription);
  }

  public ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
