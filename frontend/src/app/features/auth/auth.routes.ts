import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { authGuard } from '../../core/guards/auth.guard';

export const authRoutes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', loadComponent: () => import('./register/register.component').then(m => m.RegisterComponent) },
  { path: 'student-login', loadComponent: () => import('./student-login/student-login.component').then(m => m.StudentLoginComponent) },
  { path: 'change-password', component: ChangePasswordComponent, canActivate: [authGuard] },
  { path: '', redirectTo: 'login', pathMatch: 'full' }
];
