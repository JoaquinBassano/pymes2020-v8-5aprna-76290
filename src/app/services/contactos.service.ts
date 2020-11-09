import { Injectable } from '@angular/core';
import {HttpClient,HttpHeaders,HttpErrorResponse,HttpParams} from "@angular/common/http";
import { of } from "rxjs";
import { Contacto} from "../models/contacto";

@Injectable({
  providedIn: "root"
})

export class ContactosService {

  resourceUrl: string;


  constructor(private httpClient: HttpClient) {
    this.resourceUrl = "https://pav2.azurewebsites.net/api/contactos";
  }

  get() {
    return this.httpClient.get(this.resourceUrl);
  }

  post(obj: Contacto) {
    return this.httpClient.post(this.resourceUrl, obj);
  }

}