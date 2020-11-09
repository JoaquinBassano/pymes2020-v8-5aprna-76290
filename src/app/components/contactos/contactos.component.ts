import { Component, OnInit } from "@angular/core";
import { Contacto } from "../../models/contacto";
import { ContactosService } from "../../services/contactos.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ModalDialogService } from "../../services/modal-dialog.service";

@Component({
  selector: 'app-contactos',
  templateUrl: './contactos.component.html',
  styleUrls: ['./contactos.component.css']
})
export class ContactosComponent implements OnInit {

  Titulo = "Contactos";
  TituloAccionABMC = {
    A: "(Agregar)",
    C: "",
    L: "(Listado)"
  };
  AccionABMC = "C"; // inicialmente inicia en el listado de articulos (buscar con parametros)

  Lista: Contacto[] = [];
  FormReg: FormGroup;
  submitted = false;


  constructor(
    public formBuilder: FormBuilder,
    private modalDialogService: ModalDialogService,
    private contactosService: ContactosService
  ) { }

  ngOnInit() {

    this.FormReg = this.formBuilder.group({
      IdContacto: [0],
      Nombre: ["",[Validators.required, Validators.minLength(1), Validators.maxLength(30)]],
      FechaNacimiento: ["",[Validators.required,
          Validators.pattern("(0[1-9]|[12][0-9]|3[01])[-/](0[1-9]|1[012])[-/](19|20)[0-9]{2}")]],
      Telefono: [null, [Validators.required, Validators.pattern("[0-9]{9}")]]
    });
    
  }

  GetContactos() {
    this.AccionABMC = "L";
    this.contactosService.get().subscribe((res: Contacto[]) => {
      this.Lista = res;
    });
  }


  Agregar() {
    this.AccionABMC = "A";
    this.FormReg.reset({ Activo: true });
    this.submitted = false;
    //this.FormReg.markAsPristine();
    this.FormReg.markAsUntouched();
  }



  Grabar() {
    this.submitted = true;
    // verificar que los validadores esten OK
    if (this.FormReg.invalid) {
      return;
    }
  
    //hacemos una copia de los datos del formulario, para modificar la fecha y luego enviarlo al servidor
    const itemCopy = { ...this.FormReg.value };
    
    
    //convertir fecha de string dd/MM/yyyy a ISO para que la entienda webapi
    var arrFecha = itemCopy.FechaNacimiento.substr(0, 10).split("/");
    if (arrFecha.length == 3)
      itemCopy.FechaNacimiento = new Date(
        arrFecha[2],
        arrFecha[1] - 1,
        arrFecha[0]
      ).toISOString();
    
    // agregar post

  
      this.contactosService.post(itemCopy).subscribe((res: any) => {
        this.Volver();
        this.modalDialogService.Alert("Registro agregado correctamente.");
        this.GetContactos();
      });
    
    
  }

  Volver() {
    this.AccionABMC = "L";
    this.GetContactos();
  }

}