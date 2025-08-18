import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MsalRedirectComponent } from '@azure/msal-angular';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,MsalRedirectComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  template: `
    <router-outlet></router-outlet>
    <msal-redirect></msal-redirect>
  `
})
export class App {
  protected readonly title = signal('jwt-ng');
}
