import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient) {}

  login(credentials: { username: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials, { withCredentials: true }).pipe(
      tap((response: any) => {
        if (response && response.success) {
          localStorage.setItem('currentUser', response.username);

          // TODO: Remove this localStorage fallback once HTTPS-only and secure HttpOnly cookies are fully enforced in production
          localStorage.setItem('isAuthenticated', 'true');

          localStorage.setItem('isAdmin', String(response.isAdmin));
        }
      }),
    );
  }

  register(userData: { username: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData);
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('authToken');
    // TODO: Remove this localStorage fallback once HTTPS-only and secure HttpOnly cookies are fully enforced in production
    localStorage.removeItem('isAuthenticated');

    localStorage.removeItem('isAdmin');
  }

  isLoggedIn(): boolean {
    // TODO: Remove localStorage.isAuthenticated fallback once HTTPS-only and secure HttpOnly cookies are fully enforced in production
    return (
      localStorage.getItem('isAuthenticated') === 'true' ||
      localStorage.getItem('authToken') !== null
    );
  }

  getCurrentUser(): string | null {
    return localStorage.getItem('currentUser');
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  isAdmin(): boolean {
    return localStorage.getItem('isAdmin') === 'true';
  }

  sendOtp(username: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/password-reset/request`, { username, newPassword });
  }

  verifyAndReset(username: string, otpCode: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/password-reset/confirm`, { username, otpCode });
  }

  sendOtpForgot(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/forgot-password/request`, { email });
  }

  verifyAndResetForgot(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/forgot-password/confirm`, data);
  }
}
