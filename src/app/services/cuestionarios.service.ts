import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';

export interface Cuestionario {
  id?: number;
  titulo: string;
  descripcion: string;
  creadoPor?: number;
  fechaCreacion?: Date;
  Numpreguntas?: number;
}

export interface Pregunta {
  id?: number;
  texto: string;
  cuestionarioId?: number;
  respuestas?: Respuesta[];
}

export interface Respuesta {
  id?: number;
  texto: string;
  esCorrecta: boolean;
  preguntaId?: number;
}

@Injectable({
  providedIn: 'root'
})
export class CuestionariosService {
  private apiUrl = 'http://localhost:8080/api';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  /**
   * Obtener headers con token
   */
  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  // ==========================================
  // CUESTIONARIOS
  // ==========================================

  getCuestionarios(): Observable<Cuestionario[]> {
    return this.http.get<Cuestionario[]>(
      `${this.apiUrl}/cuestionarios`,
      { headers: this.getHeaders() }
    );
  }

  getCuestionarioById(id: number): Observable<Cuestionario> {
    return this.http.get<Cuestionario>(
      `${this.apiUrl}/cuestionarios/${id}`,
      { headers: this.getHeaders() }
    );
  }

  createCuestionario(cuestionario: Cuestionario): Observable<Cuestionario> {
    return this.http.post<Cuestionario>(
      `${this.apiUrl}/cuestionarios`,
      cuestionario,
      { headers: this.getHeaders() }
    );
  }

  updateCuestionario(id: number, cuestionario: Cuestionario): Observable<Cuestionario> {
    return this.http.put<Cuestionario>(
      `${this.apiUrl}/cuestionarios/${id}`,
      cuestionario,
      { headers: this.getHeaders() }
    );
  }

  deleteCuestionario(id: number): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/cuestionarios/${id}`,
      { headers: this.getHeaders() }
    );
  }

  // ==========================================
  // PREGUNTAS
  // ==========================================

  getPreguntasByCuestionario(cuestionarioId: number): Observable<Pregunta[]> {
    return this.http.get<Pregunta[]>(
      `${this.apiUrl}/preguntas/cuestionario/${cuestionarioId}`,
      { headers: this.getHeaders() }
    );
  }

  createPregunta(pregunta: Pregunta): Observable<Pregunta> {
    return this.http.post<Pregunta>(
      `${this.apiUrl}/preguntas`,
      pregunta,
      { headers: this.getHeaders() }
    );
  }

  updatePregunta(id: number, pregunta: Pregunta): Observable<Pregunta> {
    return this.http.put<Pregunta>(
      `${this.apiUrl}/preguntas/${id}`,
      pregunta,
      { headers: this.getHeaders() }
    );
  }

  deletePregunta(id: number): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/preguntas/${id}`,
      { headers: this.getHeaders() }
    );
  }

  // ==========================================
  // RESPUESTAS
  // ==========================================

  getRespuestasByPregunta(preguntaId: number): Observable<Respuesta[]> {
    return this.http.get<Respuesta[]>(
      `${this.apiUrl}/respuestas/pregunta/${preguntaId}`,
      { headers: this.getHeaders() }
    );
  }

  createRespuesta(respuesta: Respuesta): Observable<Respuesta> {
    return this.http.post<Respuesta>(
      `${this.apiUrl}/respuestas`,
      respuesta,
      { headers: this.getHeaders() }
    );
  }

  updateRespuesta(id: number, respuesta: Respuesta): Observable<Respuesta> {
    return this.http.put<Respuesta>(
      `${this.apiUrl}/respuestas/${id}`,
      respuesta,
      { headers: this.getHeaders() }
    );
  }

  deleteRespuesta(id: number): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/respuestas/${id}`,
      { headers: this.getHeaders() }
    );
  }
}