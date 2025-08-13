import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';

type LoginResponse = { token: string; user: { id: string; username: string; roles: string[] } };

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);

  private tokenKey = 'access_token';
  private userKey = 'auth_user';

  private get isBrowser() {
    return isPlatformBrowser(this.platformId);
  }

  login(username: string, password: string) {
    return this.http.post<LoginResponse>(`${environment.apiUrl}/auth/login`, { username, password })
      .pipe(tap(res => {
        if (this.isBrowser) {
          localStorage.setItem(this.tokenKey, res.token);
          localStorage.setItem(this.userKey, JSON.stringify(res.user));
        }
      }));
  }

  logout() {
    if (this.isBrowser) {
      localStorage.removeItem(this.tokenKey);
      localStorage.removeItem(this.userKey);
    }
    this.router.navigate(['/login']);
  }

  get token(): string | null {
    return this.isBrowser ? localStorage.getItem(this.tokenKey) : null;
  }

  get isAuthenticated(): boolean {
    return !!this.token;
  }

  get currentUser() {
    const raw = this.isBrowser ? localStorage.getItem(this.userKey) : null;
    return raw ? JSON.parse(raw) : null;
  }
}
