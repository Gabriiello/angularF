import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router'; // Importa Router
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  constructor(private http: HttpClient, private router: Router) {} // Inyecta Router

  onSubmit(loginForm: any) {
    if (loginForm.valid) {
      const usuario = {
        email: loginForm.value.mail,
        contraseña: loginForm.value.password
      };

      this.http.post<any>('https://optimistic-forgiveness-production.up.railway.app/api/auth/login', usuario).subscribe(response => {
        // Suponiendo que el servidor devuelve el rol en la respuesta
        const rol = response.rol; // Ajusta esto según cómo recibas el rol

        if (rol === 'ADMIN') {
          alert('Usuario autenticado como ADMIN.');
          this.router.navigate(['/admin']); // Redirige a la ruta de admin
        } else if (rol === 'USUARIO') {
          alert('Usuario autenticado como USUARIO.');
          this.router.navigate(['/vista-usuario']); // Redirige a la ruta de usuario
        } else {
          alert('Rol desconocido: ' + rol);
          // Maneja el caso de rol desconocido si es necesario
        }
      }, error => {
        alert('Error al autenticar usuario: ' + error.message);
        // Maneja el error, muestra un mensaje de error
      });
    } else {
      alert('Formulario inválido. Por favor, completa todos los campos.');
    }
  }

  goToRegistro() {
    this.router.navigate(['/registro']); // Redirige a la ruta de registro
  }
}
