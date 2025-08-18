import { Component } from '@angular/core';
import { MsalService } from '@azure/msal-angular';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-login',
  template: `<button type="button" (click)="signIn()">Sign in with Microsoft</button>`
})
export class LoginComponent {
  constructor(private msal: MsalService) {}
  signIn() {
    this.msal.loginRedirect({ scopes: [environment.auth.apiScope] });
  }
}
