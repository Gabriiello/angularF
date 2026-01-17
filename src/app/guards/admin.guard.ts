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
export class AdminGuard implements CanActivate {

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

    // Verificar si es admin
    if (this.authService.isAdmin()) {
      return true;
    }

    // Si no es admin, redirigir a vista de usuario
    console.log('Usuario sin permisos de administrador. Redirigiendo...');
    return this.router.createUrlTree(['/vista-usuario']);
  }
}