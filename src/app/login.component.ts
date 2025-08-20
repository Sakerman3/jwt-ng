import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MsalService } from '@azure/msal-angular';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
  <div class="container">
    <h1>JWT Auth Login</h1>
    <button type="button" (click)="signIn()">Sign in with Microsoft</button>
  </div>
  `,
  styles: [`
    .container { max-width: 360px; margin: 10vh auto; display: grid; gap: 12px; }
    h1 { font-size: 24px; font-weight: bold; text-align: center; }
    label { display: grid; gap: 4px; }
    input { padding: 8px; border: 1px solid #ddd; border-radius: 6px; }
    button { padding: 10px 12px; border-radius: 8px; border: none; cursor: pointer; }
    .hint { color: #666; font-size: 12px; }
    .error { color: #b00020; }
  `]
})

export class LoginComponent {
  constructor(private msal: MsalService) {}

  async signIn() {
    try {
      await this.msal.initialize(); // belt-and-suspenders
      await this.msal.instance.loginRedirect({
        scopes: [environment.auth.apiScope],
        // remember where to come back to after sign-in
        redirectStartPage: window.location.origin + '/'
        // prompt: "select_account"  // uncomment to force account picker
      });
    } catch (e) {
      console.error('loginRedirect failed', e);
    }
  }
}

// @Component({
//   selector: 'app-login',
//   template: `<button type="button" (click)="signIn()">Sign in with Microsoft</button>`
// })

// export class LoginComponent {
//   constructor(private msal: MsalService) {}
//   signIn() {
//     this.msal.loginRedirect({ scopes: [environment.auth.apiScope] });
//   }
// }
