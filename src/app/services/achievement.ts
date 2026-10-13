import { Injectable } from '@angular/core';

export interface Badge {
  id: string;
  title: string;
  description: string;
  image: string;
  category: 'quantity' | 'type' | 'rarity';
  currentProgress: number;
  target: number;
  unlocked: boolean;
  colorClass: string;
}

@Injectable({
  providedIn: 'root',
})
export class AchievementService {
  calculateBadges(cards: any[], badgesConfig: any[]): Badge[] {
    const totalCount = cards.length;

    const typeCounts: { [key: string]: number } = {};
    cards.forEach((card) => {
      if (card.types && Array.isArray(card.types)) {
        card.types.forEach((t: string) => {
          if (t) typeCounts[t] = (typeCounts[t] || 0) + 1;
        });
      }
    });

    return (badgesConfig || []).map((config) => {
      let currentProgress = 0;

      if (config.category === 'quantity') {
        currentProgress = totalCount;
      } else if (config.category === 'type' && config.conditionKey) {
        currentProgress = typeCounts[config.conditionKey] || 0;
      } else if (config.category === 'rarity' && config.conditionKey) {
        const targetRarity = config.conditionKey.toLowerCase();

        currentProgress = cards.filter((card) => {
          const rarityMatch = card.rarity && card.rarity.toLowerCase().includes(targetRarity);
          const suffixMatch = card.suffix && card.suffix.toLowerCase() === targetRarity;
          const stageMatch = card.stage && card.stage.toLowerCase() === targetRarity;
          const nameMatch = card.name && card.name.toLowerCase().endsWith(' ' + targetRarity);

          return rarityMatch || suffixMatch || stageMatch || nameMatch;
        }).length;
      }

      return {
        id: config.id,
        title: config.title,
        description: config.description,
        image: config.image,
        category: config.category,
        currentProgress: currentProgress,
        target: config.target,
        unlocked: currentProgress >= config.target,
        colorClass: config.colorClass,
      };
    });
  }
}
