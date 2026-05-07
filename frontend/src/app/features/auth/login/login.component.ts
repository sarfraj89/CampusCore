import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });
  
  title = 'Admin Login';
  subtitle = 'Please enter your admin credentials to continue.';
  error: string | null = null;
  loading = false;

  onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }
    
    this.loading = true;
    this.error = null;
    
    this.authService.login(this.loginForm.value, '/dashboard').subscribe({
      next: () => {
        // Navigation is handled in service
      },
      error: (err) => {
        this.error = this.formatError(err);
        this.loading = false;
      }
    });
  }

  private formatError(err: unknown): string {
    if (typeof err === 'string') {
      return err;
    }

    if (err && typeof err === 'object') {
      const error = err as { message?: unknown; error?: unknown; statusText?: unknown };
      if (typeof error.message === 'string' && error.message.trim()) {
        return error.message;
      }
      if (typeof error.error === 'string' && error.error.trim()) {
        return error.error;
      }
      if (typeof error.statusText === 'string' && error.statusText.trim()) {
        return error.statusText;
      }
    }

    return 'Login failed';
  }
}
