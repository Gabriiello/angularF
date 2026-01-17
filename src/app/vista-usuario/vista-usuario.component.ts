import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-vista-usuario',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './vista-usuario.component.html',
  styleUrls: ['./vista-usuario.component.css']
})
export class VistaUsuarioComponent implements OnInit {
  cuestionarios: any[] = [];
  filteredCuestionarios: any[] = [];
  searchTerm: string = '';
  selectedCategory: string = '';
  sortBy: string = 'recent';

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit() {
    this.loadCuestionarios();
  }

  loadCuestionarios() {
    this.http.get<any[]>(`${environment.apiUrl}/cuestionarios`).subscribe(data => {
      this.cuestionarios = data;
      this.filteredCuestionarios = data;
    });
  }

  filterCuestionarios() {
    let filtered = [...this.cuestionarios];

    // Filter by search term
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(c => 
        c.titulo.toLowerCase().includes(term) || 
        c.descripcion.toLowerCase().includes(term)
      );
    }

    // Filter by category (basic implementation)
    if (this.selectedCategory) {
      filtered = filtered.filter(c => 
        c.titulo.toLowerCase().includes(this.selectedCategory)
      );
    }

    // Sort
    switch (this.sortBy) {
      case 'title':
        filtered.sort((a, b) => a.titulo.localeCompare(b.titulo));
        break;
      case 'popular':
        // This would require a popularity field from backend
        break;
      case 'recent':
      default:
        // This would require a date field from backend
        break;
    }

    this.filteredCuestionarios = filtered;
  }

  empezarCuestionario(id: number) {
    this.router.navigate(['/empezar-cuestionario', id]);
  }

  getCategoryIcon(titulo: string): string {
    const tituloLower = titulo.toLowerCase();
    if (tituloLower.includes('matemática') || tituloLower.includes('matemática')) return '🔢';
    if (tituloLower.includes('ciencia')) return '🔬';
    if (tituloLower.includes('historia')) return '📚';
    if (tituloLower.includes('literatura') || tituloLower.includes('lengua')) return '📖';
    if (tituloLower.includes('geografía')) return '🌍';
    if (tituloLower.includes('arte')) return '🎨';
    if (tituloLower.includes('música')) return '🎵';
    if (tituloLower.includes('deporte')) return '⚽';
    return '📝';
  }


  getEstimatedTime(cuestionario: any): number {
   
    return Math.ceil(cuestionario.Numpreguntas * 1.5); // 1.5 minutes per question
  }

  

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigate(['/']);
  }
}