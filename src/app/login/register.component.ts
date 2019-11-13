import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import Swal from 'sweetalert2';
import { UserService } from '../services/service.index';
import { User } from '../models/user.model';
import { Router } from '@angular/router';

declare function init_plugins();

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./login.component.css']
})
export class RegisterComponent implements OnInit {

  forma: FormGroup;

  constructor(
    public _userService: UserService,
    public router: Router
  ) { }

  areIquals( field1: string, field2: string ) {
    return ( group: FormGroup ) => {

      let pass1 = group.controls[field1].value;
      let pass2 = group.controls[field2].value;

      if ( pass1 === pass2 ) {
        return null;
      }

      return {
        areIquals: true
      }

    };
  }

  ngOnInit() {
    init_plugins();

    this.forma = new FormGroup({
      nombre: new FormControl( null, Validators.required ),
      email: new FormControl( null, [Validators.required, Validators.email] ),
      password: new FormControl( null, Validators.required ),
      password2: new FormControl( null, Validators.required ),
      terms: new FormControl( false )
    }, { validators: this.areIquals( 'password', 'password2' )});

    this.forma.setValue({
      nombre: 'Test',
      email: 'test1@test.com',
      password: '123456',
      password2: '123456',
      terms: true
    });
  }

  registerUser() {
    if ( this.forma.invalid ) {
      return;
    }

    if ( !this.forma.value.terms ) {
      Swal.fire('Importante', 'Debe de aceptar los Términos y Condiciones', 'warning');
    }

    let user = new User(
      this.forma.value.nombre,
      this.forma.value.email,
      this.forma.value.password
    );

    this._userService.createUser( user )
        .subscribe( resp => this.router.navigate(['/login']));
  }

}
