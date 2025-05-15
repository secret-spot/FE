import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = environment.apiUrl;
 

  constructor(private http: HttpClient) {}

  private getFullUrl(endpoint: string): string {
    return `${this.apiUrl}${endpoint}`;
  }

  private getHeaders(): HttpHeaders {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });

    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      headers = headers.set('Authorization', `Bearer ${accessToken}`);
    }

    return headers;
  }

  private handleError(error: any) {
    console.error('An error occurred:', error);
    return throwError(() => error);
  }

  get<T>(endpoint: string): Observable<T> {
    const url = this.getFullUrl(endpoint);
    const headers = this.getHeaders();
    
    return this.http.get<T>(url, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  post<T>(endpoint: string, data: any): Observable<T> {
    const headers = this.getHeaders();
    
    //guide post upload
    if (data instanceof FormData) {
      const formData = new FormData();
    
      for (const [key, value] of data.entries()) {
        if (key === 'data') {
          const json =
            typeof value === 'string' ? value : JSON.stringify(value);
          const jsonBlob = new Blob([json], { type: 'application/json' });
          formData.append('data', jsonBlob);
        } else {
          // images 또는 다른 파일 필드
          if (Array.isArray(value)) {
            value.forEach((item: File) => {
              formData.append(key, item); 
            });
          } else {
            formData.append(key, value);
          }
        }
      }
    
      
      return this.http.post<T>(this.getFullUrl(endpoint), formData, {
        headers: headers.delete('Content-Type'),
      }).pipe(catchError(this.handleError));
    }
    
    return this.http.post<T>(this.getFullUrl(endpoint), data, {
      headers: headers.set('Content-Type', 'application/json')
    }).pipe(
      catchError(this.handleError)
    );
  }

  put<T>(endpoint: string, data: any): Observable<T> {
    return this.http.put<T>(this.getFullUrl(endpoint), data, { 
      headers: this.getHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  delete<T>(endpoint: string): Observable<T> {
    return this.http.delete<T>(this.getFullUrl(endpoint), { 
      headers: this.getHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  patch<T>(endpoint: string, data: any): Observable<T> {
    return this.http.patch<T>(this.getFullUrl(endpoint), data, { 
      headers: this.getHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }
} 