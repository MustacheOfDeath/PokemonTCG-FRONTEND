import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class NavigationService {
  public pendingSection: 'all' | 'collection' | 'wishlist' | null = null;
}
