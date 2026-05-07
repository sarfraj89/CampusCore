import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  registerForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    fullName: ['', [Validators.required]],
    role: ['STUDENT', [Validators.required]]
  });
  
  roles = ['ADMIN', 'FACULTY', 'STUDENT'];
  error: string | null = null;
  success = false;
  loading = false;

  setRole(role: string) {
    this.registerForm.patchValue({ role });
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      return;
    }
    
    this.loading = true;
    this.error = null;
    
    this.authService.register(this.registerForm.value).subscribe({
      next: () => {
        this.success = true;
        this.loading = false;
        setTimeout(() => {
          this.router.navigate(['/auth/login']);
        }, 2000);
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

    return 'Registration failed. Please try again.';
  }
}
