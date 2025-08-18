import { Component } from '@angular/core';
import { MsalService } from '@azure/msal-angular';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.ts'
})
export class LoginComponent {
  constructor(private msal: MsalService) {}

  signIn() {
    this.msal.loginRedirect({
      scopes: [environment.auth.apiScope]  // e.g. api://<API_APP_ID>/access_as_user
    });
  }
}


// import { Component, inject } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { AuthService } from './services/auth.service';
// import { Router } from '@angular/router';

// @Component({
//   selector: 'app-login',
//   standalone: true,
//   imports: [CommonModule, FormsModule],
//   template: `
//   <div class="container">
//     <h1>JWT Auth Login</h1>
//     <form (ngSubmit)="submit()">
//       <label>Username
//         <input [(ngModel)]="username" name="username" required />
//       </label>
//       <label>Password
//         <input [(ngModel)]="password" name="password" type="password" required />
//       </label>
//       <button [disabled]="loading">{{ loading ? 'Signing in...' : 'Sign in' }}</button>
//       <p class="hint">Demo user: <code>sven / password123</code></p>
//       <p class="error" *ngIf="error">{{ error }}</p>
//     </form>
//   </div>
//   `,
//   styles: [`
//     .container { max-width: 360px; margin: 10vh auto; display: grid; gap: 12px; }
//     label { display: grid; gap: 4px; }
//     input { padding: 8px; border: 1px solid #ddd; border-radius: 6px; }
//     button { padding: 10px 12px; border-radius: 8px; border: none; cursor: pointer; }
//     .hint { color: #666; font-size: 12px; }
//     .error { color: #b00020; }
//   `]
// })
// export class LoginComponent {
//   private auth = inject(AuthService);
//   private router = inject(Router);

//   username = '';
//   password = '';
//   loading = false;
//   error = '';

//   submit() {
//     this.loading = true;
//     this.error = '';
//     this.auth.login(this.username, this.password).subscribe({
//       next: () => this.router.navigate(['/']),
//       error: (err) => { this.error = err?.error?.error ?? 'Login failed'; this.loading = false; }
//     });
//   }
// }
