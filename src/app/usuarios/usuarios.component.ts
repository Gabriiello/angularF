import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {
  usuarios: any[] = [];
  filteredUsuarios: any[] = [];
  showEditModal = false;
  showAddModal = false;
  selectedUsuario: any = {};
  searchTerm: string = '';
  newUsuario: any = {
    nombre: '',
    email: '',
    contrasena: '',
    rol: 'USUARIO'
  };

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadUsuarios();
  }

  loadUsuarios() {
    this.http.get<any[]>(`${environment.apiUrl}/auth/register/usuarios`)
      .subscribe(response => {
        this.usuarios = response;
        this.filteredUsuarios = response;
      }, error => {
        console.error('Error loading users:', error);
      });
  }

  filterUsuarios() {
    if (!this.searchTerm) {
      this.filteredUsuarios = this.usuarios;
      return;
    }

    const term = this.searchTerm.toLowerCase();
    this.filteredUsuarios = this.usuarios.filter(usuario =>
      usuario.nombre.toLowerCase().includes(term) ||
      usuario.email.toLowerCase().includes(term) ||
      usuario.rol.toLowerCase().includes(term)
    );
  }

  getInitials(nombre: string): string {
    if (!nombre) return '?';
    const parts = nombre.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return nombre.substring(0, 2).toUpperCase();
  }

  getAdminCount(): number {
    return this.usuarios.filter(u => u.rol === 'ADMIN').length;
  }

  getUserCount(): number {
    return this.usuarios.filter(u => u.rol === 'USUARIO').length;
  }

  getActiveUsersCount(): number {
    // This would normally come from backend with real activity data
    return Math.floor(this.usuarios.length * 0.7);
  }

  confirmDelete(id: number) {
    if (confirm('¿Estás seguro de que quieres eliminar este usuario? Esta acción no se puede deshacer.')) {
      this.http.delete(`${environment.apiUrl}/auth/register/usuarios/${id}`)
        .subscribe(() => {
          this.loadUsuarios();
          alert('Usuario eliminado exitosamente');
        }, error => {
          console.error('Error deleting user:', error);
          alert('Error al eliminar el usuario');
        });
    }
  }

  editUsuario(usuario: any) {
    this.selectedUsuario = { ...usuario };
    this.showEditModal = true;
  }

  closeEditModal() {
    this.showEditModal = false;
    this.selectedUsuario = {};
  }

  updateUsuario() {
    this.http.put(`${environment.apiUrl}/usuarios/${this.selectedUsuario.id}`, this.selectedUsuario)
      .subscribe(() => {
        this.loadUsuarios();
        this.closeEditModal();
        alert('Usuario actualizado exitosamente');
      }, error => {
        console.error('Error updating user:', error);
        alert('Error al actualizar el usuario');
      });
  }

  addUsuario() {
    this.http.post(`${environment.apiUrl}/usuarios`, this.newUsuario)
      .subscribe(() => {
        this.loadUsuarios();
        this.closeAddModal();
        this.resetNewUsuario();
        alert('Usuario creado exitosamente');
      }, error => {
        console.error('Error creating user:', error);
        alert('Error al crear el usuario');
      });
  }

  closeAddModal() {
    this.showAddModal = false;
    this.resetNewUsuario();
  }

  resetNewUsuario() {
    this.newUsuario = {
      nombre: '',
      email: '',
      contrasena: '',
      rol: 'USUARIO'
    };
  }
}