import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICES } from '../../config/config';
import { User } from '../../models/user.model';
import { Hospital } from 'src/app/models/hospital.model';
import { Doctor } from '../../models/doctor.model';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styles: []
})
export class SearchComponent implements OnInit {

  users: User[] = [];
  hospitals: Hospital[] = [];
  doctors: Doctor[] = [];

  constructor(
    public activatedRoute: ActivatedRoute,
    public http: HttpClient
  ) {
    activatedRoute.params
      .subscribe( params => {
        let term = params['term'];
        this.search( term );
      });
   }

  ngOnInit() {
  }

  search( term: string ) {
    let url = URL_SERVICES + '/busqueda/todo/' + term;
    this.http.get( url )
      .subscribe( (resp: any) => {
        console.log( resp );
        this.hospitals = resp.hospitales;
        this.doctors = resp.medicos;
        this.users = resp.usuarios;
      });
  }

}
