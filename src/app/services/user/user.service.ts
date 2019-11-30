import { Injectable } from '@angular/core';
import { User } from '../../models/user.model';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICES } from '../../config/config';

import { map } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { UploadFileService } from '../upload-file/upload-file.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  user: User;
  token: string;

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
    } else {
      this.token = '';
      this.user = null;
    }
   }

   saveStorage( id: string, token: string, user: User ) {

    localStorage.setItem( 'id', id );
    localStorage.setItem( 'token', token );
    localStorage.setItem( 'user', JSON.stringify(user) );

    this.user = user;
    this.token = token;

   }

   logout() {
     this.user = null;
     this.token = '';

     localStorage.removeItem('token');
     localStorage.removeItem('user');

     this.router.navigate(['/login']);
   }

   loginGoogle( token: string ){

    let url = URL_SERVICES + '/login/google';
    return this.http.post( url, { token } )
            .pipe(map((resp: any) => {
              this.saveStorage( resp.id, resp.token, resp.usuario );
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
            .pipe(map((resp: any) => {
              // localStorage.setItem( 'id', resp.id );
              // localStorage.setItem( 'token', resp.token );
              // localStorage.setItem( 'user', JSON.stringify(resp.usuario) );
              this.saveStorage( resp.id, resp.token, resp.usuario );
              return true;
            }));
  }

   createUser( user: User ) {

    let url = URL_SERVICES + '/usuario';

    return this.http.post( url, user )
            .pipe(map((resp: any) => {
              Swal.fire('Usuario creado', user.email, 'success');
              return resp.user;
            }));

   }

   updateUser( user: User ) {

    let url = URL_SERVICES + '/usuario/' + user._id;
    url += '?token=' + this.token;

    return this.http.put( url, user )
            .pipe(map((resp: any) => {
              let userDB: User = resp.usuario;
              this.saveStorage( userDB._id, this.token, userDB );
              Swal.fire('Usuario actualizado', user.email, 'success');
              return true;
            }));

   }

   changeImage( file: File, id: string ) {
    this._uploadFileServices.uploadFile( file, 'usuarios', id )
          .then( (resp: any) => {
            this.user.img = resp.usuario.img;
            this.saveStorage( id, this.token, this.user );
            Swal.fire('Imagen actualizada', this.user.nombre, 'success');
          })
          .catch( resp => {
            console.log( resp );
          });
   }

}
