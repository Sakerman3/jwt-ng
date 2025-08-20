import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: 'login', loadComponent: () => import('./login.component').then(m => m.LoginComponent) },
  { path: 'dashboard', canActivate: [authGuard], loadComponent: () => import('./dashboard.component').then(m => m.DashboardComponent) },
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  { path: '**', redirectTo: 'dashboard' }
];

// Old code
// import { Routes } from '@angular/router';
// import { authGuard } from './guards/auth.guard';
// import { LoginComponent } from './login.component';
// import { DashboardComponent } from './dashboard.component';

// export const routes: Routes = [
//   { path: 'login', loadComponent: () => import('./login.component').then(m => m.LoginComponent) },
//   { path: '', redirectTo: 'login', pathMatch: 'full' },
//   { path: '**', redirectTo: 'login' }
// ];
