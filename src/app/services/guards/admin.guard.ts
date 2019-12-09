import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from '../user/user.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(
    public _userService: UserService
  ) {

  }

  canActivate() {

    if ( this._userService.user.role === 'ADMIN_ROLE' ) {
      return true;
    } else {
      console.log( 'Bloqueado por el ADMIN GUARD' );
      this._userService.logout();
      return false;
    }
  }
  
}
