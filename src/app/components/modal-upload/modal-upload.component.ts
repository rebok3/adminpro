import { Component, OnInit } from '@angular/core';
import { UploadFileService } from '../../services/upload-file/upload-file.service';
import { ModalUploadService } from './modal-upload.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal-upload',
  templateUrl: './modal-upload.component.html',
  styles: []
})
export class ModalUploadComponent implements OnInit {

  // hide: string = '';
  imageUpload: File;
  imageTemp: string | ArrayBuffer;

  constructor(
    public _uploadFileService: UploadFileService,
    public _modalUploadService: ModalUploadService
  ) { }

  ngOnInit() {
  }

  closeModal() {
    this.imageTemp = null;
    this.imageUpload = null;

    this._modalUploadService.hideModal();
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

  uploadImage() {
    this._uploadFileService.uploadFile( this.imageUpload, this._modalUploadService.type, this._modalUploadService.id )
          .then( resp => {
            // console.log( resp );
            this._modalUploadService.notification.emit( resp );
            this.closeModal();
          })
          .catch( err => {
            console.log('Error en la carga...');
          });
  }

}
