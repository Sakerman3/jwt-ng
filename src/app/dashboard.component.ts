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
        <button (click)="callApi()">Call protected API</button>
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
    // Get the active account set during redirect handling
    let account = this.msal.instance.getActiveAccount();
    if (!account) {
      // Fallback to the first cached account (e.g., on refresh)
      account = this.msal.instance.getAllAccounts()[0];
      if (account) this.msal.instance.setActiveAccount(account);
    }

    // Prefer full name; fall back to username (email/UPN)
    this.displayName = account?.name || account?.username || 'User';
  }

  callApi(): void {
    this.error = '';
    this.apiResult = undefined;

    // Safe URL join: supports apiUrl with/without trailing slash
    const url = new URL('/api/secret', ensureTrailingSlash(environment.apiUrl)).toString();

    this.http.get(url).subscribe({
      next: (r) => (this.apiResult = r),
      error: (err) => {
        this.error = err?.error?.error ?? `API call failed (${err?.status || 'unknown'})`;
        console.error('API error', err);
      }
    });
  }

  logout(): void {
    // Use MSAL logout (redirect back to app root)
    this.msal.instance.logoutRedirect({
      postLogoutRedirectUri: window.location.origin
    });
  }
}

/** Ensures a trailing slash on a base URL for URL() joining */
function ensureTrailingSlash(base: string): string {
  return base.endsWith('/') ? base : `${base}/`;
}

// Old code
// import { Component, inject } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { HttpClient } from '@angular/common/http';
// import { environment } from '../environments/environment';
// import { AuthService } from './services/auth.service';

// @Component({
//   selector: 'app-dashboard',
//   standalone: true,
//   imports: [CommonModule],
//   template: `
//     <div class="wrap">
//       <header>
//         <h2>Dashboard (Protected)</h2>
//         <div class="spacer"></div>
//         <button (click)="logout()">Logout</button>
//       </header>

//       <section>
//         <p>Welcome, {{ auth.currentUser?.username }}!</p>
//         <button (click)="callApi()">Call protected API</button>
//         <pre *ngIf="apiResult">{{ apiResult | json }}</pre>
//       </section>
//     </div>
//   `,
//   styles: [`
//     .wrap { max-width: 800px; margin: 4rem auto; }
//     header { display: flex; align-items: center; gap: 12px; }
//     .spacer { flex: 1 }
//     button { padding: 8px 12px; border-radius: 8px; border: 1px solid #ddd; background: #f7f7f7; cursor: pointer; }
//     pre { background: #111; color: #eee; padding: 12px; border-radius: 8px; }
//   `]
// })
// export class DashboardComponent {
//   apiResult: any;
//   auth = inject(AuthService);
//   private http = inject(HttpClient);

//   callApi() {
//     this.http.get(`${environment.apiUrl}/api/secret`).subscribe(r => this.apiResult = r);
//   }
//   logout() { this.auth.logout(); }
// }
