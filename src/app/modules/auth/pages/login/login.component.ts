import { Component } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import firebase from 'firebase/compat/app';
import { SnackBarService } from '../../services/snack-bar.service';
import { UserRoleService } from '../../services/user-role.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  public loginForm: FormGroup;
  public hidePassword: boolean = true;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackbarService: SnackBarService,
    private userRoleService: UserRoleService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  public get email(): AbstractControl | null {
    return this.loginForm.get('email');
  }

  public get password(): AbstractControl | null {
    return this.loginForm.get('password');
  }

  public togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }

  public loginWithEmail(): void {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.authService
        .loginWithEmail(email, password)
        .then((result: firebase.auth.UserCredential) => {
          if (result.user?.emailVerified) {
            this.snackbarService.show('Login Successful');
            this.userRoleService.checkUserRole(result.user.uid).subscribe();
          } else {
            this.snackbarService.show(
              'Please verify your email before logging in.'
            );
            this.authService.logout();
          }
        })
        .catch((error) => {
          let errorMessage = 'Login failed. Please check your credentials.';
          if (error.code === 'auth/user-not-found') {
            errorMessage = 'User not found. Please register first.';
          } else if (error.code === 'auth/wrong-password') {
            errorMessage = 'Incorrect password. Please try again.';
          }
          this.snackbarService.show(errorMessage);
        });
    }
  }

  public loginWithGoogle(): void {
    this.authService
      .loginWithGoogle()
      .then((result: firebase.auth.UserCredential) => {
        if (result.user?.emailVerified) {
          this.snackbarService.show('Google Login Successful');
          this.userRoleService.checkUserRole(result.user.uid).subscribe();
        } else {
          this.snackbarService.show(
            'Please verify your email before logging in.'
          );
          this.authService.logout();
        }
      })
      .catch(() => {
        this.snackbarService.show(
          'Google Login failed. Please try again later.'
        );
      });
  }
}
