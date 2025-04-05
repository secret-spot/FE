import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-splash',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './splash.component.html',
  styleUrl: './splash.component.scss'
})
export class SplashComponent implements OnInit {
  showLoginButton = false;

  constructor(
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit() {
    // 3초 후에 로그인 버튼 표시
    setTimeout(() => {
      this.showLoginButton = true;
    }, 3000);
  }

  signInWithGoogle() {
    this.http.get(`${environment.apiUrl}/oauth2/authorization/google`, {
      observe: 'response',
      withCredentials: true
    }).subscribe({
      next: (response) => {
        // 백엔드에서 리다이렉트 URL을 받아서 처리
        if (response.headers.get('Location')) {
          window.location.href = response.headers.get('Location')!;
        } else {
          // 응답 본문에 리다이렉트 URL이 있는 경우
          const responseBody = response.body as any;
          if (responseBody && responseBody.redirectUrl) {
            window.location.href = responseBody.redirectUrl;
          }
        }
      },
      error: (error) => {
        console.error('OAuth2 요청 실패:', error);
      }
    });
  }
} 