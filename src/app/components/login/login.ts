import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';
import { ThemeService } from '../../services/theme';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
})
export class Login {
  credentials = { username: '', password: '' };
  errorMessage: string | null = null;
  successMessage: string | null = null;
  showPassword = false;
  showResetPassword = false;

  forgotPasswordMode = false;
  resetStep = 1;
  resetData = { email: '', otp: '', newPassword: '' };
  isLoading = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    public themeService: ThemeService,
    private cdr: ChangeDetectorRef,
  ) {}

  openForgotPassword(): void {
    this.forgotPasswordMode = true;
    this.showResetPassword = false;
    this.resetStep = 1;
    this.errorMessage = null;
    this.successMessage = null;
    this.resetData = { email: '', otp: '', newPassword: '' };
  }

  onSubmit(): void {
    this.errorMessage = null;
    this.successMessage = null;
    this.authService.login(this.credentials).subscribe({
      next: (res) => {
        localStorage.setItem('isAdmin', res.isAdmin ? 'true' : 'false');
        this.router.navigate([res.isAdmin ? '/admin/dashboard' : '/dashboard']);
      },
      error: (err) => (this.errorMessage = err.error?.message || 'Login failed'),
    });
  }

  requestOtp(): void {
    this.isLoading = true;

    this.authService.sendOtpForgot(this.resetData.email).subscribe({
      next: (res) => {
        this.isLoading = false;

        if (res.success) {
          this.resetStep = 2;
          this.cdr.detectChanges();
        } else {
          this.errorMessage = res.message;
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = 'Communication error: ' + (err.error?.message || 'Check console');
      },
    });
  }

  submitReset(): void {
    this.isLoading = true;
    this.authService.verifyAndResetForgot(this.resetData).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.success) {
          this.forgotPasswordMode = false;
          this.resetStep = 1;
          this.resetData = { email: '', otp: '', newPassword: '' };
          this.successMessage = 'Password updated successfully! You can now log in.';
          this.cdr.detectChanges();
        } else {
          this.errorMessage = res.message;
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Invalid or expired code.';
      },
    });
  }
}
