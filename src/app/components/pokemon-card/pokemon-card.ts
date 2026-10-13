import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-pokemon-card',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage],
  templateUrl: './pokemon-card.html',
})
export class PokemonCardComponent implements OnChanges {
  @Input() card: any;
  @Input() currentSection: string = 'all';
  @Input() inCollection: boolean = false;
  @Input() inWishlist: boolean = false;

  @Output() toggleCollection = new EventEmitter<string>();
  @Output() toggleWishlist = new EventEmitter<string>();
  @Output() moveToCollection = new EventEmitter<string>();
  @Output() openDetails = new EventEmitter<any>();

  ngOnChanges(changes: SimpleChanges): void {}

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
