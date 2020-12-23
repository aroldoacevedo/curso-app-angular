import { Component, OnInit, Inject } from '@angular/core';
import { Curso } from '../../models/curso';
import { Examen } from '../../models/examen';
import { Respuesta } from '../../models/respuesta';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-ver-examen-modal',
  templateUrl: './ver-examen-modal.component.html',
  styleUrls: ['./ver-examen-modal.component.css']
})
export class VerExamenModalComponent implements OnInit {

  curso : Curso;
  examen : Examen;
  respuestas : Respuesta[];

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
  public modelRef: MatDialogRef<VerExamenModalComponent>) { }

  ngOnInit(): void {
    this.curso = this.data.curso as Curso;
    this.examen = this.data.examen as Examen;
    this.respuestas = this.data.respuestas as Respuesta[];
  }

  cerrar(): void{
    this.modelRef.close();
  }

}
