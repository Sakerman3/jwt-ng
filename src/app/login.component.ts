import { Component } from '@angular/core';
import { MsalService } from '@azure/msal-angular';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'  // ✅ correct
})
export class LoginComponent {
  constructor(private msal: MsalService) {}

  signIn() {
    this.msal.loginRedirect({
      scopes: [environment.auth.apiScope] // e.g. api://<API_APP_ID>/access_as_user
    });
  }
}