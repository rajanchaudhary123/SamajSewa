import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';
import { SharedModule } from '../shared/shared.module';
import { UserModule } from '../user/user.module';
import { AdmincreateActivityComponent } from './pages/admincreate-activity/admincreate-activity.component';
import { VerifyActivityComponent } from './pages/verify-activity/verify-activity.component';
import { NavigationComponent } from './pages/navigation/navigation.component';
import { AdminHomeComponent } from './pages/admin-home/admin-home.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { EditActComponent } from './pages/edit-act/edit-act.component';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { DisplayActComponent } from './pages/display-act/display-act.component';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AdminDashboardComponent,
    AdmincreateActivityComponent,
    VerifyActivityComponent,
    NavigationComponent,
    AdminHomeComponent,
    EditActComponent,
    DisplayActComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    UserModule,
    MatCardModule,
    MatButtonModule,
    MatToolbarModule,
    RouterModule,
    MatIconModule,
    NgxSkeletonLoaderModule,
    MatInputModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    NgxMaterialTimepickerModule,
    ReactiveFormsModule
  ]
})
export class AdminModule { }
