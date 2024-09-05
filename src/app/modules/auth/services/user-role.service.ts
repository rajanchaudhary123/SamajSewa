import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SnackBarService } from './snack-bar.service';

interface UserData {
  email: string;
  uid: string;
  createdAt: Date;
  role: 'admin' | 'user';
}

@Injectable({
  providedIn: 'root'
})
export class UserRoleService {
  constructor(
    private fireStore: AngularFirestore,
    private router: Router,
    private snackbarService: SnackBarService
  ) {}

  public checkUserRole(uid: string): Observable<void> {
    return this.fireStore.collection('users').doc<UserData>(uid).get().pipe(
      map((doc) => {
        if (doc.exists) {
          const userData = doc.data();
          if (userData?.role === 'admin') {
            this.router.navigate(['/admin']);
          } else {
            this.router.navigate(['/user']);
          }
        } else {
          this.snackbarService.show('User data not found in the database.');
        }
      })
    );
  }
}
