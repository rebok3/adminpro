import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscriber, Subscription } from 'rxjs';
import { retry, map, filter } from 'rxjs/operators';

@Component({
  selector: 'app-rxjs',
  templateUrl: './rxjs.component.html',
  styles: []
})
export class RxjsComponent implements OnInit, OnDestroy {

  subscription: Subscription;

  constructor() {

    this.subscription = this.comeBackObservable()
    // .pipe(
    //   retry(2)
    // )
    .subscribe(
      number => console.log( 'Subs ', number ),
      error => console.error ('Error en el obs', error),
      () => console.log('El observador terminó')
    );

   }

  ngOnInit() {
  }

  ngOnDestroy() {
    console.log('La página se va a cerrar');
    this.subscription.unsubscribe();
  }

  comeBackObservable(): Observable<any> {

    return new Observable( (observer: Subscriber<any>) => {

      let counter = 0;
      let intervalo = setInterval( () => {

        counter++;

        const salida = {
          valor: counter
        };

        observer.next( salida );

        if ( counter === 3 ) {
          clearInterval( intervalo );
          observer.complete();
        }
        // if ( counter === 2 ) {
        //   clearInterval( intervalo );
        //   observer.error('Help!');
        // }

      }, 1000 );

    }).pipe(
      map( resp => resp.valor),
      filter( ( valor, index ) => {
        // console.log('Filter', valor, index);

        if ( ( valor % 2 ) === 1) {
          // impar
          return true;
          
        } else {
          // par
          return false;
        }
        // return true;
      })
    );

  }

}
