import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService, AdminUser } from '../../services/admin';
import { Navbar } from '../navbar/navbar';
import { interval, Subscription, switchMap, takeWhile } from 'rxjs';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, Navbar],
  templateUrl: './admin-dashboard.html',
  styleUrls: ['./admin-dashboard.css'],
})
export class AdminDashboardComponent implements OnInit, OnDestroy {
  isImporting = false;
  users: AdminUser[] = [];
  isLoading = true;
  errorMessage = '';

  isModalOpen = false;
  modalTitle = '';
  modalMessage = '';
  modalType: 'danger' | 'warning' | 'info' = 'info';
  requiresInput = false;
  inputLabel = '';
  inputValue = '';
  inputPlaceholder = '';
  lastImportTime = 'Loading...';

  private statusSubscription?: Subscription;

  private pendingAction: () => void = () => {};

  constructor(
    private adminService: AdminService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadUsers();
    this.checkImportStatusAndPoll();
  }

  ngOnDestroy() {
    if (this.statusSubscription) {
      this.statusSubscription.unsubscribe();
    }
  }

  loadUsers(): void {
    this.isLoading = true;
    this.cdr.detectChanges();
    this.adminService.getAllUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.errorMessage = 'Error loading user data.';
        this.isLoading = false;
        this.cdr.detectChanges();
        console.error(err);
      },
    });
  }

  openCustomModal(
    title: string,
    message: string,
    type: 'danger' | 'warning' | 'info',
    action: () => void,
    withInput: boolean = false,
    label: string = '',
    initialValue: string = '',
    placeholder: string = '',
  ) {
    this.modalTitle = title;
    this.modalMessage = message;
    this.modalType = type;
    this.requiresInput = withInput;
    this.inputLabel = label;
    this.inputValue = initialValue;
    this.inputPlaceholder = placeholder;
    this.pendingAction = action;
    this.isModalOpen = true;
    this.cdr.detectChanges();
  }

  closeCustomModal() {
    this.isModalOpen = false;
    this.inputValue = '';
    this.cdr.detectChanges();
  }

  confirmCustomModal() {
    if (this.requiresInput && (!this.inputValue || this.inputValue.trim() === '')) {
      alert('The input field cannot be empty!');
      return;
    }
    this.pendingAction();
    this.closeCustomModal();
  }

  onLayerChangePassword(username: string): void {
    this.openCustomModal(
      'Reset Password',
      `You are forcing a password reset for user: ${username}.`,
      'info',
      () => {
        this.adminService.changePassword(username, this.inputValue).subscribe({
          next: () => this.loadUsers(),
          error: (err) => console.error('Error updating password.', err),
        });
      },
      true,
      'New Password:',
      '',
      'Enter new encrypted password...',
    );
  }

  onLayerChangeEmail(user: AdminUser): void {
    this.openCustomModal(
      'Update Email',
      `Changing system email address for: ${user.username}.`,
      'info',
      () => {
        this.adminService.changeEmail(user.username, this.inputValue).subscribe({
          next: () => this.loadUsers(),
          error: (err) => console.error('Error updating email.', err),
        });
      },
      true,
      'New Email:',
      user.email,
      'trainer@pokemon.com',
    );
  }

  onClearCollection(username: string): void {
    this.openCustomModal(
      'Clear Collection',
      `Are you sure you want to CLEAR the entire collection for ${username}? This action is irreversible.`,
      'warning',
      () => {
        this.adminService.clearCollection(username).subscribe({
          next: () => this.loadUsers(),
          error: (err) => console.error('Error clearing collection.', err),
        });
      },
    );
  }

  onClearWishlist(username: string): void {
    this.openCustomModal(
      'Clear Wishlist',
      `Are you sure you want to CLEAR the wishlist for ${username}?`,
      'warning',
      () => {
        this.adminService.clearWishlist(username).subscribe({
          next: () => this.loadUsers(),
          error: (err) => console.error('Error clearing wishlist.', err),
        });
      },
    );
  }

  onDeleteAccount(username: string): void {
    this.openCustomModal(
      'DELETE ACCOUNT',
      `WARNING: You are about to permanently delete ${username}. All progress, collection, and wishlist data will be lost forever.`,
      'danger',
      () => {
        this.adminService.deleteAccount(username).subscribe({
          next: () => {
            this.users = this.users.filter((u) => u.username !== username);
            this.cdr.detectChanges();
            this.loadUsers();
          },
          error: (err) => console.error('Error deleting account.', err),
        });
      },
    );
  }

  checkImportStatusAndPoll() {
    this.adminService.getImportStatus().subscribe({
      next: (statusObj) => {
        this.isImporting = statusObj.importing;
        this.lastImportTime = statusObj.lastImportTime;
        this.cdr.detectChanges();

        if (this.isImporting) {
          this.startPolling();
        }
      },
      error: (err) => console.error('Error checking import status', err),
    });
  }

  startPolling() {
    if (this.statusSubscription) {
      this.statusSubscription.unsubscribe();
    }

    this.statusSubscription = interval(3000)
      .pipe(
        switchMap(() => this.adminService.getImportStatus()),
        takeWhile((statusObj) => statusObj.importing === true, true),
      )
      .subscribe({
        next: (statusObj) => {
          this.isImporting = statusObj.importing;
          this.lastImportTime = statusObj.lastImportTime;
          this.cdr.detectChanges();

          if (!statusObj.importing) {
            this.loadUsers();
          }
        },
        error: (err) => console.error('Error during status polling', err),
      });
  }

  triggerDataImport() {
    this.openCustomModal(
      'Data Synchronization',
      'Are you sure you want to trigger the data synchronization? This action will update the database.',
      'warning',
      () => {
        this.isImporting = true;
        this.cdr.detectChanges();
        this.startPolling();

        this.adminService.loadData().subscribe({
          next: () => {
            this.adminService.getImportStatus().subscribe((statusObj) => {
              this.isImporting = statusObj.importing;
              this.lastImportTime = statusObj.lastImportTime;
              this.loadUsers();
              this.cdr.detectChanges();
            });
          },
          error: (err) => {
            console.error('Error during data sync.', err);
            this.isImporting = false;
            if (this.statusSubscription) {
              this.statusSubscription.unsubscribe();
            }
            this.cdr.detectChanges();
          },
        });
      },
    );
  }

  onActionSelected(event: any, user: any) {
    const action = event.target.value;
    switch (action) {
      case 'pwd':
        this.onLayerChangePassword(user.username);
        break;
      case 'email':
        this.onLayerChangeEmail(user);
        break;
      case 'clear-coll':
        this.onClearCollection(user.username);
        break;
      case 'clear-wish':
        this.onClearWishlist(user.username);
        break;
      case 'delete':
        this.onDeleteAccount(user.username);
        break;
    }
    event.target.value = '';
  }
}
