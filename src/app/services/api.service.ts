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
  private baseUrl = "https://s2-5nwgikdioa-du.a.run.app/api/";
  private isBrowser: boolean;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  private getFullUrl(endpoint: string): string {
    // Use full URL on server side
    if (!this.isBrowser) {
      return `${this.baseUrl}${endpoint}`;
    }
    // Use proxy settings on client side
    return `${this.apiUrl}${endpoint}`;
  }

  private getHeaders(): HttpHeaders {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
    

    // Don't add auth header on server side
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

  // Skip API request and return empty array on server side
  private skipOnServer<T>(data: T): Observable<T> {
    if (!this.isBrowser) {
      return of(data);
    }
    return null as any;
  }

  get<T>(endpoint: string, defaultValue: T = [] as any): Observable<T> {
    // Skip API request and return default value on server side
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
    // Skip API request and return default value on server side
    if (!this.isBrowser) {
      return of(defaultValue);
    }
  
    const headers = this.getHeaders();
  
    // FormData인 경우
    if (data instanceof FormData) {
      console.log('=== FormData Contents ===');
      console.log('Total entries:', Array.from(data.entries()).length);
  
      // images 필드 확인
      const images = data.getAll('images');
      console.log('Images count:', images.length);
      images.forEach((image, index) => {
        console.log(`Image ${index + 1}:`, {
          name: (image as File).name,
          type: (image as File).type,
          size: (image as File).size
        });
      });
  
      // data 필드 확인
      const dataField = data.get('data');
      console.log('Data field:', {
        type: typeof dataField,
        content: dataField
      });
  
      console.log('Headers before modification:', headers);
      console.log('=====================');
  
      // FormData를 다시 만들어서 data를 Blob(application/json)로 변환
      const formData = new FormData();
      for (const [key, value] of data.entries()) {
        if (key === 'data') {
          const jsonBlob = new Blob(
            [typeof value === 'string' ? value : JSON.stringify(value)], 
            { type: 'application/json' }
          );
          formData.append(key, jsonBlob);
        } else {
          formData.append(key, value);
        }
      }
  
      // FormData 보낼 때는 Content-Type 직접 설정하지 않는다
      return this.http.post<T>(this.getFullUrl(endpoint), formData, { 
        headers: headers.delete('Content-Type') 
      }).pipe(
        catchError(this.handleError)
      );
    }
  
    // 일반 JSON 데이터인 경우
    return this.http.post<T>(this.getFullUrl(endpoint), data, {
      headers: headers.set('Content-Type', 'application/json')
    }).pipe(
      catchError(this.handleError)
    );
  }
  
  // post<T>(endpoint: string, data: any, defaultValue: T = {} as T): Observable<T> {
  //   // 서버 사이드에서는 API 요청을 건너뛰고 기본값을 반환
  //   if (!this.isBrowser) {
  //     return of(defaultValue);
  //   }

  //   const headers = this.getHeaders();
    
  //   // FormData인 경우
  //   if (data instanceof FormData) {
  //     // FormData 내용 상세 로깅
  //     console.log('=== FormData Contents ===');
  //     console.log('Total entries:', Array.from(data.entries()).length);
      
  //     // images 필드 확인
  //     const images = data.getAll('images');
  //     console.log('Images count:', images.length);
  //     images.forEach((image, index) => {
  //       console.log(`Image ${index + 1}:`, {
  //         name: (image as File).name,
  //         type: (image as File).type,
  //         size: (image as File).size
  //       });
  //     });
      
  //     // data 필드 확인
  //     const dataField = data.get('data');
  //     console.log('Data field:', {
  //       type: typeof dataField,
  //       content: dataField
  //     });
      
  //     console.log('Headers:', headers);
  //     console.log('=====================');
      
  //     // FormData의 data 필드에 대한 Content-Type 설정
  //     const formData = new FormData();
  //     for (const [key, value] of data.entries()) {
  //       if (key === 'data') {
  //         const jsonBlob = new Blob([value as string], { type: 'application/json' });
  //         formData.append(key, jsonBlob);
  //       } else {
  //         formData.append(key, value);
  //       }
  //     }
      
  //     return this.http.post<T>(this.getFullUrl(endpoint), formData, { headers });
  //   }
    
  //   // 일반 JSON 데이터인 경우
  //   return this.http.post<T>(this.getFullUrl(endpoint), data, {
  //     headers: headers.set('Content-Type', 'application/json')
  //   }).pipe(
  //     catchError(this.handleError)
  //   );
  // }

  put<T>(endpoint: string, data: any, defaultValue: T = {} as T): Observable<T> {
    // Skip API request and return default value on server side
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
    // Skip API request and return default value on server side
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
    // Skip API request and return default value on server side
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