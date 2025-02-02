import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {
  usuarios: any[] = [];
  showEditModal = false;
  showAddModal = false;
  selectedUsuario: any = {};
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
    this.http.get<any[]>('https://optimistic-forgiveness-production.up.railway.app/api/usuarios')
      .subscribe(response => {
        this.usuarios = response;
      });
  }

  confirmDelete(id: number) {
    if (confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
      this.http.delete(`https://optimistic-forgiveness-production.up.railway.app/api/usuarios/${id}`)
        .subscribe(() => {
          this.loadUsuarios();
        });
    }
  }

  editUsuario(usuario: any) {
    this.selectedUsuario = { ...usuario };
    this.showEditModal = true;
  }

  closeEditModal() {
    this.showEditModal = false;
  }

  updateUsuario() {
    this.http.put(`https://optimistic-forgiveness-production.up.railway.app/usuarios/${this.selectedUsuario.id}`, this.selectedUsuario)
      .subscribe(() => {
        this.loadUsuarios();
        this.closeEditModal();
      });
  }

  addUsuario() {
    this.http.post('https://optimistic-forgiveness-production.up.railway.app/usuarios', this.newUsuario)
      .subscribe(() => {
        this.loadUsuarios();
        this.closeAddModal();
        this.resetNewUsuario();
      });
  }

  closeAddModal() {
    this.showAddModal = false;
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
