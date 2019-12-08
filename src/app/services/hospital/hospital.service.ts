import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICES } from '../../config/config';
import { map } from 'rxjs/operators';
import { UserService } from '../user/user.service';
import { Hospital } from '../../models/hospital.model';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class HospitalService {

  totalHospitals: number = 0;

  constructor(
    public http: HttpClient,
    public _userService: UserService
  ) { }

  loadHospitals( from: number = 0 ) {

    let url = URL_SERVICES + '/hospital?desde=' + from;
    return this.http.get( url )
              .pipe(map((resp: any) => {
                this.totalHospitals = resp.total;
                return resp.hospitales;
              }));

 }

 getHospital( id: string ) {
   let url = URL_SERVICES + '/hospital/' + id;
   return this.http.get( url )
            .pipe(map( (resp: any) => resp.hospital ));
 }

 deleteHospital( id: string ) {

  let url = URL_SERVICES + '/hospital/' + id;
  url += '?token=' + this._userService.token;

  return this.http.delete( url )
            .pipe(map((resp: any) => Swal.fire('Hospital Borrado', 'Eliminado correctamente', 'success')));

 }

createHospital( nombre: string ) {

  let url = URL_SERVICES + '/hospital';
  url += '?token=' + this._userService.token;

  return this.http.post( url, { nombre } )
          .pipe(map((resp: any) => {
            Swal.fire('Hospital creado', nombre, 'success');
            return resp.hospital;
          }));

}

searchHospitals( term: string ) {
  let url = URL_SERVICES + '/busqueda/coleccion/hospitales/' + term;
  return this.http.get( url )
           .pipe(map((resp: any) => resp.hospitales ));
}

updateHospital( hospital: Hospital ) {

  let url = URL_SERVICES + '/hospital/' + hospital._id;
  url += '?token=' + this._userService.token;

  return this.http.put( url, hospital )
          .pipe(map((resp: any) => {
            Swal.fire('Hospital actualizado', hospital.nombre, 'success');
            return resp.hospital;
          }));

}

}
