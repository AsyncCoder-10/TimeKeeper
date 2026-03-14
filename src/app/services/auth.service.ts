import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

declare var google: any;

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userSubject = new BehaviorSubject<string | null>(localStorage.getItem('tt_user'));

  constructor(private ngZone: NgZone) {}

  getCurrentUser(): Observable<string | null> {
    return this.userSubject.asObservable();
  }

  get currentUserName(): string | null {
    return this.userSubject.value;
  }

  /**
   * Initialize Google Identity Services
   */
  initializeGoogleLogin(clientId: string): void {
    if (typeof google !== 'undefined') {
      google.accounts.id.initialize({
        client_id: clientId,
        callback: (response: any) => {
          this.ngZone.run(() => {
            const user = this.decodeToken(response.credential);
            if (user && user.name) {
              this.login(user.name);
            }
          });
        }
      });
    }
  }

  private decodeToken(token: string): any {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload);
    } catch (e) {
      console.error('Failed to decode JWT token', e);
      return null;
    }
  }

  login(name: string): void {
    const cleanName = name.trim();
    if (cleanName) {
      localStorage.setItem('tt_user', cleanName);
      this.userSubject.next(cleanName);
    }
  }

  logout(): void {
    localStorage.removeItem('tt_user');
    this.userSubject.next(null);
  }

  isLoggedIn(): boolean {
    return !!this.userSubject.value;
  }
}
