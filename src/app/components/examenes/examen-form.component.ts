import { Component, OnInit } from '@angular/core';
import { ExamenService } from '../../services/examen.service';
import { Examen } from '../../models/examen';
import { CommonFormComponent } from '../common-form.component';
import { Router, ActivatedRoute } from '@angular/router';
import { Asignatura } from '../../models/asignatura';
import { Pregunta } from '../../models/pregunta';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-examen-form',
  templateUrl: './examen-form.component.html',
  styleUrls: ['./examen-form.component.css']
})
export class ExamenFormComponent extends CommonFormComponent<Examen, ExamenService> implements OnInit{ 

  public asignaturasPadre : Asignatura[] = [];
  public asignaturasHija : Asignatura[] = [];
  public errorPreguntas: string;s

  constructor(service: ExamenService,
    router: Router,
    route: ActivatedRoute) {
      
    super(service, router, route);
    this.titulo = 'Crear Examen';
    this.model = new Examen();
    this.redirect = '/examenes';
    this.nombreModel = Examen.name;
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id: number = +params.get('id');
      if(id){
        this.service.ver(id).subscribe(m => {
          this.model = m;
          this.titulo = 'Editar ' + this.nombreModel;
          this.cargarHijos();
        /*this.service.findAllAsignatura()
        .subscribe(asignaturas => 
        this.asignaturasHija = asignaturas.filter(a => a.padre && a.padre.id === this.model.asignaturaPadre.id));*/
        });
      }
    });

    this.service.findAllAsignatura()
    .subscribe(asignaturas => 
      this.asignaturasPadre = asignaturas.filter(a => !a.padre));

  }

  public editar(): void {
    if(this.model.preguntas.length === 0){
      //Swal.fire('Error Preguntas', 'Examen debe tener preguntas','error');
      this.errorPreguntas ='Examen debe tener preguntas';
      return;
    }
    this.errorPreguntas = undefined;
    this.eliminarPreguntasVacias();
    super.editar();
  }

  public crear(): void {
    if(this.model.preguntas.length === 0){
      //Swal.fire('Error Preguntas', 'Examen debe tener preguntas','error');
      this.errorPreguntas ='Examen debe tener preguntas';
      return;
    }
    this.errorPreguntas = undefined;
    this.eliminarPreguntasVacias();
    super.crear();
  }

  public cargarHijos(): void {
    this.asignaturasHija = this.model.asignaturaPadre ? this.model.asignaturaPadre.hijos : [];
  }

  public compararAsignatura(a1 : Asignatura, a2 : Asignatura): boolean{
    if(a1 === undefined && a2 === undefined){
      return true;
    }
    return (a1 === null || a1 === null || a1 === undefined || a2 === undefined) 
    ? false : a1.id === a2.id;
  }

  public agregarPregunta(): void{
    this.model.preguntas.push(new Pregunta());
  }

  public asignarTexto(pregunta: Pregunta, event): void{
    pregunta.texto = event.target.value as string;
    console.log(this.model);
  }

  public eliminarPregunta(pregunta: Pregunta): void {
    this.model.preguntas = this.model.preguntas.filter(p => p.texto !== pregunta.texto);
  }

  public eliminarPreguntasVacias(): void {
    this.model.preguntas = this.model.preguntas.filter(p => p.texto !== null && p.texto.length > 0);
  }

}
