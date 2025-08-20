import { Component, OnInit, signal, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { MsalService } from '@azure/msal-angular';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `<router-outlet></router-outlet>`,
  styleUrls: ['./app.scss']
})
export class App implements OnInit {
  protected readonly title = signal('jwt-ng');
  private msal = inject(MsalService);
  private router = inject(Router);

  ngOnInit(): void {
    this.msal.instance.handleRedirectPromise()
      .then(result => {
        if (result?.account) {
          this.msal.instance.setActiveAccount(result.account);

          // ⬇️ Optional block: navigate to the page MSAL stored from redirectStartPage (if any), else /dashboard
          const startPage =
            sessionStorage.getItem('msal.redirectStartPage') ??
            localStorage.getItem('msal.redirectStartPage') ??
            '/dashboard';

          // Clean up to avoid stale redirects on future logins
          sessionStorage.removeItem('msal.redirectStartPage');
          localStorage.removeItem('msal.redirectStartPage');

          this.router.navigateByUrl(startPage);
          return;
        }

        // No redirect result — restore an existing session on refresh
        const existing = this.msal.instance.getActiveAccount() ?? this.msal.instance.getAllAccounts()[0];
        if (existing) this.msal.instance.setActiveAccount(existing);
      })
      .catch(err => console.error('MSAL redirect handling error', err));
  }
}


// import { Component, OnInit, signal, inject } from '@angular/core';
// import { Router, RouterOutlet } from '@angular/router';
// import { MsalService } from '@azure/msal-angular';

// @Component({
//   selector: 'app-root',
//   standalone: true,
//   imports: [RouterOutlet],
//   template: `<router-outlet></router-outlet>`,
//   styleUrls: ['./app.scss']
// })
// export class App implements OnInit {
//   protected readonly title = signal('jwt-ng');
//   private msal = inject(MsalService);
//   private router = inject(Router);

//   ngOnInit(): void {
//     this.msal.instance.handleRedirectPromise()
//       .then(result => {
//         if (result?.account) {
//           this.msal.instance.setActiveAccount(result.account);
//           this.router.navigateByUrl('/dashboard'); // ← go here after login
//           return;
//         }
//         // Restore session on refresh
//         const existing = this.msal.instance.getActiveAccount() ?? this.msal.instance.getAllAccounts()[0];
//         if (existing) this.msal.instance.setActiveAccount(existing);
//       })
//       .catch(err => console.error('MSAL redirect handling error', err));
//   }
// }



// Old code
// import { Component, OnInit, signal } from '@angular/core';
// import { RouterOutlet } from '@angular/router';
// import { MsalService } from '@azure/msal-angular';

// @Component({
//   selector: 'app-root',
//   standalone: true,
//   imports: [RouterOutlet],
//   template: `<router-outlet></router-outlet>`,
//   styleUrls: ['./app.scss']
// })
// export class App implements OnInit {
//   protected readonly title = signal('jwt-ng');

//   constructor(private msal: MsalService) {}

//   ngOnInit(): void {
//     // MSAL v3: after APP_INITIALIZER has run, process the redirect response once
//     this.msal.instance.handleRedirectPromise().catch(err => {
//       console.error('MSAL redirect handling error', err);
//     });
//   }
// }
