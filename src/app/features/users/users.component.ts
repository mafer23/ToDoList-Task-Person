import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, inject, signal } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { v4 as uuidv4 } from 'uuid';
import { LocalStorageService } from '../../services/local-storage.service'; // Asegúrate de tener la ruta correcta


@Component({
  selector: 'app-users',
  standalone: true,
  imports: [ReactiveFormsModule,
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatChipsModule,
    MatIconModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent {
  personaForm: FormGroup;
  nuevaHabilidad = '';
  personas: any[] = []; 
  isAdding = false; // Agrega esta propiedad

  readonly reactiveKeywords = signal(['angular']);
  readonly formControl = new FormControl(['angular']);

  announcer = inject(LiveAnnouncer);

  constructor(private fb: FormBuilder, private localStorageService: LocalStorageService) {
    this.personaForm = this.fb.group({
      nombre: ['', Validators.required],
      edad: [null, [Validators.required, Validators.min(0)]],
      habilidades: [this.reactiveKeywords(), Validators.required]
    });
  }

  removeReactiveKeyword(keyword: string) {
    this.reactiveKeywords.update(keywords => {
      const index = keywords.indexOf(keyword);
      if (index < 0) {
        return keywords;
      }

      keywords.splice(index, 1);
      this.announcer.announce(`removed ${keyword} from reactive form`);
      return [...keywords];
    });
  }
  addReactiveKeyword(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our keyword
    if (value) {
  
      this.reactiveKeywords.update(keywords => {
        const updatedKeywords = [...keywords, value];
        // Actualiza el campo de habilidades en el formulario
        this.personaForm.patchValue({ habilidades: updatedKeywords });
        return updatedKeywords;
    });
    this.announcer.announce(`added ${value} to reactive form`);
    }

    // Clear the input value
    event.chipInput!.clear();
  }

  getFormDataAsJSON(): string {
    const formData = this.personaForm.value; // Obtiene todos los valores del formulario
    const jsonData = JSON.stringify(formData); // Convierte el objeto a una cadena JSON
    return jsonData;
  }


  saveToLocalStorage(): void {
    const newPersona = this.personaForm.value;
  
    // Generar UUID y asignarlo a la nueva persona
    newPersona.id = uuidv4();
  
    const personasJson = localStorage.getItem('personas');
  
    // Inicializa un array vacío si no hay datos previos o si el formato no es válido
    let personas: any[] = [];
  
    if (personasJson) {
        try {
            personas = JSON.parse(personasJson);
            // Verifica que sea un arreglo
            if (!Array.isArray(personas)) {
                throw new Error('El contenido en localStorage no es un arreglo');
            }
        } catch (error) {
            console.error('Error al analizar personas desde localStorage:', error);
            personas = []; // Reinicia a un arreglo vacío si hay un error
        }
    }
  
    // Verifica si la nueva persona ya existe, comparando el nombre, edad y habilidades
    const personaExists = personas.some(persona => 
        persona.nombre === newPersona.nombre && 
        persona.edad === newPersona.edad && 
        JSON.stringify(persona.habilidades) === JSON.stringify(newPersona.habilidades)
    );
  
    if (!personaExists) {
        // Agrega la nueva persona al array con su UUID
        personas.push(newPersona);
  
        // Guarda el array actualizado en localStorage
   
        this.localStorageService.savePersona(newPersona);
        console.log('Persona guardada en localStorage con UUID:', newPersona);
    } else {
        console.log('Esta persona ya existe en localStorage, no se agrega.');
    }
  }





  eliminarPersona() {
    // Reseteamos el formulario
    this.personaForm.reset();
    //this.habilidades.clear();
  }

  onSubmit() {
    if (this.personaForm.valid) {
      console.log('Persona guardada', this.personaForm.value);
    } else {
      console.log('Formulario inválido');
    }
  }
  

}
