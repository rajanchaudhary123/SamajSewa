import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { SnackBarService } from '../../services/snack-bar.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  public registerForm: FormGroup;
  public hidePassword: boolean = true;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackbarService: SnackBarService,
    private fireStore: AngularFirestore
  ) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  public get email(): FormGroup['controls']['email'] {
    return this.registerForm.get('email') as FormGroup['controls']['email'];
  }

  public get password(): FormGroup['controls']['password'] {
    return this.registerForm.get(
      'password'
    ) as FormGroup['controls']['password'];
  }
  public togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }

  public registerWithEmail(): void {
    if (this.registerForm.valid) {
      const { email, password } = this.registerForm.value;
      this.authService
        .registerwithEmail(email, password)
        .then((result) => {
          this.fireStore.collection('users').doc(result.user?.uid).set({
            email: result.user?.email,
            uid: result.user?.uid,
            createdAt: new Date(),
            role: 'user',
          });
          this.snackbarService.show(
            'Registration Successful check your mail to verify.'
          );
          this.router.navigate(['/login']);
        })
        .catch((error) => {
          if (error.code === 'auth/email-already-in-use') {
            this.snackbarService.show(
              'Email already in use. Please use a different email or log in.'
            );
          } else {
            this.snackbarService.show(
              'Registration failed. Please try again later.'
            );
          }
        });
    }
  }

  public registerWithGoogle(): void {
    this.authService
      .registerWithGoogle()
      .then((result) => {
        this.fireStore.collection('users').doc(result.user?.uid).set({
          email: result.user?.email,
          uid: result.user?.uid,
          createdAt: new Date(),
          role: 'user',
        });
        this.snackbarService.show('Google registration successful!');
        this.router.navigate(['/user']);
      })
      .catch((error) => {
        this.snackbarService.show(
          'Google registration failed. Please try again later.'
        );
      });
  }
}
