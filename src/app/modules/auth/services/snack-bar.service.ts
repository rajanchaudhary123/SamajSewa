import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class SnackBarService {

  constructor(private snackBar: MatSnackBar) {}
  public show(message: string, action: string = 'Close', config: MatSnackBarConfig = {}): void {
    const defaultConfig: MatSnackBarConfig = {
      duration: 3000,
      verticalPosition: 'bottom',
      horizontalPosition: 'center',
      ...config,
    };
    this.snackBar.open(message, action, defaultConfig);
  }
}
