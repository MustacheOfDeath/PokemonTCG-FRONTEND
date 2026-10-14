import { Router } from '@angular/router';
import { Routes } from '@angular/router';
import { inject } from '@angular/core';
import { Login } from './components/login/login';
import { Register } from './components/register/register';
import { Dashboard } from './components/dashboard/dashboard';
import { Profile } from './components/profile/profile';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard';
import { AchievementsComponent } from './components/achievements/achievements';
import { AdminAchievementsComponent } from './components/admin-achievements/admin-achievements';
import { AboutComponent } from './components/about/about';

const adminBlockGuard = () => {
  const router = inject(Router);
  const isAdmin = localStorage.getItem('isAdmin') === 'true';
  if (isAdmin) {
    router.navigate(['/admin']);
    return false;
  }
  return true;
};

const adminOnlyGuard = () => {
  const router = inject(Router);
  const isAdmin = localStorage.getItem('isAdmin') === 'true';
  if (!isAdmin) {
    router.navigate(['/dashboard']);
    return false;
  }
  return true;
};

export const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'register', component: Register },

  { path: 'dashboard', component: Dashboard, canActivate: [adminBlockGuard] },
  { path: 'profile', component: Profile, canActivate: [adminBlockGuard] },
  { path: 'about', component: AboutComponent, canActivate: [adminBlockGuard] },

  {
    path: 'achievements',
    component: AchievementsComponent,
    canActivate: [adminBlockGuard],
  },

  {
    path: 'admin/dashboard',
    component: AdminDashboardComponent,
    title: 'Admin Panel - PokéCollector',
    canActivate: [adminOnlyGuard],
  },

  {
    path: 'admin/achievements',
    component: AdminAchievementsComponent,
    canActivate: [adminOnlyGuard],
  },

  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' },
];
