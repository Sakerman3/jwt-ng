import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { AuthService } from './services/auth.service';

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
        <p>Welcome, {{ auth.currentUser?.username }}!</p>
        <button (click)="callApi()">Call protected API</button>
        <pre *ngIf="apiResult">{{ apiResult | json }}</pre>
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
export class DashboardComponent {
  apiResult: any;
  auth = inject(AuthService);
  private http = inject(HttpClient);

  callApi() {
    this.http.get(`${environment.apiUrl}/api/secret`).subscribe(r => this.apiResult = r);
  }
  logout() { this.auth.logout(); }
}
