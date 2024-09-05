import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './modules/auth/pages/login/login.component';
import { RegisterComponent } from './modules/auth/pages/register/register.component';
import { AuthGuard } from './modules/auth/guard/auth.guard';
import { AdminDashboardComponent } from './modules/admin/pages/admin-dashboard/admin-dashboard.component';
import { UserDashboardComponent } from './modules/user/pages/user-dashboard/user-dashboard.component';
import { HomeComponent } from './modules/user/pages/home/home.component';
import { NotificationsComponent } from './modules/user/pages/notifications/notifications.component';
import { ProfileComponent } from './modules/user/pages/profile/profile.component';
import { CreateActivityComponent } from './modules/user/pages/create-activity/create-activity.component';
import { HomePageComponent } from './modules/shared/pages/home-page/home-page.component';
import { UpdateProfileComponent } from './modules/user/pages/updateProfile/update-profile/update-profile.component';
import { ActivityDetailComponent } from './modules/user/pages/activity-detail/activity-detail.component';
import { EditActivityComponent } from './modules/user/pages/edit-activity/edit-activity.component';
import { AdmincreateActivityComponent } from './modules/admin/pages/admincreate-activity/admincreate-activity.component';
import { VerifyActivityComponent } from './modules/admin/pages/verify-activity/verify-activity.component';
import { AdminHomeComponent } from './modules/admin/pages/admin-home/admin-home.component';
import { EditActComponent } from './modules/admin/pages/edit-act/edit-act.component';
import { DisplayActComponent } from './modules/admin/pages/display-act/display-act.component';
import { ErrorComponent } from './modules/shared/pages/error/error.component';
import { adminGuard } from './modules/auth/admin.guard';

const routes: Routes = [
  {path:"",redirectTo:'homepage',pathMatch:'full'},
  {path:'homepage',component:HomePageComponent},
  {path:'login', component:LoginComponent},
  {path:'register',component:RegisterComponent},
  {path:'detail/:actid',component:ActivityDetailComponent},
  {path:'edit/:actid',component:EditActivityComponent},
  {path:'user',component:UserDashboardComponent, canActivate:[AuthGuard],children:[
    {path:'',component:HomeComponent},
    {path:'notifications',component:NotificationsComponent},
    {path:'profile',component:ProfileComponent},
    {path:'update-profile',component:UpdateProfileComponent},
    {path:'create-activity', component:CreateActivityComponent},
  ]},
  {path:'admin',component:AdminDashboardComponent, canActivate:[adminGuard],children:[
    {path:'create-activity', component:AdmincreateActivityComponent},
    {path:'',component:AdminHomeComponent},
    {path:'verify-activity',component:VerifyActivityComponent},
    {path:'edit/:actid',component:EditActComponent},
    {path:'display/:actid',component:DisplayActComponent}
  ]},
  { path: '**', component: ErrorComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
