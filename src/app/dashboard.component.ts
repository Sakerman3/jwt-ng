import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { MsalService } from '@azure/msal-angular';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="wrap">
      <header>
        <h2>Dashboard (Protected)</h2>
        <div class="spacer"></div>
        <button (click)="logout()">Logout</button>
      </header>

      <section>
        <p>Welcome, {{ displayName }}!</p>

        <h3>Account info from API</h3>
        <button (click)="apiTest()">API test</button>
        <pre *ngIf="apiResult">{{ apiResult | json }}</pre>
        <p *ngIf="error" style="color:#b00020">{{ error }}</p>
      </section>
    </div>
  `,
  styles: [`
    .wrap { max-width: 800px; margin: 4rem auto; }
    header { display: flex; align-items: center; gap: 12px; }
    .spacer { flex: 1 }
    button { padding: 8px 12px; border-radius: 8px; border: 1px solid #ddd; background: #f7f7f7; cursor: pointer; }
    pre { background: #111; color: #eee; padding: 12px; border-radius: 8px; }
  `]
})
export class DashboardComponent implements OnInit {
  private http = inject(HttpClient);
  private msal = inject(MsalService);
  private router = inject(Router);

  displayName = '';
  apiResult: any;
  error = '';

  ngOnInit(): void {
    let account = this.msal.instance.getActiveAccount();
    if (!account) {
      account = this.msal.instance.getAllAccounts()[0];
      if (account) this.msal.instance.setActiveAccount(account);
    }
    this.displayName = account?.name || account?.username || 'User';
  }

  apiTest(): void {
    this.error = '';
    this.apiResult = undefined;

    const url = new URL('/api/account', ensureTrailingSlash(environment.apiUrl)).toString();
    console.log('API test ->', url);

    this.http.get(url).subscribe({
      next: (r) => (this.apiResult = r),
      error: (err) => {
        const status = err?.status ?? 'unknown';
        const detail = err?.error?.error || err?.message || 'No error body';
        this.error = `API call failed (${status}) — ${detail}`;
        console.error('API error', err);
      }
    });
  }

  logout(): void {
    this.msal.instance.logoutRedirect({ postLogoutRedirectUri: window.location.origin });
  }
}

function ensureTrailingSlash(base: string): string {
  return base.endsWith('/') ? base : `${base}/`;
}