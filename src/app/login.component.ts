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
    </div>
  `,
  styles: [`
    .container { max-width: 360px; margin: 10vh auto; display: grid; gap: 12px; }
    h1 { font-size: 24px; font-weight: bold; text-align: center; }
    button { padding: 10px 12px; border-radius: 8px; border: none; cursor: pointer; }
  `]
})
export class LoginComponent {
  constructor(private msal: MsalService, private router: Router) {}

  async signIn() {
    const scopes = [environment.auth.apiScope];

    try {
      await this.msal.initialize(); // ensure MSAL is ready

      // Try POPUP first
      const result = await this.msal.instance.loginPopup({
        scopes,
        // prompt: 'select_account' // uncomment if you want the account picker every time
      });

      if (result?.account) {
        this.msal.instance.setActiveAccount(result.account);
      }

      // Navigate after successful popup sign-in
      await this.router.navigateByUrl('/dashboard');
    } catch (err) {
      console.warn('Popup login failed or was blocked, falling back to redirect.', err);

      // Fall back to REDIRECT
      await this.msal.instance.loginRedirect({
        scopes,
        redirectStartPage: '/dashboard',
        // prompt: 'select_account'
      });
    }
  }
}



// Old code
// import { Component, inject } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { MsalService } from '@azure/msal-angular';
// import { environment } from '../environments/environment';

// @Component({
//   selector: 'app-login',
//   standalone: true,
//   imports: [CommonModule, FormsModule],
//   template: `
//   <div class="container">
//     <h1>JWT Auth Login</h1>
//     <button type="button" (click)="signIn()">Sign in with Microsoft</button>
//   </div>
//   `,
//   styles: [`
//     .container { max-width: 360px; margin: 10vh auto; display: grid; gap: 12px; }
//     h1 { font-size: 24px; font-weight: bold; text-align: center; }
//     label { display: grid; gap: 4px; }
//     input { padding: 8px; border: 1px solid #ddd; border-radius: 6px; }
//     button { padding: 10px 12px; border-radius: 8px; border: none; cursor: pointer; }
//     .hint { color: #666; font-size: 12px; }
//     .error { color: #b00020; }
//   `]
// })

// export class LoginComponent {
//   constructor(private msal: MsalService) {}

//   async signIn() {
//     try {
//       await this.msal.initialize(); // belt-and-suspenders
//       await this.msal.instance.loginPopup({ scopes: [environment.auth.apiScope] });
//       await this.msal.instance.loginRedirect({
//         scopes: [environment.auth.apiScope],
//         // remember where to come back to after sign-in
//         redirectStartPage: '/dashboard'
//         // prompt: "select_account"  // uncomment to force account picker
//       });
//     } catch (e) {
//       console.error('loginRedirect failed', e);
//     }
//   }
// }

// // @Component({
// //   selector: 'app-login',
// //   template: `<button type="button" (click)="signIn()">Sign in with Microsoft</button>`
// // })

// // export class LoginComponent {
// //   constructor(private msal: MsalService) {}
// //   signIn() {
// //     this.msal.loginRedirect({ scopes: [environment.auth.apiScope] });
// //   }
// // }
