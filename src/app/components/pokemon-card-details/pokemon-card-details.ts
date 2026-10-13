import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-pokemon-card-details',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage],
  templateUrl: './pokemon-card-details.html',
})
export class PokemonCardDetailsComponent {
  @Input() card: any = null;
  @Input() inCollection: boolean = false;
  @Input() inWishlist: boolean = false;
  @Input() currentSection: 'all' | 'collection' | 'wishlist' = 'all';

  @Output() close = new EventEmitter<void>();
  @Output() toggleCollection = new EventEmitter<string>();
  @Output() toggleWishlist = new EventEmitter<string>();
  @Output() moveToCollection = new EventEmitter<string>();

  openCardMarket(cardId: string) {
    if (cardId) {
      window.open(
        `https://prices.pokemontcg.io/cardmarket/${cardId}`,
        '_blank',
        'noopener,noreferrer',
      );
    }
  }
}
