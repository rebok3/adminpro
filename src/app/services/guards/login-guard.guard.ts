import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

import { UserService } from '../user/user.service';

@Injectable({
  providedIn: 'root'
})
export class LoginGuardGuard implements CanActivate {

  constructor( 
    public _userService: UserService,
    public router: Router
    ) {}

  canActivate() {
    if ( this._userService.isLogged() ) {
      console.log('Pasó el Guard');
      return true;
    } else {
      this.router.navigate(['/login']);
      console.log('Bloqueado por el Guard');
      return false;
    }
  }
}
