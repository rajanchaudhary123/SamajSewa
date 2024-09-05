import { Component } from '@angular/core';
import { AuthService } from '../../../auth/services/auth.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../../shared/pages/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss'
})
export class NavigationComponent {
  public isNavbarCollapsed = true;
  constructor(private authService:AuthService,private router: Router,  public dialog: MatDialog){}
  public toggleNavbar(): void {
    this.isNavbarCollapsed = !this.isNavbarCollapsed;
  }

  public logout():void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent,{
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

