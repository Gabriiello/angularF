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
export class LoginGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
    // Si YA está autenticado, redirigir según el rol
    if (this.authService.isAuthenticated()) {
      console.log('⚠️ Usuario ya autenticado, redirigiendo...');
      
      const user = this.authService.getUser();
      
      if (user?.rol === 'ADMIN') {
        return this.router.createUrlTree(['/admin']);
      } else if (user?.rol === 'USUARIO') {
        return this.router.createUrlTree(['/vista-usuario']);
      }
      
      return this.router.createUrlTree(['/']);
    }

    // Si NO está autenticado, permitir acceso al login
    console.log('✅ Usuario no autenticado, permitiendo acceso a login');
    return true;
  }
}