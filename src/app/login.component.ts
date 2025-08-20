import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MsalService } from '@azure/msal-angular';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <h1>JWT Auth Login</h1>

      <button type="button" (click)="signIn()">Sign in with Microsoft</button>

      <hr />

      <h3>Pre-login API check</h3>
      <p>This call is expected to fail (unauthenticated).</p>
      <button type="button" (click)="testApi()">Test API (should fail)</button>
      <p class="result" *ngIf="apiMessage">{{ apiMessage }}</p>
    </div>
  `,
  styles: [`
    .container { max-width: 360px; margin: 10vh auto; display: grid; gap: 12px; }
    h1 { font-size: 24px; font-weight: bold; text-align: center; }
    button { padding: 10px 12px; border-radius: 8px; border: none; cursor: pointer; }
    .result { font-size: 13px; color: #555; word-break: break-word; }
  `]
})
export class LoginComponent {
  constructor(
    private msal: MsalService,
    private router: Router,
    private http: HttpClient
  ) {}

  apiMessage = '';

  async signIn() {
    const scopes = [environment.auth.apiScope];

    try {
      await this.msal.initialize(); // ensure MSAL is ready

      // Try POPUP first
      const result = await this.msal.instance.loginPopup({ scopes });
      if (result?.account) this.msal.instance.setActiveAccount(result.account);

      // Navigate after successful popup sign-in
      await this.router.navigateByUrl('/dashboard');
    } catch (err) {
      console.warn('Popup login failed or was blocked, falling back to redirect.', err);

      // Fall back to REDIRECT
      await this.msal.instance.loginRedirect({
        scopes,
        redirectStartPage: '/dashboard',
      });
    }
  }

  testApi() {
    this.apiMessage = '';
    const url = new URL('/api/account', ensureTrailingSlash(environment.apiUrl)).toString();

    this.http.get(url).subscribe({
      next: (r) => {
        // If this unexpectedly succeeds, show it
        this.apiMessage = `Unexpected success calling ${url}: ${JSON.stringify(r)}`;
      },
      error: (err) => {
        const status = err?.status ?? 'unknown';
        const detail = err?.error?.error || err?.message || 'No error body';
        this.apiMessage = `Expected failure calling ${url} — status: ${status}; detail: ${detail}`;
      }
    });
  }
}

function ensureTrailingSlash(base: string): string {
  return base.endsWith('/') ? base : `${base}/`;
}
