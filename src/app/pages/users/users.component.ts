import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user.model';
import { UserService } from '../../services/service.index';
import Swal from 'sweetalert2';
import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';

// declare var Swal: any;

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styles: []
})
export class UsersComponent implements OnInit {

  users: User[] = [];
  from: number = 0;

  totalRecords: number = 0;
  loading: boolean = true;

  constructor(
    public _userService: UserService,
    public _modalUploadService: ModalUploadService
  ) { }

  ngOnInit() {
    this.loadUsers();

    this._modalUploadService.notification
          .subscribe( resp => this.loadUsers() );
  }

  showModal( id: string ) {
    this._modalUploadService.showModal( 'usuarios', id );
  }

  loadUsers() {

    this.loading = true;

    this._userService.loadUsers( this.from )
            .subscribe( (resp: any) => {
              this.totalRecords = resp.total;
              this.users = resp.usuarios;
              this.loading = false;
            });

  }

  changeFrom( value: number ) {

    let from = this.from + value;
    console.log( from );

    if ( from >= this.totalRecords ) {
      return;
    }

    if ( from < 0 ) {
      return;
    }

    this.from += value;
    this.loadUsers();
  }

  searchUsers( term: string ) {

    if ( term.length <= 0 ) {
      this.loadUsers();
      return;
    }

    this.loading = true;

    this._userService.searchUsers( term )
          .subscribe( ( users: User[] ) => {
            this.users = users;
            this.loading = false;
          });
  }

  deleteUser( user: User ) {

    if ( user._id === this._userService.user._id ) {
      Swal.fire('No se puede borrar usuario', 'No se puede borrar a si mismo', 'error');
      return;
    }

    Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this! You are about to delete ' + user.nombre,
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.value) {
        this._userService.deleteUser( user._id )
              .subscribe( resp => {
                console.log( resp );
                this.loadUsers();
                Swal.fire(
                  'Deleted!',
                  'Your user ' + user.nombre + ' has been successfully deleted.',
                  'success'
                );
              });
      }
    });
  }

  saveUser( user: User ) {
    this._userService.updateUser( user )
          .subscribe();
  }

}
