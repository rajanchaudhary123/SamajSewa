import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private firestore: AngularFirestore,private afAuth: AngularFireAuth) {}

  public getUserById(userId: string): Observable<any> {
    return this.firestore.collection('users').doc(userId).valueChanges();
  }

  public updateUser(userId: string, userData: any): Promise<void> {
    return this.firestore.collection('users').doc(userId).update(userData);
  }

  public addUser(userData: any): Promise<any> {
    return this.firestore.collection('users').add(userData);
  }

  public deleteUser(userId: string): Promise<void> {
    return this.firestore.collection('users').doc(userId).delete();
  }

  getAllUsers(): Observable<any[]> {
    return this.firestore.collection('users').valueChanges();
  }

  getCurrentUserEmail(): Observable<string> {
    return this.afAuth.user.pipe(
      map(user => user?.email || '')
    );
  }
}
