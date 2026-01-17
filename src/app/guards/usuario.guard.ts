import { Injectable } from '@angular/core';
import { 
  CanActivate, 
  ActivatedRouteSnapshot, 
  RouterStateSnapshot, 
  Router,
  UrlTree 
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class UsuarioGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
    // Verificar si está autenticado
    if (!this.authService.isAuthenticated()) {
      console.log('Usuario no autenticado. Redirigiendo a login...');
      return this.router.createUrlTree(['/login']);
    }

    // Verificar si es usuario normal
    if (this.authService.isUsuario()) {
      return true;
    }

    // Si es admin, redirigir a panel admin
    console.log('Usuario es admin. Redirigiendo a panel...');
    return this.router.createUrlTree(['/admin']);
  }
}