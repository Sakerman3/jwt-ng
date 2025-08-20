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

      <h3>API test</h3>
      <p>This call hits <code>/api/secret</code> and is expected to fail while not signed in.</p>
      <button type="button" (click)="apiTest()">API test</button>
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
      const result = await this.msal.instance.loginPopup({ scopes });
      if (result?.account) this.msal.instance.setActiveAccount(result.account);
      await this.router.navigateByUrl('/dashboard');
    } catch (err) {
      console.warn('Popup login failed, falling back to redirect.', err);
      await this.msal.instance.loginRedirect({
        scopes,
        redirectStartPage: '/dashboard',
      });
    }
  }

  apiTest() {
    this.apiMessage = '';
    const url = new URL('/api/secret', ensureTrailingSlash(environment.apiUrl)).toString();

    this.http.get(url).subscribe({
      next: (r) => {
        // If it somehow succeeds, report that too
        this.apiMessage = `Unexpected success calling ${url}: ${JSON.stringify(r)}`;
      },
      error: (err) => {
        const status = err?.status ?? 'unknown';
        const detail = err?.error?.error || err?.message || 'No error body';
        this.apiMessage = `Expected failure calling ${url} — status: ${status}; detail: ${detail}`;
        console.error('API error', err);
      }
    });
  }
}

function ensureTrailingSlash(base: string): string {
  return base.endsWith('/') ? base : `${base}/`;
}
