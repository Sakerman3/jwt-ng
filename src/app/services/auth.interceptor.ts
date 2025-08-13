import { Injectable } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  if (auth.token) {
    req = req.clone({
      setHeaders: { Authorization: `Bearer ${auth.token}` }
    });
  }
  return next(req);
};
