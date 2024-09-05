import { Component, OnInit, OnDestroy } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Subscription, combineLatest, from, of } from 'rxjs';
import { switchMap, map, catchError } from 'rxjs/operators';
import { Activity } from '../../../shared/interfaces/activity';
import { Notification } from '../../../shared/interfaces/notification';
import { Favorite } from '../../../shared/interfaces/favorite';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
})
export class NotificationsComponent implements OnInit, OnDestroy {
  notifications: Notification[] = [];
  isLoading = true;
  private subscriptions: Subscription[] = [];
  private userEmail: string = '';

  constructor(
    private firestore: AngularFirestore,
    private afAuth: AngularFireAuth
  ) {}

  ngOnInit(): void {
    this.isLoading = true;

    const authSubscription = this.afAuth.user
      .pipe(
        switchMap((user) => {
          if (user && user.email) {
            this.userEmail = user.email;
            return this.firestore
              .collection<Favorite>('favourites', (ref) =>
                ref.where('email', '==', this.userEmail)
              )
              .snapshotChanges();
          } else {
            this.isLoading = false;
            return of([]);
          }
        }),
        map((favorites) =>
          favorites.map((favorite) => favorite.payload.doc.data() as Favorite)
        ),
        switchMap((favoriteActivities) => {
          if (!favoriteActivities.length) {
            this.isLoading = false;
            return of([]);
          }
          
          const activityObservables = favoriteActivities.map((favorite) =>
            this.firestore
              .collection<Activity>('activities')
              .doc(favorite.activityId)
              .get()
          );

          return combineLatest(activityObservables);
        }),
        switchMap((activityDocs) => {
          const currentDate = new Date().getTime();
          const oneDayInMillis = 24 * 60 * 60 * 1000;

          const filteredActivities = activityDocs.filter((doc) => {
            const data = doc.data() as Activity;
            const activityDateTimeString = `${data.date} ${data.time}`;
            const activityDate = this.parseDate(activityDateTimeString);

            return (
              activityDate - currentDate <= oneDayInMillis &&
              activityDate - currentDate > 0
            );
          });

          const notificationObservables = filteredActivities.map(
            (activityDoc) => {
              const data = activityDoc.data() as Activity;
              return this.firestore
                .collection<Notification>('notifications', (ref) =>
                  ref
                    .where('email', '==', this.userEmail)
                    .where('activityId', '==', data.activityId)
                )
                .get()
                .pipe(
                  switchMap((snapshot) => {
                    if (snapshot.empty) {
                      return from(
                        this.firestore.collection('notifications').add({
                          activityId: data.activityId,
                          title: data.title,
                          email: this.userEmail,
                          read: false,
                          timestamp: new Date().toISOString(),
                        })
                      );
                    } else {
                      return of(null);
                    }
                  })
                );
            }
          );

          return combineLatest(notificationObservables);
        }),
        switchMap(() =>
          this.firestore
            .collection<Notification>('notifications', (ref) =>
              ref.where('email', '==', this.userEmail)
            )
            .get()
        ),
        map((snapshot) => {
          this.notifications = [];
          snapshot.forEach((doc) => {
            const notification = doc.data() as Notification;

            if (notification && !notification.read) {
              const formattedDate = this.formatDate(notification.timestamp);
              const newNotification = {
                id: doc.id,
                activityId: notification.activityId,
                title: notification.title,
                read: notification.read,
                timestamp: formattedDate,
              };

              this.notifications.push(newNotification);
            }
          });
          this.isLoading = false;
        }),
        catchError((error) => {
          this.isLoading = false;
          return of([]);
        })
      )
      .subscribe();

    this.subscriptions.push(authSubscription);
  }

  private parseDate(dateString: string): number {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return 0;
    }
    return date.getTime();
  }

  private formatDate(timestamp: string): string {
    const date = new Date(timestamp);
    const options: Intl.DateTimeFormatOptions = {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    };
    return date.toLocaleString('en-GB', options);
  }

  public markAsRead(id: string): void {
    this.firestore
      .collection('notifications')
      .doc(id)
      .update({ read: true })
      .then(() => {
        this.notifications = this.notifications.map((notification) =>
          notification.id === id
            ? { ...notification, read: true }
            : notification
        );
      })
      .catch((error) => {
      });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
