import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BASE_ENDPOINT } from '../config/app';
import { Respuesta } from '../models/respuesta';
import { Observable } from 'rxjs';
import { Alumno } from '../models/alumno';
import { Examen } from '../models/examen';

@Injectable({
  providedIn: 'root'
})
export class RespuestaService {

  private cabeceras: HttpHeaders = new HttpHeaders({ 'Content-type': 'application/json', 'accept': 'application/json' });

  private baseEndpoint = `${BASE_ENDPOINT}/respuestas`;

  constructor(private http: HttpClient) {}

  crear(respuesta: Respuesta[]):Observable<Respuesta[]>{
    return this.http.post<Respuesta[]>(this.baseEndpoint, respuesta , { headers: this.cabeceras });
  }

  obtenerRespuestasPorAlumnoPorExamen(alumno: Alumno, examen : Examen):Observable<Respuesta[]>{
    return this.http.get<Respuesta[]>(`${this.baseEndpoint}/alumno/${alumno.id}/examen/${examen.id}`);
  }

}
