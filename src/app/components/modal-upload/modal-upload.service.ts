import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ModalUploadService {

  public type: string;
  public id: string;

  public hide: string = 'hide';

  public notification = new EventEmitter<any>();
  constructor() {
    console.log('Modal Upload listo');
  }

  hideModal() {
    this.hide = 'hide';
    this.type = null;
    this.id = null;
  }

  showModal( type: string, id: string ) {
    this.hide = '';
    this.id = id;
    this.type = type;
  }
}
