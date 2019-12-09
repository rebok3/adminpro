import { Injectable } from '@angular/core';
import { User } from '../../models/user.model';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICES } from '../../config/config';

import { map } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { UploadFileService } from '../upload-file/upload-file.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  user: User;
  token: string;
  menu: any[] = [];

  constructor(
    public http: HttpClient,
    public router: Router,
    public _uploadFileServices: UploadFileService
  ) {
    this.loadStorage();
   }


   isLogged() {
    return ( this.token.length > 5 ) ? true : false;
   }

   loadStorage() {
    if ( localStorage.getItem('token') ) {
      this.token = localStorage.getItem('token');
      this.user = JSON.parse(localStorage.getItem('user'));
      this.menu = JSON.parse(localStorage.getItem('menu'));
    } else {
      this.token = '';
      this.user = null;
      this.menu = [];
    }
   }

   saveStorage( id: string, token: string, user: User, menu: any ) {

    localStorage.setItem( 'id', id );
    localStorage.setItem( 'token', token );
    localStorage.setItem( 'user', JSON.stringify(user) );
    localStorage.setItem( 'menu', JSON.stringify(menu) );

    this.user = user;
    this.token = token;
    this.menu = menu;

   }

   logout() {
     this.user = null;
     this.token = '';
     this.menu = [];

     localStorage.removeItem('token');
     localStorage.removeItem('user');
     localStorage.removeItem('menu');

     this.router.navigate(['/login']);
   }

   loginGoogle( token: string ){

    let url = URL_SERVICES + '/login/google';
    return this.http.post( url, { token } )
            .pipe(map((resp: any) => {
              this.saveStorage( resp.id, resp.token, resp.usuario, resp.menu );
              return true;
            }));
   }

   login( user: User, remember: boolean = false ) {

    if ( remember ) {
      localStorage.setItem( 'email', user.email );
    }
    else {
      localStorage.removeItem( 'email' );
    }

    let url = URL_SERVICES + '/login';
    return this.http.post( url, user )
            .pipe(
              map((resp: any) => {
                // localStorage.setItem( 'id', resp.id );
                // localStorage.setItem( 'token', resp.token );
                // localStorage.setItem( 'user', JSON.stringify(resp.usuario) );
                this.saveStorage( resp.id, resp.token, resp.usuario, resp.menu );
                return true;
              }),
              catchError( err => {
                // console.log( err.error.mensaje );
                Swal.fire('Error en el login', err.error.mensaje, 'error');
                return throwError( err );
              })
            );
  }

   createUser( user: User ) {

    let url = URL_SERVICES + '/usuario';

    return this.http.post( url, user )
            .pipe(
              map((resp: any) => {
                Swal.fire('Usuario creado', user.email, 'success');
                return resp.user;
              }),
              catchError( err => {
                Swal.fire(err.error.mensaje, err.error.errors.message, 'error');
                return throwError( err );
              })
            );

   }

   updateUser( user: User ) {

    let url = URL_SERVICES + '/usuario/' + user._id;
    url += '?token=' + this.token;

    return this.http.put( url, user )
            .pipe(
              map((resp: any) => {
                if ( user._id === this.user._id ) {
                  let userDB: User = resp.usuario;
                  this.saveStorage( userDB._id, this.token, userDB, this.menu );
                }
                Swal.fire('Usuario actualizado', user.email, 'success');
                return true;
              }),
              catchError( err => {
                Swal.fire(err.error.mensaje, err.error.errors.message, 'error');
                return throwError( err );
              })
            );

   }

   changeImage( file: File, id: string ) {
    this._uploadFileServices.uploadFile( file, 'usuarios', id )
          .then( (resp: any) => {
            this.user.img = resp.usuario.img;
            this.saveStorage( id, this.token, this.user, this.menu );
            Swal.fire('Imagen actualizada', this.user.nombre, 'success');
          })
          .catch( resp => {
            console.log( resp );
          });
   }

   loadUsers( from: number = 0 ) {

      let url = URL_SERVICES + '/usuario?desde=' + from;
      return this.http.get( url );

   }

   searchUsers( term: string ) {
     let url = URL_SERVICES + '/busqueda/coleccion/usuarios/' + term;
     return this.http.get( url )
              .pipe(map((resp: any) => resp.usuarios ));
   }

   deleteUser( id: string ) {

     let url = URL_SERVICES + '/usuario/' + id;
     url += '?token=' + this.token;

     return this.http.delete( url );

   }

}
