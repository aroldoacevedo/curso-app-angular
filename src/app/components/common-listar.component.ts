import { Directive, OnInit, ViewChild } from '@angular/core';
import Swal from 'sweetalert2';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { CommonService } from '../services/common.service';
import { Generic } from '../models/generic';

@Directive()
export abstract class CommonListarComponent<E extends Generic, S extends CommonService<E>> implements OnInit {

  titulo: string;
  lista: E[];
  protected nombreModel: String; 

  public totalRegistros: number = 0;
  public paginaActual: any = 0;
  public totalPorPagina: any = 4;
  public pageSizeOptions: number[] = [5, 10, 25, 100];

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(protected service: S) { }

  ngOnInit(): void {
    this.calcularRangos();
  }

  public paginar(event : PageEvent) : void {
    this.paginaActual = event.pageIndex;
    this.totalPorPagina = event.pageSize;
    this.calcularRangos();
  }

  private calcularRangos(){
    this.service.listarPaginas(this.paginaActual , this.totalPorPagina)
    .subscribe(p => {
      this.lista = p.content as E[];
      this.totalRegistros = p.totalElements as number;
      this.paginator._intl.itemsPerPageLabel = 'Registros por pagina:';
    });
  }

  public eliminar(e: E) : void{

    Swal.fire({
      title: `Cuidado:`,
      text: `Seguro que desea eliminar a ${e.nombre}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.service.eliminar(e.id).subscribe(() =>{
          this.calcularRangos();
          Swal.fire('Eliminado: ', `Alumno ${this.nombreModel} ${e.nombre} eliminado con exito`, 'success');
        });
      }
    })

  }

}
