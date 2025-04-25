import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private frontendUrl: string;

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.frontendUrl = isPlatformBrowser(this.platformId) 
      ? window.location.origin 
      : environment.frontendUrl || 'http://localhost:4200';
  }

  async handleOAuthCallback(code: string): Promise<void> {
    try {
      const response = await this.http.post(`${this.apiUrl}/login/oauth2/code/null/oauth2/redirect`, { code }).toPromise();
      // 토큰 저장 로직 추가 예정
      console.log('OAuth 콜백 처리 성공:', response);
    } catch (error) {
      console.error('OAuth 콜백 처리 실패:', error);
      throw error;
    }
  }

  // URL 파라미터에서 토큰을 추출하고 저장하는 메서드
  handleTokenFromUrl(): void {
    // 서버 환경에서는 실행하지 않음
    if (!isPlatformBrowser(this.platformId)) {
      console.log('서버 환경에서는 handleTokenFromUrl 메서드를 실행하지 않습니다.');
      return;
    }
    
    // 현재 URL에서 쿼리 파라미터 추출
    const currentUrl = window.location.href;
    console.log('현재 URL:', currentUrl);
    
    // URL 파라미터 추출
    const urlParams = new URLSearchParams(window.location.search);
    console.log('URL 파라미터:', window.location.search);
    
    const accessToken = urlParams.get('accessToken');
    const refreshToken = urlParams.get('refreshToken');
    const username = urlParams.get('username');
    
    console.log('accessToken:', accessToken);
    console.log('refreshToken:', refreshToken);
    console.log('username:', username);
    
    if (accessToken && refreshToken) {
      // 토큰 저장
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      if (username) {
        localStorage.setItem('username', username);
      }
      console.log('토큰 저장 완료');
      
      // username 파라미터가 있으면 /login으로, 없으면 /home으로 리다이렉트
      if (username) {
        console.log('/login 페이지로 리다이렉트 (username 있음)');
        this.router.navigate(['/login']);
      } else {
        console.log('/home 페이지로 리다이렉트 (username 없음)');
        this.router.navigate(['/home']);
      }
    } else {
      console.error('토큰이 URL에 없습니다.');
      this.router.navigate(['/login']);
    }
  }
  
  // 백엔드 도메인인지 확인하는 메서드
  private isBackendUrl(url: string): boolean {
    if (!url) return false;
    
    // 백엔드 도메인 패턴 확인 (예: s2-5nwgikdioa-du.a.run.app)
    const backendDomainPattern = /s2-5nwgikdioa-du\.a\.run\.app/;
    return backendDomainPattern.test(url);
  }
} 