import { Pipe, PipeTransform } from '@angular/core';
import { URL_SERVICES } from '../config/config';

@Pipe({
  name: 'image'
})
export class ImagePipe implements PipeTransform {

  transform(img: string, type: string = 'user'): any {

    let url = URL_SERVICES + '/img';

    if (!img) {
      return url + '/usuarios/xxx';
    }

    if (img.indexOf('https') >= 0) {
      return img;
    }

    switch (type) {

      case 'user':
        url += '/usuarios/' + img;
        break;

      case 'doctor':
        url += '/medicos/' + img;
        break;

      case 'hospital':
        url += '/hospitales/' + img;
        break;

      default:
        console.log('Tipo de imagen no existe, usuario, médico u hospital');
        url += '/usuarios/xxx';
        break;
    }
    return url;
  }

}
