import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = environment.apiUrl;
  private baseUrl = environment.baseUrl;
  private isBrowser: boolean;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  private getFullUrl(endpoint: string): string {
    // 서버 사이드에서는 전체 URL을 사용
    if (!this.isBrowser) {
      return `${this.baseUrl}${endpoint}`;
    }
    // 클라이언트 사이드에서는 proxy 설정을 사용
    return `${this.apiUrl}${endpoint}`;
  }

  private getHeaders(): HttpHeaders {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });

    // 서버 사이드에서는 인증 헤더를 추가하지 않음
    if (this.isBrowser) {
      const accessToken = localStorage.getItem('accessToken');
      if (accessToken) {
        headers = headers.set('Authorization', `Bearer ${accessToken}`);
      }
    }

    return headers;
  }

  private handleError(error: any) {
    console.error('API Error:', error);
    return throwError(() => error);
  }

  // 서버 사이드에서는 API 요청을 건너뛰고 빈 배열을 반환하는 메서드
  private skipOnServer<T>(data: T): Observable<T> {
    if (!this.isBrowser) {
      return of(data);
    }
    return null as any;
  }

  get<T>(endpoint: string, defaultValue: T = [] as any): Observable<T> {
    // 서버 사이드에서는 API 요청을 건너뛰고 기본값을 반환
    if (!this.isBrowser) {
      return of(defaultValue);
    }

    const url = this.getFullUrl(endpoint);
    const headers = this.getHeaders();
    
    return this.http.get<T>(url, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  post<T>(endpoint: string, data: any, defaultValue: T = {} as T): Observable<T> {
    // 서버 사이드에서는 API 요청을 건너뛰고 기본값을 반환
    if (!this.isBrowser) {
      return of(defaultValue);
    }

    return this.http.post<T>(this.getFullUrl(endpoint), data, { 
      headers: this.getHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  put<T>(endpoint: string, data: any, defaultValue: T = {} as T): Observable<T> {
    // 서버 사이드에서는 API 요청을 건너뛰고 기본값을 반환
    if (!this.isBrowser) {
      return of(defaultValue);
    }

    return this.http.put<T>(this.getFullUrl(endpoint), data, { 
      headers: this.getHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  delete<T>(endpoint: string, defaultValue: T = {} as T): Observable<T> {
    // 서버 사이드에서는 API 요청을 건너뛰고 기본값을 반환
    if (!this.isBrowser) {
      return of(defaultValue);
    }

    return this.http.delete<T>(this.getFullUrl(endpoint), { 
      headers: this.getHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  patch<T>(endpoint: string, data: any, defaultValue: T = {} as T): Observable<T> {
    // 서버 사이드에서는 API 요청을 건너뛰고 기본값을 반환
    if (!this.isBrowser) {
      return of(defaultValue);
    }

    return this.http.patch<T>(this.getFullUrl(endpoint), data, { 
      headers: this.getHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }
} 