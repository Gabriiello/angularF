import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';  // Importa Router

@Component({
  selector: 'app-vista-usuario',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './vista-usuario.component.html',
  styleUrls: ['./vista-usuario.component.css']
})
export class VistaUsuarioComponent implements OnInit {
  cuestionarios: any[] = [];

  constructor(private http: HttpClient, private router: Router) { }  // Inyecta Router

  ngOnInit() {
    this.loadCuestionarios();
  }

  loadCuestionarios() {
    this.http.get<any[]>('https://optimistic-forgiveness-production.up.railway.app/api/cuestionarios').subscribe(data => {
      this.cuestionarios = data;
    });
  }

  empezarCuestionario(id: number) {
    this.router.navigate(['/empezar-cuestionario', id]);  // Redirige al usuario
  }
}
