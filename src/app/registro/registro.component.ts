import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService, RegisterRequest } from '../auth.service';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent {
  userData: RegisterRequest = {
    nombre: '',
    email: '',
    password: '',  // ← Cambiado
    rol: 'USUARIO'
  };

  confirmarPassword: string = '';  // ← Cambiado
  errorMessage: string = '';
  successMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    if (this.authService.isAuthenticated()) {
      if (this.authService.isAdmin()) {
        this.router.navigate(['/admin']);
      } else {
        this.router.navigate(['/vista-usuario']);
      }
    }
  }

  onSubmit(): void {
    console.log('🔵 onSubmit registro llamado');

    if (!this.userData.nombre || !this.userData.email || !this.userData.password) {
      this.errorMessage = 'Por favor completa todos los campos';
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.userData.email)) {
      this.errorMessage = 'Email inválido';
      return;
    }

    if (this.userData.password.length < 6) {
      this.errorMessage = 'Password debe tener al menos 6 caracteres';
      return;
    }

    if (this.userData.password !== this.confirmarPassword) {
      this.errorMessage = 'Los passwords no coinciden';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.register(this.userData).subscribe({
      next: (response) => {
        console.log('✅ Registro exitoso:', response);
        this.isLoading = false;
        this.successMessage = 'Registro exitoso! Redirigiendo...';
        
        setTimeout(() => {
          if (this.authService.isAdmin()) {
            this.router.navigate(['/admin']);
          } else {
            this.router.navigate(['/vista-usuario']);
          }
        }, 1000);
      },
      error: (error) => {
        console.error('❌ Error en registro:', error);
        this.isLoading = false;
        
        if (error.status === 409) {
          this.errorMessage = 'Este email ya está registrado';
        } else if (error.status === 0) {
          this.errorMessage = 'No se pudo conectar con el servidor';
        } else {
          this.errorMessage = 'Error al registrar';
        }
      }
    });
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}