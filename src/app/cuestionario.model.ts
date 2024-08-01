export interface Cuestionario {
    id: number;
    titulo: string;
    descripcion: string;
    preguntas?: Pregunta[]; // Opcional, si el cuestionario tiene preguntas
  }
  
  export interface Pregunta {
    id: number;
    texto: string;
    respuestas?: Respuesta[]; // Opcional, si la pregunta tiene respuestas
  }
  
  export interface Respuesta {
    id: number;
    texto: string;
    esCorrecta: boolean;
  }
  