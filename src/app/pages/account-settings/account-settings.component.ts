import { Component, OnInit } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';
import { SettingsService } from '../../services/service.index';

@Component({
  selector: 'app-account-settings',
  templateUrl: './account-settings.component.html',
  styles: []
})
export class AccountSettingsComponent implements OnInit {

  constructor( public _settings: SettingsService ) { }

  ngOnInit() {
    this.colocarCheck();
  }

  cambiarColor( theme: string, link: any ) {
    // console.log( link );

    this.aplicarCheck( link );
    this._settings.applyTheme( theme );

  }

  aplicarCheck( link: any ) {

    let selectores: any = document.getElementsByClassName('selector');

    for ( let ref of selectores ) {
      ref.classList.remove('working');
    }

    link.classList.add('working');

  }

  colocarCheck( ) {
    let selectores: any = document.getElementsByClassName('selector');
    let theme = this._settings.settings.theme;
    for ( let ref of selectores ) {
      if ( ref.getAttribute('data-theme') === theme ) {
        ref.classList.add('working');
        break;
      }
    }
  }

}
