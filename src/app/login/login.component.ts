import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { UserService } from '../services/service.index';
import { User } from '../models/user.model';

declare function init_plugins();
declare const gapi: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  email: string;
  rememberme: boolean = false;
  auth2: any;

  constructor( 
    public router: Router,
    public _userService: UserService
  ) { }

  ngOnInit() {
    init_plugins();
    this.googleInit();

    this.email = localStorage.getItem( 'email' ) || '';
    if ( this.email.length > 1 ) {
      this.rememberme = true;
    }
  }

  googleInit() {

    gapi.load('auth2', () => {

      this.auth2 = gapi.auth2.init({
        client_id: '1011830272236-2e0clmidg7lja3vdfsvefhju7p4rnaop.apps.googleusercontent.com',
        cookiepolicy: 'single_host_origin',
        scope: 'profile email'
      });

      this.attachSignin( document.getElementById('btnGoogle'));

    });
  }

  attachSignin( element ) {

    this.auth2.attachClickHandler( element, {}, (googleUser) => {

      // let profile = googleUser.getBasicProfile();
      let token = googleUser.getAuthResponse().id_token;
      this._userService.loginGoogle( token )
                      .subscribe( resp => this.router.navigate([ '/dashboard' ]));      
    });
  }

  ingresar( forma: NgForm ) {

    if ( forma.invalid ) {
      return;
    }

    let user = new User( null, forma.value.email, forma.value.password );
    this._userService.login( user, forma.value.rememberme )
                    .subscribe( resp => this.router.navigate([ '/dashboard' ]));
                      // .subscribe( resp => {
                      //   console.log( resp );
                      // });

    // this.router.navigate([ '/dashboard' ]);
  }

}
