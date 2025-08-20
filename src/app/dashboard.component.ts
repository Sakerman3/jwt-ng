import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MsalService } from '@azure/msal-angular';

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

        <h3>Account info (same source as name)</h3>
        <button (click)="apiTest()">API test</button>
        <pre *ngIf="apiResult">{{ apiResult }}</pre>
        <p *ngIf="error" style="color:#b00020">{{ error }}</p>
      </section>
    </div>
  `,
  styles: [`
    .wrap { max-width: 800px; margin: 4rem auto; }
    header { display: flex; align-items: center; gap: 12px; }
    .spacer { flex: 1 }
    button { padding: 8px 12px; border-radius: 8px; border: 1px solid #ddd; background: #f7f7f7; cursor: pointer; }
    pre { background:#111;color:#eee;padding:12px;border-radius:8px;white-space:pre-wrap;word-break:break-word; }
  `]
})
export class DashboardComponent implements OnInit {
  private msal = inject(MsalService);
  private router = inject(Router);

  displayName = '';
  apiResult = '';
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
    const acct = this.msal.instance.getActiveAccount()
             ?? this.msal.instance.getAllAccounts()[0];

    if (!acct) {
      this.apiResult = '';
      this.error = 'No active account in MSAL cache.';
      return;
    }

    // Show the same data source used for the greeting
    const summary = {
      source: 'msal-account-cache',
      name: acct.name,
      username: acct.username,
      tenantId: acct.tenantId,
      homeAccountId: acct.homeAccountId,
      localAccountId: acct.localAccountId
    };

    // Optionally tighten the greeting to match server-ish preferred field
    this.displayName = summary.name || summary.username || this.displayName;

    this.apiResult = JSON.stringify(summary, null, 2);
  }

  logout(): void {
    this.msal.instance.logoutRedirect({ postLogoutRedirectUri: window.location.origin });
  }
}