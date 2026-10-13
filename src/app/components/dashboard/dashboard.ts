import { Component, OnInit, ChangeDetectorRef, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PokemonService } from '../../services/pokemon';
import { Navbar } from '../navbar/navbar';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';
import { PokemonCardComponent } from '../pokemon-card/pokemon-card';
import { PokemonCardDetailsComponent } from '../pokemon-card-details/pokemon-card-details';
import { NavigationService } from '../../services/navigation';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, Navbar, PokemonCardComponent, PokemonCardDetailsComponent],
  templateUrl: './dashboard.html',
})
export class Dashboard implements OnInit {
  currentSection: 'all' | 'collection' | 'wishlist' = 'all';
  isLoading: boolean = false;

  cards: any[] = [];
  hasMoreCards: boolean = false;
  totalPages: number = 1;
  illustrators: string[] = [];
  sets: any[] = [];

  userCollection: string[] = [];
  userWishlist: string[] = [];

  filters = {
    name: '',
    illustratorId: '',
    setId: '',
    rarity: '',
    page: 1,
    sort: 'none',
  };

  currentSort: string = 'none';
  selectedCard: any = null;

  private masterSets: any[] = [];
  private masterIllustrators: string[] = [];
  protected rarities: string[] = [];

  constructor(
    private navService: NavigationService,
    private pokemonService: PokemonService,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private renderer: Renderer2,
  ) {}

  ngOnInit(): void {
    if (this.navService.pendingSection) {
      this.switchSection(this.navService.pendingSection);
      this.navService.pendingSection = null;
    } else {
      this.switchSection('all');
    }

    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    this.loadMetadata();
    this.loadData();
  }

  ngDoCheck(): void {
    if (this.navService.pendingSection && this.navService.pendingSection !== this.currentSection) {
      const newSection = this.navService.pendingSection;
      this.navService.pendingSection = null;
      this.switchSection(newSection);
    }
  }

  switchSection(section: 'all' | 'collection' | 'wishlist'): void {
    this.currentSection = section;
    this.currentSort = 'none';
    this.cards = [];
    this.filters = {
      name: '',
      illustratorId: '',
      setId: '',
      rarity: '',
      page: 1,
      sort: 'none',
    };
    this.loadData();
    this.cdr.detectChanges();
  }

  changeSort(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.currentSort = target.value;
    this.onSearch();
  }

  loadMetadata(): void {
    this.pokemonService.getMetadata().subscribe({
      next: (data) => {
        this.masterIllustrators = data.illustrators || [];
        this.masterSets = data.sets || [];
        this.rarities = data.rarities || [];
        this.illustrators = [...this.masterIllustrators];
        this.sets = [...this.masterSets];
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error loading metadata:', err),
    });
  }

  loadMetadataCollection(currentSection: 'collection' | 'wishlist'): void {
    this.pokemonService.getMetadataCollection(currentSection).subscribe({
      next: (data) => {
        this.masterIllustrators = data.illustrators || [];
        this.masterSets = data.sets || [];
        this.rarities = data.rarities || [];
        this.illustrators = [...this.masterIllustrators];
        this.sets = [...this.masterSets];
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error loading metadata:', err),
    });
  }

  handleOpenDetails(card: any) {
    this.selectedCard = card;
    this.renderer.addClass(document.body, 'overflow-hidden');
  }

  closeDetails() {
    this.selectedCard = null;
    this.renderer.removeClass(document.body, 'overflow-hidden');
  }

  loadData(): void {
    this.isLoading = true;

    if (this.currentSection !== 'all') {
      this.loadMetadataCollection(this.currentSection);
    } else {
      this.loadMetadata();
    }

    const request =
      this.currentSection === 'all'
        ? this.pokemonService.getCards(this.filters, 'cards')
        : this.currentSection === 'collection'
          ? this.pokemonService.getCards(this.filters, 'collection')
          : this.pokemonService.getCards(this.filters, 'wishlist');

    request.subscribe({
      next: (res: any) => {
        this.cards = res.cards || [];
        this.hasMoreCards = res.hasMoreCards || false;
        this.totalPages = res.totalPages || 1;
        this.userCollection = res.userCollection || [];
        this.userWishlist = res.userWishlist || [];

        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error:', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      },
    });
  }

  onSearch(): void {
    this.filters.sort = this.currentSort;
    this.filters.page = 1;
    this.loadData();
  }

  getVisiblePages(): number[] {
    const totalVisible = 5;
    let start = Math.max(1, this.filters.page - 2);
    let end = Math.min(this.totalPages, start + totalVisible - 1);

    start = Math.max(1, Math.min(start, end - totalVisible + 1));

    const pages = [];
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }

  changePage(modifier: number): void {
    this.filters.page += modifier;
    this.loadData();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onToggleCollection(cardId: string): void {
    this.pokemonService.toggleCollection(cardId).subscribe({
      next: (res) => {
        this.userCollection = res.userCollection || res.collection || [];
        this.cards = [...this.cards];
        this.cdr.detectChanges();
      },
      error: () => {
        this.cdr.detectChanges();
      },
    });
  }

  onToggleWishlist(cardId: string): void {
    this.pokemonService.toggleWishlist(cardId).subscribe({
      next: (res) => {
        this.userWishlist = res.userWishlist || [];
        if (this.currentSection !== 'all') this.loadData();
        else {
          this.cdr.detectChanges();
        }
      },
      error: () => {
        this.cdr.detectChanges();
      },
    });
  }

  onMoveToCollection(cardId: string): void {
    this.isLoading = true;
    this.pokemonService.moveFromWishlistToCollection(cardId).subscribe({
      next: (res) => {
        this.userCollection = res.userCollection || res.collection || [];
        this.userWishlist = res.userWishlist || [];
        if (this.currentSection !== 'all') this.loadData();
        else {
          this.isLoading = false;
          this.cdr.detectChanges();
        }
      },
      error: () => {
        this.isLoading = false;
        this.cdr.detectChanges();
      },
    });
  }

  isInCollection(cardId: string): boolean {
    return this.userCollection.includes(cardId);
  }
  isInWishlist(cardId: string): boolean {
    return this.userWishlist.includes(cardId);
  }

  goToPage(page: number): void {
    if (this.filters.page !== page) {
      this.filters.page = page;
      this.loadData();
    }
  }

  clearFilters(): void {
    this.filters = {
      name: '',
      illustratorId: '',
      setId: '',
      rarity: '',
      page: 1,
      sort: 'none',
    };
    this.currentSort = 'none';
    this.loadData();
  }
}
