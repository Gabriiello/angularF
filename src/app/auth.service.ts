import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://optimistic-forgiveness-production.up.railway.app/api/auth'; // Cambia la URL si es necesario

  constructor(private http: HttpClient) {}

  // Método para registrar un nuevo usuario
  register(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user);
  }

  // Método para iniciar sesión
  login(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, user);
  }
}