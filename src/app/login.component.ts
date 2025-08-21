import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MsalService } from '@azure/msal-angular';
import { Router } from '@angular/router';
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

      <h3>API Test</h3>
      <button type="button" (click)="apiTest()">API test</button>
      <pre *ngIf="apiMessage">{{ apiMessage }}</pre>
    </div>
  `,
  styles: [`
    .container { max-width: 360px; margin: 10vh auto; display: grid; gap: 12px; }
    h1 { font-size: 24px; font-weight: bold; text-align: center; }
    h3 { font-size: 18px; font-weight: bold; text-align: center; }
    button { padding: 10px 12px; border-radius: 8px; border: none; cursor: pointer; }
    pre { background:#111;color:#eee;padding:12px;border-radius:8px;white-space:pre-wrap;word-break:break-word; }
  `]
})
export class LoginComponent {
  apiMessage = '';

  constructor(private msal: MsalService, private router: Router) {}

  async signIn() {
    const scopes = [environment.auth.apiScope];
    try {
      await this.msal.initialize();
      const result = await this.msal.instance.loginPopup({ scopes });
      if (result?.account) this.msal.instance.setActiveAccount(result.account);
      await this.router.navigateByUrl('/dashboard');
    } catch (err) {
      await this.msal.instance.loginRedirect({ scopes, redirectStartPage: '/dashboard' });
    }
  }

  apiTest() {
    // “Same source as name”: MSAL account cache
    const acct = this.msal.instance.getActiveAccount()
             ?? this.msal.instance.getAllAccounts()[0];

    if (!acct) {
      this.apiMessage = 'No active account in MSAL cache (not signed in yet).';
      return;
    }

    const summary = {
      source: 'msal-account-cache',
      name: acct.name,
      username: acct.username,
      tenantId: acct.tenantId,
      homeAccountId: acct.homeAccountId,
      localAccountId: acct.localAccountId
    };
    this.apiMessage = JSON.stringify(summary, null, 2);
  }
}