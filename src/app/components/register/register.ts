import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';
import { ThemeService } from '../../services/theme';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.html',
})
export class Register {
  userData = { username: '', email: '', password: '' };
  errorMessage: string | null = null;
  showPassword = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    public themeService: ThemeService,
  ) {}

  onSubmit(): void {
    this.errorMessage = null;

    const username = this.userData.username.trim();
    const email = this.userData.email.trim();
    const password = this.userData.password;

    if (!username || !email || !password) {
      this.errorMessage = 'All fields are required.';
      return;
    }

    if (username.length > 18) {
      this.errorMessage = 'Username cannot exceed 18 characters.';
      return;
    }

    if (password.length < 4 || password.length > 18) {
      this.errorMessage = 'Password must be between 4 and 18 characters.';
      return;
    }

    this.authService.register({ username, email, password }).subscribe({
      next: (res) => {
        if (res.success) {
          this.router.navigate(['/login']);
        }
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'An error occurred during registration';
      },
    });
  }
}
