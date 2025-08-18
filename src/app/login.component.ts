import { Component } from '@angular/core';
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
    label { display: grid; gap: 4px; }
    input { padding: 8px; border: 1px solid #ddd; border-radius: 6px; }
    button { padding: 10px 12px; border-radius: 8px; border: none; cursor: pointer; }
    .hint { color: #666; font-size: 12px; }
    .error { color: #b00020; }
  `]
})

// @Component({
//   selector: 'app-login',
//   template: `<button type="button" (click)="signIn()">Sign in with Microsoft</button>`
// })
export class LoginComponent {
  constructor(private msal: MsalService) {}
  signIn() {
    this.msal.loginRedirect({ scopes: [environment.auth.apiScope] });
  }
}
