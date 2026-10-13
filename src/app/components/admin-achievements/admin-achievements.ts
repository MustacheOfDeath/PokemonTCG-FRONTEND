import { ChangeDetectorRef, Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Navbar } from '../navbar/navbar';
import { TAILWIND_PALETTE } from './tailwind-palette';


@Component({
  selector: 'app-admin-achievements',
  standalone: true,
  imports: [CommonModule, FormsModule, Navbar],
  templateUrl: './admin-achievements.html',
  styleUrls: ['./admin-achievements.css'],
})
export class AdminAchievementsComponent implements OnInit {
  achievements: any[] = [];
  editingAchievement: any = null;
  isModalOpen = false;

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadAchievements();
  }

  loadAchievements(): void {
    this.http.get<any[]>('/assets/achievements/achievement.json').subscribe({
      next: (data) => {
        this.achievements = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Fatal error:', err),
    });
  }

  openEditModal(achievement: any): void {
    this.editingAchievement = achievement.id
      ? { ...achievement }
      : {
          id: '',
          title: '',
          description: '',
          category: 'quantity',
          target: 0,
          conditionKey: '',
          image: '',
          colorClass: '',
        };
    this.isModalOpen = true;
  }

  isFormValid(): boolean {
    return !!(
      this.editingAchievement.id &&
      this.editingAchievement.title &&
      this.editingAchievement.target
    );
  }

  saveAchievement(): void {
    const index = this.achievements.findIndex((a) => a.id === this.editingAchievement.id);
    if (index > -1) {
      this.achievements[index] = { ...this.editingAchievement };
    } else {
      this.achievements.push({ ...this.editingAchievement });
    }
    this.isModalOpen = false;
    this.editingAchievement = null;
  }

  downloadJson(): void {
    const blob = new Blob([JSON.stringify(this.achievements, null, 2)], {
      type: 'application/json',
    });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'achievement.json';
    a.click();
    window.URL.revokeObjectURL(url);
  }

  colorKeys = Object.keys(TAILWIND_PALETTE);

  updateColorBySelect(type: 'from' | 'to', event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const selectedColor = selectElement.value;

    let currentClasses = this.editingAchievement.colorClass || '';

    let parts = currentClasses
      .split(' ')
      .filter((p: string) => p.trim() !== '' && !p.startsWith('from-') && !p.startsWith('to-'));

    parts.push(`from-${type === 'from' ? selectedColor : this.getExistingColor('from')}`);
    parts.push(`to-${type === 'to' ? selectedColor : this.getExistingColor('to')}`);

    const baseClasses = ['bg-gradient-to-r', 'bg-clip-text', 'text-transparent'];
    baseClasses.forEach((cls) => {
      if (!parts.includes(cls)) parts.push(cls);
    });

    this.editingAchievement.colorClass = parts.join(' ');
    this.cdr.detectChanges();
  }

  getExistingColor(type: 'from' | 'to'): string {
    const parts = this.editingAchievement.colorClass.split(' ');
    const found = parts.find((p: string) => p.startsWith(`${type}-`));
    return found ? found.replace(`${type}-`, '') : 'gray-500';
  }

  isColorSelected(type: 'from' | 'to', color: string): boolean {
    const currentClass = this.editingAchievement.colorClass || '';
    return type === 'from'
      ? currentClass.includes(`from-${color}`)
      : currentClass.includes(`to-${color}`);
  }
  getHexFromPalette(colorKey: string): string {
    return TAILWIND_PALETTE[colorKey] || '#ffffff';
  }

  getSelectedColor(type: 'from' | 'to'): string {
    const parts = (this.editingAchievement.colorClass || '').split(' ');
    const found = parts.find((p: string) => p.startsWith(`${type}-`));
    return found ? found.replace(`${type}-`, '') : 'gray-500';
  }

  activeDropdown: 'from' | 'to' | null = null;

  selectColor(type: 'from' | 'to', color: string): void {
    this.updateColorBySelect(type, { target: { value: color } } as any);
    this.activeDropdown = null;
  }

  @HostListener('document:click', ['$event'])
  clickout(event: any) {
    if (!event.target.closest('.color-dropdown')) {
      this.activeDropdown = null;
    }
  }
}
