import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable, of } from 'rxjs';
import { map, switchMap, take, tap } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private afAuth: AngularFireAuth,
    private router: Router,
    private firestore: AngularFirestore
  ) {}

  public canActivate(): Observable<boolean> {
    return this.afAuth.authState.pipe(
      take(1),
      switchMap(user => {
        if (!user || !user.emailVerified) {
          this.router.navigate(['/login']);
          return of (false);
        }

        return this.firestore.collection('users').doc(user.uid).valueChanges().pipe(
          take(1),
          map((userData: any) => userData?.role === 'user'),
          tap(isUser => {
            if (!isUser) {
              this.router.navigate(['/login']);
            }
          })
        );
      })
    );
  }
}
