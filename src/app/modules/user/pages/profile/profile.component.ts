import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { SnackBarService } from '../../../auth/services/snack-bar.service';
import { ActivityService } from '../../services/activity.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  public profileData!: any;
  private userId: string = '';
  public userEmail: string = ''; 

  constructor(
    private fb: FormBuilder,
    private auth: AngularFireAuth,
    private snackBar: SnackBarService,
    private router: Router,
    private activityService: ActivityService,
    private userService: UserService
  ) {}
    
  public ngOnInit(): void {
    this.auth.user.subscribe((user) => {
      if (user) {
        this.userId = user.uid;
        this.userEmail = user.email || '';
        this.userService.getUserById(this.userId).subscribe((profile) => {
          if (profile) {
            this.profileData = profile;
          }
        });
      }
    });
  }

  public gotoUpdateProfile(): void {
    this.router.navigate(['user/update-profile']);
  }
}
