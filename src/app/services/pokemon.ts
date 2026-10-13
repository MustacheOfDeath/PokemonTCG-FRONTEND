import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable} from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PokemonService {
  private apiUrl = `${environment.apiUrl}/pokemon`;

  constructor(private http: HttpClient) {}

  private getUsername(): string {
    return localStorage.getItem('currentUser') || '';
  }

  getCards(filters: any, apiEndpoint: string): Observable<any> {
    const page = filters?.page?.toString() || '1';
    let params = new HttpParams()
      .set('page', page)
      .set('name', filters.name || '')
      .set('illustratorId', filters.illustratorId || '')
      .set('setId', filters.setId || '')
      .set('rarity', filters.rarity || '')
      .set('sort', filters.sort || 'none')
      .set('username', this.getUsername());

    return this.http.get(`${this.apiUrl}/${apiEndpoint}`, { params });
  }

  toggleCollection(cardId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/collection/toggle`, {
      cardId,
      username: this.getUsername(),
    });
  }

  toggleWishlist(cardId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/wishlist/toggle`, {
      cardId,
      username: this.getUsername(),
    });
  }

  moveFromWishlistToCollection(cardId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/move/toggle`, { cardId, username: this.getUsername() });
  }

  getMetadata(): Observable<any> {
    return this.http.get(`${this.apiUrl}/metadata`, { params: {} });
  }

  getMetadataCollection(currentSection: 'collection' | 'wishlist'): Observable<any> {
    let params = new HttpParams()
      .set('username', this.getUsername())
      .set('section', currentSection);
    return this.http.get(`${this.apiUrl}/metadata/collection`, { params });
  }

  getFullCollection(): Observable<any> {
    let params = new HttpParams().set('username', this.getUsername());

    return this.http.get(`${this.apiUrl}/collection/full`, { params });
  }
}
