import { Component } from '@angular/core';
import { AuthService } from '../../../auth/services/auth.service';
import { Router } from '@angular/router';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  isNavbarCollapsed = true;
  constructor(private authService:AuthService,private router: Router,  public dialog: MatDialog){}
  toggleNavbar() {
    this.isNavbarCollapsed = !this.isNavbarCollapsed;
  }

  public logout(): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '300px',
      disableClose: true,
      data: {
        title: 'Logout Confirmation',
        message: 'Are you sure you want to log out?'
      }
    });
  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      this.authService.logout();
      console.log("logged out");
      this.router.navigate(['']);
    }
  });
  }
}
