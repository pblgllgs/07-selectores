import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PaisesService } from '../../services/paises.service';
import { switchMap, tap } from 'rxjs/operators';
import { PaisSmall } from '../../interfaces/pais.interface';

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
  styles: [
  ]
})
export class SelectorPageComponent implements OnInit {

  public miFormulario : FormGroup = this.fb.group({
    region :[,Validators.required],
    pais: [,Validators.required],
    frontera:[,Validators.required]
  })

  public regiones : string[] = [];
  public paises: PaisSmall[] = [];
  public fronteras: PaisSmall[] = [];

  public cargando : boolean =  false;

  constructor(  private fb:FormBuilder, 
                private paisesService:PaisesService) { }

  ngOnInit(): void {

    this.regiones = this.paisesService.regiones;


    // Cuando cambie la region
    this.miFormulario.get('region')?.valueChanges
      .pipe(
        tap( ( _ ) => {
          this.miFormulario.get('pais')?.reset('');
          this.cargando = true;
        }),
        switchMap( region => this.paisesService.getPaisesPorRegion( region ) )
      )
      .subscribe( paises => {
        this.paises = paises;
        this.cargando = false;
    });

    // Cuando cambia el país
    this.miFormulario.get('pais')?.valueChanges
      .pipe(
        tap( () => {
          this.miFormulario.get('frontera')?.reset('');
          this.cargando = true;
        }),
        switchMap( codigo => this.paisesService.getPaisPorCodigo( codigo ) ),
        switchMap( pais => this.paisesService.getPaisesPorCodigos( pais?.borders! ) )
      )
      .subscribe( paises => {
        this.fronteras = paises;
        this.cargando = false;
      })

  }

  guardar(){
    console.log(this.miFormulario.valid)
  }

}
