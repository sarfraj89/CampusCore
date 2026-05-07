import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap, catchError } from 'rxjs/operators';
import { throwError, Observable, BehaviorSubject } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  role: string;
  userId: string;
  fullName: string;
  firstLogin: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private readonly apiUrl = `${environment.apiUrl}/api/auth`;

  // Use a BehaviorSubject for auth state so it's reactive across the app
  private currentUserSubject = new BehaviorSubject<AuthResponse | null>(this.getStoredUser());
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() { }

  private getStoredUser(): AuthResponse | null {
    const stored = localStorage.getItem('currentUser');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return null;
      }
    }
    return null;
  }

  get currentUserValue(): AuthResponse | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    return !!this.currentUserValue && !!this.currentUserValue.accessToken;
  }

  login(credentials: any, redirectUrl: string = '/dashboard'): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials)
      .pipe(
        tap(response => {
          this.setSession(response);
          if (response.firstLogin) {
            this.router.navigate(['/auth/change-password']);
          } else if (redirectUrl) {
            this.router.navigate([redirectUrl]);
          } else {
            this.router.navigate(['/dashboard']);
          }
        })
      );
  }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData);
  }

  changePassword(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/change-password`, data)
      .pipe(
        tap(() => {
          // Password changed successfully, update the firstLogin flag in local storage
          const user = this.currentUserValue;
          if (user) {
            user.firstLogin = false;
            this.setSession(user);
          }
          this.router.navigate([this.getHomeRouteForCurrentUser()]);
        })
      );
  }

  refreshToken(): Observable<AuthResponse> {
    const current = this.currentUserValue;
    if (!current || !current.refreshToken) {
      return throwError(() => new Error('No refresh token available'));
    }
    
    return this.http.post<AuthResponse>(`${this.apiUrl}/refresh`, { refreshToken: current.refreshToken })
      .pipe(
        tap(response => {
          this.setSession(response);
        }),
        catchError(error => {
          this.logout();
          return throwError(() => error);
        })
      );
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.router.navigate(['/auth/login']);
  }

  private setSession(authResult: AuthResponse): void {
    localStorage.setItem('currentUser', JSON.stringify(authResult));
    this.currentUserSubject.next(authResult);
  }

  private getHomeRouteForCurrentUser(): string {
    return this.currentUserValue?.role === 'STUDENT' ? '/student-portal' : '/dashboard';
  }
}
