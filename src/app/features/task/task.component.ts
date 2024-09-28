import { Component, OnInit, inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule,FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatDivider, MatDividerModule } from '@angular/material/divider';
import {MatSelectModule} from '@angular/material/select';
import { initFlowbite } from 'flowbite';
import { LocalStorageService } from '../../services/local-storage.service'; // Asegúrate de que la ruta sea correcta
import { Subscription } from 'rxjs/internal/Subscription';
import { v4 as uuidv4 } from 'uuid';
import { CommonModule } from '@angular/common'; // Importa CommonModule
import { MatButtonModule } from '@angular/material/button';

interface People {
  value: string;
  viewValue: string;
  
}
interface Person {
  viewValue: string;
  age: number;
  skills: string[];
}


interface Task {
  id: string;
  name: string;
  dueDate: string;
  completed: boolean;
  selectedPeople: Person[];
}

interface Progress {
  value: boolean;
  viewValue: string;
}


@Component({
  selector: 'app-task',
  standalone: true,
  imports: [ReactiveFormsModule,MatIconModule, MatDivider,MatSelectModule,     CommonModule ,
    MatDividerModule,FormsModule,MatButtonModule, MatDividerModule, MatIconModule],
  templateUrl: './task.component.html',
  styleUrl: './task.component.css'
})
export class TaskComponent {
 
  selectedUserId!: string;
  selectedValue!: string;
  tasks: Task[] = []; 
  tasksList: Task[] = []; 
  person: Person[] = [];
  peoples: People[] = []; 
  private subscription!: Subscription;
  processedTasks: string[] = []
  newCompletionStatus: string = ''; 
  isVisible: boolean = true;
  
 

  filteredTasks = [...this.tasks]; // Inicialmente, todas las tareas
  showCompleted: boolean = false; // Por defecto no se filtran las completadas




fb = inject(FormBuilder)
localStorageService = inject(LocalStorageService); // Inyecta el servicio

taskForm: FormGroup = this.fb.group({
  name: ['', [Validators.required]],
  dueDate: ['', Validators.required],
  selectedPeople: ['', Validators.required] 

})



ngOnInit(): void {
  initFlowbite();
  this.loadPeople();
  this.subscription = this.localStorageService.personas$.subscribe((people) => {
    this.peoples = people.map((person: any, index: number) => ({
      value: index.toString(),
      viewValue: person.nombre
    }));
  });
  this.getTaskList();

}

ngOnDestroy(): void {
  this.subscription.unsubscribe(); // Limpia la suscripción
}

loadPeople(): void {
  const storedPeople = this.localStorageService.get('personas') || [];
  this.person = storedPeople.map((person: any, index: number) => ({
    value: index.toString(),
    viewValue: person.nombre,
    age: person.edad, // Asegúrate de que 'edad' esté en tu objeto
    skills: person.habilidades 
  }));
}

 // Método para filtrar las tareas
 filterTasks(filter: string) {
  switch (filter) {
    case 'completed':
      this.filteredTasks = this.tasks.filter(task => task.completed);
      break;
    case 'pending':
      this.filteredTasks = this.tasks.filter(task => !task.completed);
      break;
    default:
      this.filteredTasks = [...this.tasks]; // Mostrar todas las tareas
  }
}

createTask() {
  if (this.taskForm.valid) {
    const newTask = { ...this.taskForm.value, id: uuidv4() };  // Agrega un UUID a la nueva tarea
    this.tasks  = JSON.parse(localStorage.getItem('tasks') || '[]');

   this.tasks.push(newTask);  // Agrega la nueva tarea con UUID al array
   localStorage.setItem('tasks', JSON.stringify(this.tasks));  // Guarda el array actualizado en localStorage

    console.log('Task Created and Stored with UUID:',this.tasks);

  } else {
    console.log('Form is invalid');
  }
}
getTaskList(){
  const storedList: any[] = JSON.parse(localStorage.getItem('tasks') || '[]');   
   if (storedList == null) {
    this.tasksList = [];
   } else{
     this.tasksList = storedList;
     console.log(this.tasksList);
   }

   return this.tasksList;
}

openModal(id: string) {
 // Guardar el ID del usuario seleccionado
 this.selectedUserId = id;
 console.log('update'+ this.selectedUserId)
}

updateTaskCompletion() {

  this.selectedUserId;

  const storedList: any[] = JSON.parse(localStorage.getItem('tasks') || '[]');   

  const updatedList = storedList.map(task => {
    
    if (task.id === this.selectedUserId) {

  
      return { ...task, completed: !task.completed }; // Cambiar el valor de completed
      
    }
    return task;
  });

  // Guardar la lista actualizada en el localStorage
  localStorage.setItem('tasks', JSON.stringify(updatedList));

  
}
 



onSubmit():void{
  this.createTask();

}






}
