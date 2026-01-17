import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { environment } from '../../environments/environment';
import { AuthService } from '../auth.service'; // ← Importar AuthService

@Component({
  selector: 'app-empezar-cuestionario',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './empezar-cuestionario.component.html',
  styleUrls: ['./empezar-cuestionario.component.css']
})
export class EmpezarCuestionarioComponent implements OnInit, OnDestroy {
  cuestionarioId!: number;
  cuestionario: any;
  currentPreguntaIndex: number = 0;
  respuestasSeleccionadas: Map<number, number> = new Map();
  respuestasCorrectas: Map<number, number> = new Map();
  usuarioId: number | null = null; // ← Cambiado de 1 a null
  
  // Timer
  timeElapsed: number = 0;
  timerInterval: any;
  
  // Results
  showResults: boolean = false;
  score: number = 0;
  correctAnswers: number = 0;
  incorrectAnswers: number = 0;
  totalQuestions: number = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private authService: AuthService // ← Inyectar AuthService
  ) { }

  ngOnInit() {
    // ← Obtener el ID del usuario autenticado
    this.usuarioId = this.authService.getCurrentUserId();
    
    // ← Validar que el usuario esté autenticado
    if (!this.usuarioId) {
      console.error('No hay usuario autenticado');
      this.router.navigate(['/login']);
      return;
    }

    this.route.paramMap.subscribe(params => {
      this.cuestionarioId = +params.get('id')!;
      this.loadCuestionario();
      this.startTimer();
    });
  }

  ngOnDestroy() {
    this.stopTimer();
  }

  loadCuestionario() {
    this.http.get<any>(`${environment.apiUrl}/cuestionarios/${this.cuestionarioId}`).subscribe(data => {
      this.cuestionario = data;
      this.totalQuestions = data.preguntas?.length || 0;
      
      // Store correct answers
      this.cuestionario.preguntas.forEach((pregunta: any) => {
        pregunta.respuestas.forEach((respuesta: any) => {
          if (respuesta.esCorrecta) {
            this.respuestasCorrectas.set(pregunta.id, respuesta.id);
          }
        });
      });
    });
  }

  startTimer() {
    this.timerInterval = setInterval(() => {
      this.timeElapsed++;
    }, 1000);
  }

  stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }

  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  }

  selectRespuesta(preguntaId: number, respuestaId: number) {
    this.respuestasSeleccionadas.set(preguntaId, respuestaId);
  }

  isRespuestaSeleccionada(preguntaId: number, respuestaId: number): boolean {
    return this.respuestasSeleccionadas.get(preguntaId) === respuestaId;
  }

  prevPregunta() {
    if (this.currentPreguntaIndex > 0) {
      this.currentPreguntaIndex--;
      this.scrollToTop();
    }
  }

  nextPregunta() {
    if (this.currentPreguntaIndex < (this.cuestionario?.preguntas?.length || 0) - 1) {
      this.currentPreguntaIndex++;
      this.scrollToTop();
    }
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  submitCuestionario() {
    // ← Validar que haya un usuario autenticado antes de enviar
    if (!this.usuarioId) {
      console.error('No se puede enviar el cuestionario sin un usuario autenticado');
      this.router.navigate(['/login']);
      return;
    }

    this.stopTimer();
    
    this.correctAnswers = 0;
    const respuestas: any[] = [];

    this.respuestasSeleccionadas.forEach((respuestaId, preguntaId) => {
      if (this.respuestasCorrectas.get(preguntaId) === respuestaId) {
        this.correctAnswers++;
      }
      respuestas.push({
        usuarioId: this.usuarioId, // ← Ahora usa el ID real del usuario
        preguntaId: preguntaId,
        respuestaId: respuestaId
      });
    });

    this.incorrectAnswers = this.totalQuestions - this.correctAnswers;
    this.score = Math.round((this.correctAnswers / this.totalQuestions) * 100);
    this.showResults = true;

    // Save to backend
    this.http.post(`${environment.apiUrl}/respuestasU`, respuestas).subscribe(
      response => {
        console.log('Respuestas guardadas con éxito', response);
      },
      error => {
        console.error('Error al guardar las respuestas', error);
      }
    );
  }

  get currentPregunta() {
    return this.cuestionario?.preguntas[this.currentPreguntaIndex];
  }

  get progressPercentage(): number {
    if (!this.cuestionario?.preguntas?.length) return 0;
    return Math.round(((this.currentPreguntaIndex + 1) / this.cuestionario.preguntas.length) * 100);
  }

  getAnswerLetter(index: number): string {
    return String.fromCharCode(65 + index); // A, B, C, D...
  }

  getResultIcon(): string {
    if (this.score >= 90) return '🏆';
    if (this.score >= 70) return '🎉';
    if (this.score >= 50) return '👍';
    return '💪';
  }

  getResultTitle(): string {
    if (this.score >= 90) return '¡Excelente!';
    if (this.score >= 70) return '¡Muy Bien!';
    if (this.score >= 50) return '¡Buen Trabajo!';
    return '¡Sigue Intentando!';
  }

  getResultMessage(): string {
    if (this.score >= 90) return 'Has demostrado un dominio excepcional del tema. ¡Felicitaciones!';
    if (this.score >= 70) return 'Tienes un buen entendimiento del tema. ¡Sigue así!';
    if (this.score >= 50) return 'Vas por buen camino. Con un poco más de práctica mejorarás.';
    return 'No te desanimes. La práctica hace al maestro. ¡Inténtalo de nuevo!';
  }

  goToHome() {
    this.router.navigate(['/vista-usuario']);
  }

  retryQuiz() {
    this.showResults = false;
    this.currentPreguntaIndex = 0;
    this.respuestasSeleccionadas.clear();
    this.timeElapsed = 0;
    this.startTimer();
    this.scrollToTop();
  }
}