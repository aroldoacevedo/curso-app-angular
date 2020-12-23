import { Component, OnInit, ViewChild } from '@angular/core';
import { Alumno } from '../../models/alumno';
import { Curso } from '../../models/curso';
import { Examen } from '../../models/examen';
import { ActivatedRoute } from '@angular/router';
import { AlumnoService } from '../../services/alumno.service';
import { CursoService } from '../../services/curso.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { ResponderExamenModalComponent } from './responder-examen-modal.component';
import { RespuestaService } from '../../services/respuesta.service';
import { Respuesta } from '../../models/respuesta';
import Swal from 'sweetalert2';
import { VerExamenModalComponent } from './ver-examen-modal.component';

@Component({
  selector: 'app-responder-examen',
  templateUrl: './responder-examen.component.html',
  styleUrls: ['./responder-examen.component.css']
})
export class ResponderExamenComponent implements OnInit {

  alumno : Alumno;
  curso : Curso;
  examenes : Examen[] = [];

  mostrarColumnasExamenes: string[] = ['id', 'nombre', 'asignaturas','preguntas','responder','ver'];

  dataSource : MatTableDataSource<Examen>;
  @ViewChild(MatPaginator, {static : true}) paginator: MatPaginator;
  pageSizeOptions: number[] = [3, 5, 10, 20, 50];

  constructor(private route: ActivatedRoute,
              private alumnoService: AlumnoService,
              private cursoService: CursoService,
              private respuestaService : RespuestaService,
              public dialog: MatDialog) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id: number = +params.get('id');
      this.alumnoService.ver(id).subscribe(alumno => { 
        this.alumno = alumno;

        this.cursoService.ObtenerCursoPorAlumnoId(this.alumno).subscribe(curso => {
            this.curso = curso;
            this.examenes = (curso && curso.examenes) ? curso.examenes : [];
            this.iniciarPaginador();
        });
     
      });
    });
  }

  private iniciarPaginador(): void {
    this.dataSource = new MatTableDataSource<Examen>(this.examenes);
    this.dataSource.paginator = this.paginator;
    this.paginator._intl.itemsPerPageLabel = 'Registros por pagina';
  }

  responderExamen(examen : Examen): void{
    const modelRef = this.dialog.open(ResponderExamenModalComponent, {
      width : '750px', 
      data: {curso : this.curso, alumno : this.alumno, examen : examen}
    });
    modelRef.afterClosed().subscribe((respuestasMap: Map<number, Respuesta>) => {
      console.log('model responder examen ha sido enviado y cerrado');
      console.log(respuestasMap);
      if(respuestasMap){
        const respuestas: Respuesta[] = Array.from(respuestasMap.values());
        this.respuestaService.crear(respuestas).subscribe(rs => {
          examen.respondido = true;
          Swal.fire('Enviadas:', 
          `Preguntas enviadas con éxito`, 
          'success');
          console.log(rs);
        });
      }
    });
  }

  verExamen(examen : Examen): void {
    this.respuestaService.obtenerRespuestasPorAlumnoPorExamen(this.alumno,examen)
    .subscribe(rs => {

      const modelRef = this.dialog.open(VerExamenModalComponent, {
        width : '750px', 
        data: {curso : this.curso, examen : examen, respuestas: rs }
      });

      modelRef.afterClosed().subscribe(() => {
        console.log('model ver examen ha sido cerrado');
      });

    });
  }
}
