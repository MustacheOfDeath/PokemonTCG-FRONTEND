import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { PokemonService } from '../../services/pokemon';
import { AchievementService, Badge } from '../../services/achievement';
import { Navbar } from '../navbar/navbar';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-achievements',
  standalone: true,
  imports: [CommonModule, Navbar],
  templateUrl: './achievements.html',
  styleUrls: ['./achievements.css'],
})
export class AchievementsComponent implements OnInit {
  allBadges: Badge[] = [];
  unlockedCount = 0;
  isLoading: boolean = false;

  constructor(
    private pokemonService: PokemonService,
    private achievementService: AchievementService,
    private http: HttpClient,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadAchievements();
  }

  loadAchievements(): void {
    this.isLoading = true;
    const jsonUrl = 'assets/achievements/achievement.json';

    forkJoin({
      collection: this.pokemonService.getFullCollection(),
      config: this.http.get<any[]>(jsonUrl),
    }).subscribe({
      next: (res) => {
        const cardsArray = Array.isArray(res.collection)
          ? res.collection
          : (res.collection as any).cards || (res.collection as any).collection || [];

        this.allBadges = this.achievementService.calculateBadges(cardsArray, res.config);
        this.unlockedCount = this.allBadges.filter((b) => b.unlocked).length;

        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading achievements:', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      },
    });
  }

  getPercent(badge: Badge): number {
    if (badge.unlocked) return 100;
    return Math.min(Math.round((badge.currentProgress / badge.target) * 100), 100);
  }

  handleSectionChange(section: 'all' | 'collection' | 'wishlist'): void {
    this.router.navigate(['/dashboard'], { queryParams: { section: section } });
  }
}
