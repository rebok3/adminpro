import { Injectable } from '@angular/core';
import { UserService } from '../user/user.service';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {

  menu: any[] = [];

  // menu: any = [
  //   {
  //     title: 'Principal',
  //     icon: 'mdi mdi-gauge',
  //     submenu: [
  //       { title: 'Dashboard', url: '/dashboard' },
  //       { title: 'ProgressBar', url: '/progress' },
  //       { title: 'Gráficas', url: '/graficas1' },
  //       { title: 'Promises', url: '/promises' },
  //       { title: 'RxJS', url: '/rxjs' }

  //     ]
  //   },
  //   {
  //     title: 'Admin',
  //     icon: 'mdi mdi-folder-lock-open',
  //     submenu: [
  //       { title: 'Users', url: '/users' },
  //       { title: 'Doctors', url: '/doctors' },
  //       { title: 'Hospitals', url: '/hospitals' },

  //     ]
  //   }
  // ];

  constructor(
    public _userService: UserService
  ) {}

  loadMenu() {
    this.menu = this._userService.menu;
  }
}
