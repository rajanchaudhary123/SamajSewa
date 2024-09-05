import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrl: './error.component.scss'
})
export class ErrorComponent {

  constructor( private router:Router)   {}
  public navigateHome(): void{
    this.router.navigate(['/homepage']);
  }
}
