import { Component, OnInit, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Navbar } from '../navbar/navbar';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, Navbar],
  templateUrl: './profile.html',
})
export class Profile implements OnInit, AfterViewInit {
  avatarUrl: string = 'assets/userPlaceholder.png';
  selectedFileName: string = '';

  passwordData = { newPassword: '', otpCode: '' };
  isOtpSent: boolean = false;
  showPassword = false;

  feedbackMessage: string | null = null;
  isError: boolean = false;

  showDeleteModal: boolean = false;

  private apiUrl = `${environment.apiUrl}/auth`;

  constructor(
    private http: HttpClient,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.http
      .get<{ avatar: string }>(`${environment.apiUrl}/user/${this.getUsername()}/avatar`)
      .subscribe((res) => {
        if (res.avatar) {
          this.avatarUrl = res.avatar;
          this.cdr.detectChanges();
        }
      });
  }

  ngAfterViewInit(): void {
    this.attachDeleteListener();
  }

  private attachDeleteListener(): void {
    setTimeout(() => {
      const deleteBtn = document.getElementById('btn-delete-account');
      if (deleteBtn) {
        deleteBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          this.openConfirmationModal();
        });
      }
    }, 100);
  }

  getUsername(): string {
    return localStorage.getItem('username') || localStorage.getItem('currentUser') || 'Trainer';
  }

  onSectionChange(section: string): void {
    this.router.navigate(['/dashboard'], { queryParams: { section: section } });
  }

  showFeedback(msg: string, error: boolean = false) {
    this.feedbackMessage = msg;
    this.isError = error;
    this.cdr.detectChanges();
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file && file.size <= 2 * 1024 * 1024) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const base64Image = e.target.result;

        this.http
          .post(`${environment.apiUrl}/user/${this.getUsername()}/avatar`, {
            avatar: base64Image,
          })
          .subscribe({
            next: () => {
              this.avatarUrl = base64Image;
              this.showFeedback('Avatar saved to database!');
              this.cdr.detectChanges();
            },
            error: () => this.showFeedback('Failed to save avatar', true),
          });
      };
      reader.readAsDataURL(file);
    }
  }

  requestPasswordChange(): void {
    this.showFeedback('');
    if (!this.isOtpSent) {
      this.isOtpSent = true;
      this.http
        .post(`${this.apiUrl}/password-reset/request`, {
          username: this.getUsername(),
          newPassword: this.passwordData.newPassword,
        })
        .subscribe({
          next: () => {
            this.showFeedback('Verification code sent! Check your registered email.');
            this.cdr.detectChanges();
          },
          error: (err) => {
            this.isOtpSent = false;
            this.showFeedback(err.error?.message || 'Failed to send email', true);
          },
        });
    } else {
      this.http
        .post(`${this.apiUrl}/password-reset/confirm`, {
          username: this.getUsername(),
          otpCode: this.passwordData.otpCode,
        })
        .subscribe({
          next: () => {
            this.showFeedback('Password changed successfully! Logging out...');
            setTimeout(() => {
              localStorage.clear();
              this.router.navigate(['/login']);
            }, 2000);
          },
          error: (err) =>
            this.showFeedback(err.error?.message || 'Invalid verification code', true),
        });
    }
  }

  openConfirmationModal(): void {
    this.showDeleteModal = true;
    this.cdr.detectChanges();
  }

  closeConfirmationModal(): void {
    this.showDeleteModal = false;
    this.cdr.detectChanges();
    this.attachDeleteListener();
  }

  confirmDeleteAccount(): void {
    this.showDeleteModal = false;
    this.showFeedback('Processing permanent account deletion...', false);

    const usernameToDelete = this.getUsername();
    this.http.delete<any>(`${this.apiUrl}/account/${usernameToDelete}`).subscribe({
      next: (response) => {
        this.showFeedback(response.message || 'Account deleted successfully!');
        setTimeout(() => {
          localStorage.clear();
          this.router.navigate(['/login']);
        }, 1500);
      },
      error: (err) => {
        console.error('Delete account error details:', err);
        this.showFeedback(err.error?.message || 'Failed to delete account.', true);
      },
    });
  }
}
