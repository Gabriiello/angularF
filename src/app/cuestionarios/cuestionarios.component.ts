import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { environment } from '../../environments/environment';




@Component({
  selector: 'app-cuestionarios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cuestionarios.component.html',
  styleUrls: ['./cuestionarios.component.css']
})
export class CuestionariosComponent implements OnInit {
  cuestionarios: any[] = [];
  preguntas: any[] = [];
  respuestas: any[] = [];
  newCuestionario: any = {};
  newPregunta: any = {};
  newRespuesta: any = {};
  selectedCuestionario: any = null;
  selectedPregunta: any = null;
  showEditModal: boolean = false;
  showAddPreguntaModal: boolean = false;
  showEditPreguntaModal: boolean = false;
  showAddRespuestaModal: boolean = false;

  constructor(private http: HttpClient) { }
  

  ngOnInit() {
    this.loadCuestionarios();
  }

  loadCuestionarios() {
    this.http.get<any[]>(`${environment.apiUrl}/cuestionarios`).subscribe(data => {
      this.cuestionarios = data;
    });
  }

  addCuestionario() {
    this.http.post(`${environment.apiUrl}/cuestionarios`, this.newCuestionario).subscribe(() => {
      this.loadCuestionarios();
      this.newCuestionario = {};
    });
  }

  editCuestionario(cuestionario: any) {
    this.selectedCuestionario = { ...cuestionario };
    this.showEditModal = true;
    this.loadPreguntas(cuestionario.id);
  }

  updateCuestionario() {
    this.http.put(`${environment.apiUrl}/cuestionarios/${this.selectedCuestionario.id}`, this.selectedCuestionario).subscribe(() => {
      this.loadCuestionarios();
      this.showEditModal = false;
    });
  }

  deleteCuestionario(id: number) {
    if (confirm('¿Está seguro de que desea eliminar este cuestionario?')) {
      this.http.delete(`${environment.apiUrl}/cuestionarios/${id}`).subscribe(() => {
        this.loadCuestionarios();
      });
    }
  }

  loadPreguntas(cuestionarioId: number) {
    this.http.get<any[]>(`${environment.apiUrl}/preguntas/cuestionario/${cuestionarioId}`).subscribe(data => {
      this.preguntas = data;
    });
  }

  addPregunta() {
    if (!this.selectedCuestionario) {
      console.error('No se ha seleccionado un cuestionario');
      return;
    }
    this.newPregunta.cuestionario = this.selectedCuestionario; // Incluye el cuestionario completo
    console.log('Cuestionario completo:', this.newPregunta.cuestionario);
    this.http.post(`${environment.apiUrl}/preguntas`, this.newPregunta).subscribe(() => {
      this.loadPreguntas(this.selectedCuestionario.id);
      this.newPregunta = {};
      this.showAddPreguntaModal = false;
    });
  }
  editPregunta(pregunta: any) {
    this.selectedPregunta = { ...pregunta };
    this.showEditPreguntaModal = true;
    this.loadRespuestas(pregunta.id);
  }

  updatePregunta() {
  // Enviar solo los campos necesarios para evitar sobrescribir las respuestas
  const preguntaToUpdate = {
    id: this.selectedPregunta.id,
    texto: this.selectedPregunta.texto,
    cuestionario: this.selectedCuestionario
    // Agrega aquí otros campos que necesites actualizar (tipo, puntos, etc.)
  };
  
  this.http.put(`${environment.apiUrl}/preguntas/${this.selectedPregunta.id}`, preguntaToUpdate).subscribe(() => {
    this.loadPreguntas(this.selectedCuestionario.id);
    this.showEditPreguntaModal = false;
  });
}

  deletePregunta(id: number) {
    if (confirm('¿Está seguro de que desea eliminar esta pregunta?')) {
      this.http.delete(`${environment.apiUrl}/preguntas/${id}`).subscribe(() => {
        this.loadPreguntas(this.selectedCuestionario.id);
      });
    }
  }

  openAddRespuestaModal(pregunta: any) {
    this.selectedPregunta = pregunta;
    console.log('Pregunta seleccionada:', this.selectedPregunta);
    this.showAddRespuestaModal = true;
  }

  
  addRespuesta() {
    if (!this.selectedPregunta) {
      console.error('No se ha seleccionado una pregunta');
      return;
    }
    this.newRespuesta.pregunta = this.selectedPregunta; // Incluye la pregunta completa
    console.log('Pregunta completa:', this.newRespuesta.pregunta);
    console.log('Nueva respuesta:', this.newRespuesta); // Verifica si esCorrecta está correctamente asignado
    this.http.post(`${environment.apiUrl}/respuestas`, this.newRespuesta).subscribe(() => {
      this.loadRespuestas(this.selectedPregunta.id);
      this.newRespuesta = {};
      this.showAddRespuestaModal = false;
    });
  }

  loadRespuestas(preguntaId: number) {
    this.http.get<any[]>(`${environment.apiUrl}/respuestas/pregunta/${preguntaId}`).subscribe(data => {
      this.respuestas = data;
    });
  }

  deleteRespuesta(id: number) {
    if (confirm('¿Está seguro de que desea eliminar esta respuesta?')) {
      this.http.delete(`${environment.apiUrl}/respuestas/${id}`).subscribe(() => {
        this.loadRespuestas(this.selectedPregunta.id);
      });
    }
  }

  closeEditModal() {
    this.showEditModal = false;
  }

  closeAddPreguntaModal() {
    this.showAddPreguntaModal = false;
  }

  closeEditPreguntaModal() {
    this.showEditPreguntaModal = false;
  }

  closeAddRespuestaModal() {
    this.showAddRespuestaModal = false;
  }
}
