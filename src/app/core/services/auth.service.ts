import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  async handleOAuthCallback(code: string): Promise<void> {
    try {
      const response = await this.http.post(`${this.apiUrl}/login/oauth2/code/null/oauth2/redirect`, { code }).toPromise();
      console.log('OAuth callback process completed:', response);
    } catch (error) {
      console.error('OAuth callback error:', error);
      throw error;
    }
  }

  handleTokenFromUrl(): void {
    const urlParams = new URLSearchParams(window.location.search);
    const accessToken = urlParams.get('accessToken');
    const refreshToken = urlParams.get('refreshToken');
    const username = urlParams.get('username');
    
    if (accessToken && refreshToken) {
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      if (username) {
        localStorage.setItem('username', username);
      }
      
      if (username) {
        this.router.navigate(['/login']);
      } else {
        this.router.navigate(['/home']);
      }
    } else {
      this.router.navigate(['/login']);
    }
  }
} 