import { Component, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
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

  constructor(private msal: MsalService) {}

  ngOnInit(): void {
    // MSAL v3: after APP_INITIALIZER has run, process the redirect response once
    this.msal.instance.handleRedirectPromise().catch(err => {
      console.error('MSAL redirect handling error', err);
    });
  }
}
