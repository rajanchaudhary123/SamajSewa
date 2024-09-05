import { CanActivateFn, Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, switchMap, take, tap } from 'rxjs/operators';

export const adminGuard: CanActivateFn = (route, state) => {
  const afAuth = inject(AngularFireAuth);
  const firestore = inject(AngularFirestore);
  const router = inject(Router);

  return afAuth.authState.pipe(
    switchMap(user => {
      if (!user || !user.emailVerified) {
        router.navigate(['/login']);
        return of(false);
      }

      return firestore.collection('users').doc(user.uid).valueChanges().pipe(
        take(1),
        map((userData: any) => userData?.role === 'admin'),
        tap(isAdmin => {
          if (!isAdmin) {
            router.navigate(['/login']);
          }
        })
      );
    })
  );
};
