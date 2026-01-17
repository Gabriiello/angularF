import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/admin.guard';
import { UsuarioGuard } from './guards/usuario.guard';

// Importar componentes
import { LandingComponent } from './landing/landing.component';
import { LoginComponent } from './login/login.component';
import { RegistroComponent } from './registro/registro.component';
import { AdminComponent } from './admin/admin.component';
import { VistaUsuarioComponent } from './vista-usuario/vista-usuario.component';
import { CuestionariosComponent } from './cuestionarios/cuestionarios.component';
import { EmpezarCuestionarioComponent } from './empezar-cuestionario/empezar-cuestionario.component';
import { UsuariosComponent } from './usuarios/usuarios.component';

export const routes: Routes = [
  // ============================================
  // RUTAS PÚBLICAS (sin autenticación)
  // ============================================
  {
    path: '',
    component: LandingComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'registro',
    component: RegistroComponent
  },

  // ============================================
  // RUTAS PROTEGIDAS - SOLO ADMIN
  // ============================================
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [AdminGuard]
  },
  {
    path: 'cuestionarios',
    component: CuestionariosComponent,
    canActivate: [AdminGuard]
  },
  {
    path: 'usuarios',
    component: UsuariosComponent,
    canActivate: [AdminGuard]
  },

  // ============================================
  // RUTAS PROTEGIDAS - SOLO USUARIO
  // ============================================
  {
    path: 'vista-usuario',
    component: VistaUsuarioComponent,
    canActivate: [UsuarioGuard]
  },
  {
    path: 'empezar-cuestionario/:id',
    component: EmpezarCuestionarioComponent,
    canActivate: [UsuarioGuard]
  },

  // ============================================
  // RUTAS PROTEGIDAS - CUALQUIER USUARIO AUTENTICADO
  // ============================================
  // Si tienes rutas que ambos roles pueden acceder, usa solo AuthGuard
  // {
  //   path: 'perfil',
  //   component: PerfilComponent,
  //   canActivate: [AuthGuard]
  // },

  // ============================================
  // REDIRECCIONES
  // ============================================
  {
    path: '**',
    redirectTo: ''
  }
];