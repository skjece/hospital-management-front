import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DepartmentListComponent } from './department-list/department-list.component';
import { HospitalListComponent } from './hospital-list/hospital-list.component';

const routes: Routes = [
  {path:'',redirectTo:'hospital',pathMatch:'full'},
  {path:'hospital',component:HospitalListComponent},
  {path:'department',component:DepartmentListComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
