import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  private personasSubject = new BehaviorSubject<any[]>(this.get('personas') || []);
  personas$ = this.personasSubject.asObservable();

  save(key: string, data: any): void {
    localStorage.setItem(key, JSON.stringify(data));
  }

  get(key: string): any {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  }

  remove(key: string): void {
    localStorage.removeItem(key);
    this.updatePersonas(); // Actualiza el estado si se elimina 'personas'
  }

  savePersona(newPersona: any): void {
    const personas = this.get('personas') || []; // Obtiene las personas actuales o un arreglo vacío
    personas.push(newPersona); // Agrega la nueva persona
    this.save('personas', personas); // Guarda el arreglo actualizado
    this.updatePersonas(); // Notifica a los suscriptores
  }

  clearStorage(key: string): void {
    this.remove(key); // Llama al método remove
    this.updatePersonas(); // Actualiza el observable
  }

  private updatePersonas(): void {
    const storedPeople = this.get('personas') || [];
    this.personasSubject.next(storedPeople); // Notifica a los suscriptores sobre los cambios
  }
}
