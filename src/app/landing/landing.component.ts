import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent {
  features = [
    {
      icon: '📝',
      title: 'Cuestionarios Inteligentes',
      description: 'Crea y gestiona cuestionarios personalizados con preguntas de opción múltiple'
    },
    {
      icon: '📊',
      title: 'Análisis Detallado',
      description: 'Visualiza métricas y estadísticas de rendimiento en tiempo real'
    },
    {
      icon: '👥',
      title: 'Gestión de Usuarios',
      description: 'Administra usuarios, roles y permisos desde un panel centralizado'
    },
    {
      icon: '🎯',
      title: 'Resultados Instantáneos',
      description: 'Obtén retroalimentación inmediata sobre tu desempeño'
    }
  ];

  constructor(private router: Router) {}

  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  scrollToFeatures() {
    const element = document.getElementById('features');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
}