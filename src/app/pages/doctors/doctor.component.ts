import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Hospital } from '../../models/hospital.model';
import { HospitalService } from '../../services/service.index';
import { Doctor } from 'src/app/models/doctor.model';
import { DoctorService } from '../../services/service.index';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';

@Component({
  selector: 'app-doctor',
  templateUrl: './doctor.component.html',
  styles: []
})
export class DoctorComponent implements OnInit {

  hospitals: Hospital[] = [];
  doctor: Doctor = new Doctor('', '', '', '', '');
  hospital: Hospital = new Hospital('');

  constructor(
    public _doctorService: DoctorService,
    public _hospitalService: HospitalService,
    public router: Router,
    public activatedRoute: ActivatedRoute,
    public _modalUploadService: ModalUploadService
  ) {
    activatedRoute.params.subscribe( params => {
      let id = params['id'];
      if (id !== 'new') {
        this.getDoctor( id );
      }
    });
  }

  ngOnInit() {
    this._hospitalService.loadHospitals()
          .subscribe( hospitals => this.hospitals = hospitals );

    this._modalUploadService.notification
          .subscribe( resp => {
            this.doctor.img = resp.medico.img;
          });
  }

  getDoctor( id: string ) {
    this._doctorService.getDoctor( id )
          .subscribe( doctor => {
            this.doctor = doctor;
            this.doctor.hospital = doctor.hospital._id;
            this.changeHospital( this.doctor.hospital );
          });
  }

  saveDoctor( f: NgForm ) {
    console.log( f.valid );
    console.log( f.value );

    if (f.invalid) {
      return;
    }

    this._doctorService.saveDoctor( this.doctor )
          .subscribe( doctor => {
            this.doctor._id = doctor._id;
            this.router.navigate(['/doctor', doctor._id ]);
          });
  }

  changeHospital( id: string ) {
    this._hospitalService.getHospital( id )
          .subscribe( hospital => this.hospital = hospital );
  }

  changePhoto() {
    this._modalUploadService.showModal( 'medicos', this.doctor._id );
  }

}
