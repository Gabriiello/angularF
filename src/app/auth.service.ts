import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

// Interfaces
export interface Usuario {
  id: number;
  nombre: string;
  email: string;
  rol: 'ADMIN' | 'USUARIO';
}

export interface LoginRequest {
  email: string;
  password: string;  // ← Cambiado de contraseña a password
}

export interface LoginResponse {
  id: number;
  nombre: string;
  email: string;
  rol: 'ADMIN' | 'USUARIO';
  token: string;
}

export interface RegisterRequest {
  nombre: string;
  email: string;
  password: string;  // ← Cambiado de contraseña a password
  rol?: 'ADMIN' | 'USUARIO';
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080';
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'current_user';

  private currentUserSubject = new BehaviorSubject<Usuario | null>(this.getUserFromStorage());
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  private isLocalStorageAvailable(): boolean {
    try {
      return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
    } catch {
      return false;
    }
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/login`, credentials)
      .pipe(
        tap(response => {
          if (response && response.token) {
            this.setToken(response.token);
            this.setUser({
              id: response.id,
              nombre: response.nombre,
              email: response.email,
              rol: response.rol
            });
            this.currentUserSubject.next(this.getUser());
          }
        }),
        catchError(error => {
          console.error('Error en login:', error);
          return throwError(() => error);
        })
      );
  }

  register(data: RegisterRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/register`, data)
      .pipe(
        tap(response => {
          if (response && response.token) {
            this.setToken(response.token);
            this.setUser({
              id: response.id,
              nombre: response.nombre,
              email: response.email,
              rol: response.rol
            });
            this.currentUserSubject.next(this.getUser());
          }
        }),
        catchError(error => {
          console.error('Error en registro:', error);
          return throwError(() => error);
        })
      );
  }

  logout(): void {
    if (this.isLocalStorageAvailable()) {
      localStorage.removeItem(this.TOKEN_KEY);
      localStorage.removeItem(this.USER_KEY);
    }
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    if (!this.isLocalStorageAvailable()) {
      return null;
    }
    return localStorage.getItem(this.TOKEN_KEY);
  }

  private setToken(token: string): void {
    if (this.isLocalStorageAvailable()) {
      localStorage.setItem(this.TOKEN_KEY, token);
    }
  }

  getUser(): Usuario | null {
    if (!this.isLocalStorageAvailable()) {
      return null;
    }
    
    const userStr = localStorage.getItem(this.USER_KEY);
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (e) {
        return null;
      }
    }
    return null;
  }

  private getUserFromStorage(): Usuario | null {
    if (!this.isLocalStorageAvailable()) {
      return null;
    }
    
    const userStr = localStorage.getItem(this.USER_KEY);
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (e) {
        return null;
      }
    }
    return null;
  }

  private setUser(user: Usuario): void {
    if (this.isLocalStorageAvailable()) {
      localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    }
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) {
      return false;
    }

    try {
      const payload = this.decodeToken(token);
      if (!payload || !payload.exp) {
        return false;
      }
      const expiration = payload.exp * 1000;
      return Date.now() < expiration;
    } catch (e) {
      return false;
    }
  }

  isAdmin(): boolean {
    const user = this.getUser();
    return user?.rol === 'ADMIN';
  }

  isUsuario(): boolean {
    const user = this.getUser();
    return user?.rol === 'USUARIO';
  }

  private decodeToken(token: string): any {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (e) {
      return null;
    }
  }

  getCurrentUserId(): number | null {
    const user = this.getUser();
    return user?.id || null;
  }

  getCurrentUserName(): string {
    const user = this.getUser();
    return user?.nombre || 'Usuario';
  }

  getCurrentUserRole(): string {
    const user = this.getUser();
    return user?.rol || 'USUARIO';
  }

  getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }
}