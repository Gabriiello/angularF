import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router'; // Importa Router
import { FormsModule } from '@angular/forms'; // Asegúrate de importar FormsModule
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [FormsModule], // Incluye FormsModule aquí
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent {
  constructor(private http: HttpClient, private router: Router) {} // Inyecta Router

  onSubmit(registroForm: any) {
    if (registroForm.valid) {
      const nuevoUsuario = {
        nombre: registroForm.value['nombre'],
        email: registroForm.value.email,
        contraseña: registroForm.value.password,
        rol: 'USUARIO'
      };

      this.http.post(`${environment.apiUrl}/auth/register`, nuevoUsuario).subscribe(response => {
        alert('Usuario registrado con éxito.');
        this.router.navigate(['/login']); // Redirige al login
      }, error => {
        alert('usuario guardado');
      });
    } else {
      alert('Por favor, complete todos los campos requeridos.');
    }
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }
}
