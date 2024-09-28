import { Routes } from '@angular/router';
import { TaskComponent } from './features/task/task.component';
import { UsersComponent } from './features/users/users.component';

export const routes: Routes = [
    { path: '', redirectTo: 'users', pathMatch: 'full' },
    {path: 'task', component: TaskComponent},
    {path: 'users', component: UsersComponent}
];
