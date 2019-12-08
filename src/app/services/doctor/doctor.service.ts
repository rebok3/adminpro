import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICES } from '../../config/config';
import { UserService } from '../user/user.service';
import { map } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { Doctor } from '../../models/doctor.model';

@Injectable({
  providedIn: 'root'
})
export class DoctorService {

  totalDoctors: number = 0;

  constructor(
    public http: HttpClient,
    public _userService: UserService
  ) { }

  loadDoctors( from: number = 0 ) {

    let url = URL_SERVICES + '/medico?desde=' + from;
    return this.http.get( url )
              .pipe(map((resp: any) => {
                this.totalDoctors = resp.total;
                return resp.medicos;
              }));

  }

  getDoctor( id: string ) {
    let url = URL_SERVICES + '/medico/' + id;
    return this.http.get( url )
             .pipe(map( (resp: any) => resp.medico ));
  }

  searchDoctors( term: string ) {
    let url = URL_SERVICES + '/busqueda/coleccion/medicos/' + term;
    return this.http.get( url )
             .pipe(map((resp: any) => resp.medicos ));
  }

  deleteDoctor( id: string ) {

    let url = URL_SERVICES + '/medico/' + id;
    url += '?token=' + this._userService.token;

    return this.http.delete( url )
              .pipe(map((resp: any) => Swal.fire('Médico Borrado', 'Eliminado correctamente', 'success')));

  }

  saveDoctor( doctor: Doctor ) {

    let url = URL_SERVICES + '/medico/';

    if ( doctor._id ) {
      // Update Doctor
      url += doctor._id + '?token=' + this._userService.token;
      return this.http.put( url, doctor )
              .pipe(map((resp: any) => {
                Swal.fire('Médico actualizado', doctor.nombre, 'success');
                return resp.medico;
              }));
    } else {
      // Create Doctor
      url += '?token=' + this._userService.token;
      return this.http.post( url, doctor )
              .pipe(map((resp: any) => {
                Swal.fire('Médico creado', doctor.nombre, 'success');
                return resp.medico;
              }));
    }
  }

}
