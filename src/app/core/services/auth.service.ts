import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private frontendUrl = window.location.origin; // 프론트엔드 도메인

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

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
    // 현재 URL에서 쿼리 파라미터 추출
    const currentUrl = window.location.href;
    console.log('현재 URL:', currentUrl);
    
    // 백엔드 도메인인지 확인
    if (this.isBackendUrl(currentUrl)) {
      console.log('백엔드 도메인으로 리다이렉트됨');
      // 백엔드 도메인인 경우 프론트엔드 도메인으로 리다이렉트
      const urlParams = new URLSearchParams(window.location.search);
      const accessToken = urlParams.get('accessToken');
      const refreshToken = urlParams.get('refreshToken');
      const username = urlParams.get('username');
      
      if (accessToken && refreshToken) {
        // 프론트엔드 도메인으로 리다이렉트
        let redirectUrl = `${this.frontendUrl}/oauth2/redirect?accessToken=${accessToken}&refreshToken=${refreshToken}`;
        if (username) {
          redirectUrl += `&username=${username}`;
        }
        console.log('프론트엔드로 리다이렉트:', redirectUrl);
        window.location.href = redirectUrl;
        return;
      }
    }
    
    // 프론트엔드 도메인인 경우 토큰 처리
    const urlParams = new URLSearchParams(window.location.search);
    const accessToken = urlParams.get('accessToken');
    const refreshToken = urlParams.get('refreshToken');
    const username = urlParams.get('username');
    
    if (accessToken && refreshToken) {
      // 토큰 저장
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      if (username) {
        localStorage.setItem('username', username);
      }
      
      // 메인 페이지로 리다이렉트
      this.router.navigate(['/']);
    } else {
      console.error('토큰이 URL에 없습니다.');
      this.router.navigate(['/auth/login']);
    }
  }
  
  // 백엔드 도메인인지 확인하는 메서드
  private isBackendUrl(url: string): boolean {
    // 백엔드 도메인 패턴 확인 (예: s2-5nwgikdioa-du.a.run.app)
    const backendDomainPattern = /s2-5nwgikdioa-du\.a\.run\.app/;
    return backendDomainPattern.test(url);
  }
} 