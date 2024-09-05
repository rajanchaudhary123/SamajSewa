import { Component, OnDestroy, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, Subscription } from 'rxjs';
import { ActivityService } from '../../services/activity.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  activities: any[] = [];
  private activitiesSubscription!: Subscription;
  isLoading: boolean = true;

  constructor(private firestore: AngularFirestore, private activityservice: ActivityService) {}

  public ngOnInit(): void {
    this.activitiesSubscription = this.activityservice.getAllActivities().subscribe(
      (data: any[]) => {
        this.activities = data;
        this.activities = data.filter(activity => activity.verified === true);
        this.isLoading = false;
      },
      error => {
        console.error('Error fetching activities:', error);
        this.isLoading = false;
      }
    );
  }

  public ngOnDestroy(): void {
    if (this.activitiesSubscription) {
      this.activitiesSubscription.unsubscribe();
    }
  }
}
