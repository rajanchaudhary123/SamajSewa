import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ActivityService {

  constructor(private firestore: AngularFirestore) {}

  public addActivity(activityData: any): Promise<void> {
    const activityId = this.firestore.createId();
    return this.firestore.collection('activities').doc(activityId).set({ ...activityData, activityId });
  }

  public getActivityById(activityId: string): Observable<any> {
    return this.firestore.collection('activities').doc(activityId).valueChanges();
  }

  public updateActivity(activityId: string, activityData: any): Promise<void> {
    return this.firestore.collection('activities').doc(activityId).update(activityData);
  }

  public deleteActivity(activityId: string): Promise<void> {
    return this.firestore.collection('activities').doc(activityId).delete();
  }

  public getAllActivities(): Observable<any[]> {
    return this.firestore.collection('activities').valueChanges();
  }
}
