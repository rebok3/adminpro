import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from '../user/user.service';

@Injectable({
  providedIn: 'root'
})
export class CheckTokenGuard implements CanActivate {

  constructor(
    public _userService: UserService,
    public router: Router
  ) {}

  canActivate(): Promise<boolean> | boolean {
    console.log('CheckTokenGuard');
    let token = this._userService.token;
    let payload = JSON.parse(atob( token.split('.')[1] ));
    let expired = this.expired( payload.exp );

    if ( expired ) {
      this.router.navigate(['/login']);
      return false;
    }

    return this.checkRenew( payload.exp );
  }

  checkRenew( dateExp: number ): Promise<boolean> {
    return new Promise( (resolve, reject) => {
      let tokenExp = new Date( dateExp * 1000 );
      let now = new Date();

      now.setTime( now.getTime() + ( 4 * 60 * 60 * 1000 ));
      // console.log(tokenExp);
      // console.log(now);

      if ( tokenExp.getTime() > now.getTime() ) {
        resolve( true );
      } else {
        this._userService.renewToken()
              .subscribe( () => {
                resolve( true );
              }, () => {
                this.router.navigate(['/login']);
                reject( false );
              });
      }

      resolve( true );
    });
  }

  expired( dateExp: number ) {
    let now = new Date().getTime() / 1000;
    if ( dateExp < now ) {
      return true;
    } else {
      return false;
    }
  }

}
