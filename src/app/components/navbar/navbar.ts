import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth';
import { ThemeService } from '../../services/theme';
import { NavigationService } from '../../services/navigation';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.html',
})
export class Navbar {
  isMenuOpen = false;
  avatarUrl: string = 'assets/userPlaceholder.png';

  constructor(
    private authService: AuthService,
    public router: Router,
    public themeService: ThemeService,
    private navService: NavigationService,
    private http: HttpClient,
  ) {}

  ngOnInit(): void {
    this.loadAvatar();
  }

  isUserLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }
  isAdmin(): boolean {
    return localStorage.getItem('isAdmin') === 'true';
  }
  getUsername(): string {
    return localStorage.getItem('username') || localStorage.getItem('currentUser') || 'Trainer';
  }

  loadAvatar(): void {
    const username = this.getUsername();
    this.http.get<{ avatar: string }>(`${environment.apiUrl}/user/${username}/avatar`).subscribe({
      next: (res) => {
        if (res && res.avatar) {
          this.avatarUrl = res.avatar;
        }
      },
      error: (err) => {
        console.error('Errore caricamento avatar', err);
      },
    });
  }

  getUserAvatar(): string {
    return this.avatarUrl;
  }

  onLogout(): void {
    this.isMenuOpen = false;
    this.authService.logout();
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  selectSection(section: 'all' | 'collection' | 'wishlist'): void {
    this.navService.pendingSection = section;
    this.router.navigate(['/dashboard']);
    this.isMenuOpen = false;
  }

  @HostListener('document:click')
  closeMenu(): void {
    this.isMenuOpen = false;
  }
}
