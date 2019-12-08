import { Component, OnInit } from '@angular/core';
import { Doctor } from 'src/app/models/doctor.model';
import { DoctorService } from '../../services/service.index';

@Component({
  selector: 'app-doctors',
  templateUrl: './doctors.component.html',
  styles: []
})
export class DoctorsComponent implements OnInit {

  doctors: Doctor[] = [];
  from: number = 0;

  totalDoctors: number = 0;
  loading: boolean = true;

  constructor(
    public _doctorService: DoctorService
  ) { }

  ngOnInit() {
    this.loadDoctors();
  }

  loadDoctors() {

    this.loading = true;

    this._doctorService.loadDoctors( this.from )
            .subscribe( doctors => {
              this.totalDoctors = this._doctorService.totalDoctors;
              this.doctors = doctors;
              this.loading = false;
            });

  }

  changeFrom( value: number ) {

    let from = this.from + value;
    console.log( from );

    if ( from >= this.totalDoctors ) {
      return;
    }

    if ( from < 0 ) {
      return;
    }

    this.from += value;
    this.loadDoctors();
  }

  searchDoctors( term: string ) {

    if ( term.length <= 0 ) {
      this.loadDoctors();
      return;
    }

    this.loading = true;

    this._doctorService.searchDoctors( term )
          .subscribe( ( doctors ) => {
            this.doctors = doctors;
            this.loading = false;
          });
  }

  deleteDoctor( doctor: Doctor ) {
    this._doctorService.deleteDoctor( doctor._id )
            .subscribe( () => this.loadDoctors());
  }

}
