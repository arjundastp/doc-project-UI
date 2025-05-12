import { Routes } from '@angular/router';
import { ProgramListComponent } from './components/program-list/program-list.component';
import { ProgramFormComponent } from './components/program-form/program-form.component';

export const routes: Routes = [
  { path: '', component: ProgramListComponent },
  { path: 'add', component: ProgramFormComponent }
];
