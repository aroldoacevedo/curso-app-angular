import { Directive, OnInit } from '@angular/core';
import Swal from 'sweetalert2'
import { Router, ActivatedRoute } from '@angular/router';
import { CommonService } from '../services/common.service';
import { Generic } from '../models/generic';

@Directive()
export abstract class CommonFormComponent<E extends Generic, S extends CommonService<E>> implements OnInit {

  titulo: string;
  model: E;
  error: any;
  protected redirect: string;
  protected nombreModel: string;

  constructor(protected service: S, 
              protected router: Router,
              protected route: ActivatedRoute) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id: number = +params.get('id');
      if(id){
        this.service.ver(id).subscribe(m => {
          this.model = m;
          this.titulo = 'Editar ' + this.nombreModel;
        });
      }
    });
  }

  public crear(): void {
    this.service.crear(this.model).subscribe(m => {
      console.log(m);
      Swal.fire('Nuevo:', `${this.nombreModel} ${m.nombre} creado con éxito`, 'success');
      this.router.navigate([this.redirect]);
    }, err => {
      if(err.status === 400){
        this.error = err.error;
        console.log(this.error);
      }
    });
  }

  public editar(): void {
    this.service.editar(this.model).subscribe(m => {
      console.log(m);
      Swal.fire('Modificado:', `${this.nombreModel} ${m.nombre} actualizado con éxito`, 'success');
      this.router.navigate([this.redirect]);
    }, err => {
      if(err.status === 400){
        this.error = err.error;
        console.log(this.error);
      }
    });
  }
}