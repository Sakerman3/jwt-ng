import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MsalModule } from '@azure/msal-angular';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MsalModule],
  template: `
    <router-outlet></router-outlet>
    <msal-redirect></msal-redirect>
  `,
  styleUrls: ['./app.scss'] // correct property name (plural)
})
export class App {
  protected readonly title = signal('jwt-ng');
}
