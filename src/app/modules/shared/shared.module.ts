import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './pages/navbar/navbar.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { ConfirmationDialogComponent } from './pages/confirmation-dialog/confirmation-dialog.component';
import { ErrorComponent } from './pages/error/error.component';


@NgModule({
  declarations: [
    NavbarComponent,
    HomePageComponent,
    ConfirmationDialogComponent,
    ErrorComponent
  ],
  imports: [
    CommonModule,
    MatToolbarModule,
    RouterModule,
    MatIconModule,
    MatCardModule,
    MatButtonModule
  ],
  exports:[NavbarComponent,ConfirmationDialogComponent]
})
export class SharedModule { }
