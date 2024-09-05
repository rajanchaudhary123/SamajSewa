import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthModule } from '../auth/auth.module';
import { UserDashboardComponent } from './pages/user-dashboard/user-dashboard.component';
import { SharedModule } from '../shared/shared.module';
import { HomeComponent } from './pages/home/home.component';
import { MyActivitiesComponent } from './pages/my-activities/my-activities.component';
import { CreateActivityComponent } from './pages/create-activity/create-activity.component';
import { NotificationsComponent } from './pages/notifications/notifications.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { RouterModule } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { UpdateProfileComponent } from './pages/updateProfile/update-profile/update-profile.component';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { FavouritesComponent } from './pages/favourites/favourites.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle'; 
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { ActivityDetailComponent } from './pages/activity-detail/activity-detail.component';
import { EditActivityComponent } from './pages/edit-activity/edit-activity.component';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@NgModule({
  declarations: [
    UserDashboardComponent,
    HomeComponent,
    MyActivitiesComponent,
    CreateActivityComponent,
    NotificationsComponent,
    ProfileComponent,
    UpdateProfileComponent,
    FavouritesComponent,
    ActivityDetailComponent,
    EditActivityComponent,
  ],
  imports: [
    CommonModule,
    AuthModule,
    SharedModule,
    RouterModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatSelectModule,
    MatOptionModule,
    MatCardModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonToggleModule,
    NgxMaterialTimepickerModule,
    NgxSkeletonLoaderModule,
    MatIconModule,
    MatTabsModule,
    AngularFireStorageModule,
    MatListModule,
    MatProgressSpinnerModule
  ],
  exports:[CreateActivityComponent]
})
export class UserModule { }
