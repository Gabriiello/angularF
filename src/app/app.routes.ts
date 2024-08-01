import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegistroComponent } from './registro/registro.component';
import { AdminComponent } from './admin/admin.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { MetricasComponent } from './metricas/metricas.component';
import { CuestionariosComponent } from './cuestionarios/cuestionarios.component';
import { VistaUsuarioComponent } from './vista-usuario/vista-usuario.component';
import { EmpezarCuestionarioComponent } from './empezar-cuestionario/empezar-cuestionario.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegistroComponent },
  { path: 'admin', component: AdminComponent },
  { path: 'admin/usuarios', component: UsuariosComponent },
  { path: 'admin/metricas', component: MetricasComponent },
  { path: 'admin/cuestionarios', component: CuestionariosComponent },
  { path: 'vista-usuario', component: VistaUsuarioComponent },
  { path: 'empezar-cuestionario/:id', component: EmpezarCuestionarioComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];