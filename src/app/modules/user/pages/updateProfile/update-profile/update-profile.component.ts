import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SnackBarService } from '../../../../auth/services/snack-bar.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize, Observable } from 'rxjs';

@Component({
  selector: 'app-update-profile',
  templateUrl: './update-profile.component.html',
  styleUrls: ['./update-profile.component.scss']
})
export class UpdateProfileComponent implements OnInit {
  public profileForm: FormGroup;
  private userId: string = '';
  public selectedFile: File | null = null;
  public uploadPercent!: Observable<number | undefined>;
  public downloadURL!: Observable<string | undefined>;

  constructor(
    private fb: FormBuilder,
    private auth: AngularFireAuth,
    private snackBar: SnackBarService,
    private router: Router,
    private userService: UserService,
    private storage: AngularFireStorage
  ) {
    this.profileForm = this.fb.group({
      fullName: ['', Validators.required],
      email: [{ value: '', disabled: true }, [Validators.required, Validators.email]],
      location: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]*$'), Validators.minLength(10)]],
      age: ['', [Validators.required, Validators.min(1)]],
      sex: ['', Validators.required],
    });
  }

  public ngOnInit(): void {
    this.auth.user.subscribe((user) => {
      if (user) {
        this.userId = user.uid;
        this.profileForm.patchValue({ email: user.email });
        this.userService.getUserById(this.userId).subscribe((profile) => {
          if (profile) {
            this.profileForm.patchValue({ email: user.email, ...profile });
          }
        });
      }
    });
  }

  public onSubmit(): void {
    if (this.profileForm.valid) {
      const { email, ...formData } = this.profileForm.value;
      if (this.selectedFile) {
        const filePath = `uploads/${this.selectedFile.name}`;
        const fileRef = this.storage.ref(filePath);
        const task = this.storage.upload(filePath, this.selectedFile);

        this.uploadPercent = task.percentageChanges();

        task.snapshotChanges().pipe(
          finalize(() => {
            fileRef.getDownloadURL().subscribe((url: string) => {
              formData.profileImageUrl = url;
              this.userService.updateUser(this.userId, formData)
                .then(() => {
                  this.snackBar.show('Profile updated successfully!');
                  this.router.navigate(['user/profile']);
                })
                .catch((error: Error) => {
                  this.snackBar.show('Failed to update profile: ' + error.message);
                });
            });
          })
        ).subscribe();
      } else {
        this.userService.updateUser(this.userId, formData)
          .then(() => {
            this.snackBar.show('Profile updated successfully!');
            this.router.navigate(['user/profile']);
          })
          .catch((error: Error) => {
            this.snackBar.show('Failed to update profile: ' + error.message);
          });
      }
    }
  }

  public onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }
}
