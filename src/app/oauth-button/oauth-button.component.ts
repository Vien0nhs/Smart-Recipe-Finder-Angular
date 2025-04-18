import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';

@Component({
  selector: 'app-oauth-button',
  imports: [CommonModule],
  templateUrl: './oauth-button.component.html',
  styleUrl: './oauth-button.component.css'
})
export class OAuthButtonComponent implements OnInit {
  user: any;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.fetchUserData();
    }
  }

  fetchUserData(): void {
    this.http.get('http://localhost:8080/users/me', { withCredentials: true })
      .subscribe({
        next: (data) => this.user = data,
        error: () => this.user = null
      });
  }

  signInWithGoogle(): void {
    window.location.href = 'http://192.168.184.130:8081/oauth2/authorization/google';
  }

  logout(): void {
    window.location.href = 'http://localhost:8080/logout';
  }
}
