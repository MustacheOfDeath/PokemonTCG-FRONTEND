import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface AdminUser {
  id: number;
  username: string;
  email: string;
  collectionSize: number;
  wishlistSize: number;
}

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private apiUrl = `${environment.apiUrl}/admin`;

  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<AdminUser[]> {
    return this.http.get<AdminUser[]>(`${this.apiUrl}/users`);
  }

  changePassword(username: string, newPassword: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/users/${username}/change-password`, { newPassword });
  }

  changeEmail(username: string, newEmail: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/users/${username}/change-email`, { newEmail });
  }

  clearCollection(username: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/users/${username}/collection`);
  }

  clearWishlist(username: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/users/${username}/wishlist`);
  }

  deleteAccount(username: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/users/${username}`);
  }

  loadData(): Observable<any> {
    return this.http.post(`${this.apiUrl}/import`, {}, { responseType: 'text' });
  }
}
