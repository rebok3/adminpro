import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/service.index';
import { User } from '../../models/user.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styles: []
})
export class ProfileComponent implements OnInit {

  user: User;
  imageUpload: File;
  imageTemp: string;

  constructor( public _userService: UserService) { 
    this.user = this._userService.user;
  }

  ngOnInit() {
  }

  save( user: User ) {
    this.user.nombre = user.nombre;
    if ( !this.user.google ) {
      this.user.email = user.email;
    }

    this._userService.updateUser( this.user )
      .subscribe();
  }

  imageSelection( file: File ) {
    if (!file) {
      this.imageUpload = null;
      return;
    }

    if ( file.type.indexOf('image') < 0 ) {
      this.imageUpload = null;
      Swal.fire('Sólo imágenes', 'El archivo seleccionado no es una imagen válida', 'error');
      return;
    }

    this.imageUpload = file;

    let reader = new FileReader();
    let urlImageTemp = reader.readAsDataURL( file );

    reader.onloadend = () => this.imageTemp = reader.result;
  }

  changeImage() {
    this._userService.changeImage( this.imageUpload, this.user._id );
  }

}
