import { Component } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    RouterModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'smart-recipe-finder-FE';
  constructor(private router: Router) {}

  navigateTo(path: string) {
    this.router.navigate([`/${path}`]);
  }
}
