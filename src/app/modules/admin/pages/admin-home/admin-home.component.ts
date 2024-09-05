import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Subscription } from 'rxjs';
import { ActivityService } from '../../../user/services/activity.service';

@Component({
  selector: 'app-admin-home',
  templateUrl: './admin-home.component.html',
  styleUrl: './admin-home.component.scss'
})
export class AdminHomeComponent {
  public activities: any[] = [];
  private activitiesSubscription!: Subscription;
  public isLoading: boolean = true;

  constructor(private firestore: AngularFirestore, private activityservice: ActivityService) {}

  public ngOnInit(): void {
    this.activitiesSubscription = this.activityservice.getAllActivities().subscribe(
      (data: any[]) => {
        this.activities = data;
        this.activities = data.filter(activity => activity.verified === true);
        this.isLoading = false;
      },
      error => {
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

