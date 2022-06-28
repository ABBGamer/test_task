import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {AuthorizationService} from "../services/authorization.service";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  isAuth: boolean = false

  constructor(
    private _router: Router,
    private _authService: AuthorizationService
  ) {
    this._authService.accessToken$.subscribe(accessToken => {
      this.isAuth = !!accessToken;
    })
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    if (this.isAuth) {
      return true;
    } else {
      this._router.navigate(['auth']);
      return false;
    }
  }
}
