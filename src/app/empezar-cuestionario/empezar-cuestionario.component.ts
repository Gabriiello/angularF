import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-empezar-cuestionario',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './empezar-cuestionario.component.html',
  styleUrls: ['./empezar-cuestionario.component.css']
})
export class EmpezarCuestionarioComponent implements OnInit {
  cuestionarioId!: number;
  cuestionario: any;
  currentPreguntaIndex: number = 0;
  respuestasSeleccionadas: Map<number, number> = new Map();
  respuestasCorrectas: Map<number, number> = new Map();
  usuarioId: number = 1;  // Suponiendo un usuario de ejemplo, ajusta según el contexto

  constructor(private route: ActivatedRoute, private http: HttpClient) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.cuestionarioId = +params.get('id')!;
      this.loadCuestionario();
    });
  }

  loadCuestionario() {
    this.http.get<any>(`http://localhost:8080/api/cuestionarios/${this.cuestionarioId}`).subscribe(data => {
      this.cuestionario = data;
      this.cuestionario.preguntas.forEach((pregunta: any) => {
        pregunta.respuestas.forEach((respuesta: any) => {
          if (respuesta.esCorrecta) {
            this.respuestasCorrectas.set(pregunta.id, respuesta.id);
          }
        });
      });
    });
  }

  selectRespuesta(preguntaId: number, respuestaId: number) {
    this.respuestasSeleccionadas.set(preguntaId, respuestaId);
  }

  prevPregunta() {
    if (this.currentPreguntaIndex > 0) {
      this.currentPreguntaIndex--;
    }
  }

  nextPregunta() {
    if (this.currentPreguntaIndex < (this.cuestionario?.preguntas?.length || 0) - 1) {
      this.currentPreguntaIndex++;
    }
  }

  submitCuestionario() {
    let respuestasCorrectas = 0;
    const respuestas: any[] = [];

    this.respuestasSeleccionadas.forEach((respuestaId, preguntaId) => {
      if (this.respuestasCorrectas.get(preguntaId) === respuestaId) {
        respuestasCorrectas++;
      }
      respuestas.push({
        usuarioId: this.usuarioId,
        preguntaId: preguntaId,
        respuestaId: respuestaId
      });
    });

    alert(`Número de respuestas correctas: ${respuestasCorrectas}`);

    this.http.post('http://localhost:8080/api/respuestasU', respuestas).subscribe(response => {
      console.log('Respuestas guardadas con éxito', response);
    }, error => {
      console.error('Error al guardar las respuestas', error);
    });
  }

  get currentPregunta() {
    return this.cuestionario?.preguntas[this.currentPreguntaIndex];
  }

  isRespuestaSeleccionada(preguntaId: number, respuestaId: number): boolean {
    return this.respuestasSeleccionadas.get(preguntaId) === respuestaId;
  }
}
