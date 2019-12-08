import { Component, OnInit } from '@angular/core';
import { Hospital } from '../../models/hospital.model';
import { HospitalService } from '../../services/service.index';
import Swal from 'sweetalert2';
import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';

@Component({
  selector: 'app-hospitals',
  templateUrl: './hospitals.component.html',
  styles: []
})
export class HospitalsComponent implements OnInit {

  hospitals: Hospital[] = [];
  from: number = 0;

  totalHospitals: number = 0;
  loading: boolean = true;

  constructor(
    public _hospitalService: HospitalService,
    public _modalUploadService: ModalUploadService
  ) { }

  ngOnInit() {
    this.loadHospitals();
    this._modalUploadService.notification
          .subscribe( () => this.loadHospitals());
  }

  loadHospitals() {

    this.loading = true;

    this._hospitalService.loadHospitals( this.from )
            .subscribe( hospitals => {
              this.totalHospitals = this._hospitalService.totalHospitals;
              this.hospitals = hospitals;
              this.loading = false;
            });

  }

  changeFrom( value: number ) {

    let from = this.from + value;
    console.log( from );

    if ( from >= this.totalHospitals ) {
      return;
    }

    if ( from < 0 ) {
      return;
    }

    this.from += value;
    this.loadHospitals();
  }

  searchHospitals( term: string ) {

    if ( term.length <= 0 ) {
      this.loadHospitals();
      return;
    }

    this.loading = true;

    this._hospitalService.searchHospitals( term )
          .subscribe( ( hospitals ) => {
            this.hospitals = hospitals;
            this.loading = false;
          });
  }

  createHospital() {

    Swal.fire({
      title: 'Create Hospital',
      text: 'Add hospital name',
      type: 'info',
      input: 'text',
      showCancelButton: true,
      confirmButtonText: 'Save Hospital',
      inputValidator: (value) => {
        if (!value) {
          return 'You need to write something!';
        }
      }
    }).then( (resp: any) => {
      // console.log(resp.value);
      this._hospitalService.createHospital( resp.value )
              .subscribe( () => this.loadHospitals() );
    });
  }

  saveHospital( hospital: Hospital ) {
    this._hospitalService.updateHospital( hospital )
            .subscribe();
  }

  deleteHospital( hospital: Hospital ) {
    this._hospitalService.deleteHospital( hospital._id )
            .subscribe( () => this.loadHospitals());
  }

  updateImage( hospital: Hospital) {
    this._modalUploadService.showModal( 'hospitales', hospital._id );
  }

}
