import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-promises',
  templateUrl: './promises.component.html',
  styles: []
})
export class PromisesComponent implements OnInit {

  constructor() {

    this.countToThree(). then(
      () => console.log('Finished!')
    )
    .catch( error => console.error('Error en la promesa', error));

   }

  ngOnInit() {
  }

  countToThree(): Promise<boolean> {

    return new Promise( (resolve, reject) => {

      let counter = 0;

      let intervalo = setInterval( () => {

        counter += 1;
        console.log(counter);

        if ( counter === 3 ) {
          resolve( true );
          clearInterval(intervalo);
        }

      }, 1000 );

    });

  }

}
