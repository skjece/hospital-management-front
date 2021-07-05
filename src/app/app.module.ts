import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HospitalListComponent } from './hospital-list/hospital-list.component';
import { DepartmentListComponent } from './department-list/department-list.component';
import { HospitalService } from './services/hospital.service';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

import { ReactiveFormsModule } from '@angular/forms';
import { SNackBarComponent } from './dialog/snackbar/snackbar.component';
import { EditHospitalDialog } from './dialog/edit-hospital/editHospital.component';
import { DepartmentService } from './services/department.service';
import { EditDepartmentDialog } from './dialog/edit-department/editDepartment.component';

@NgModule({
  declarations: [
    AppComponent,
    HospitalListComponent,
    DepartmentListComponent,
    SNackBarComponent,
    EditHospitalDialog,
    EditDepartmentDialog,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,

    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatDialogModule,
    MatButtonModule,

    ReactiveFormsModule,
  ],
  providers: [HospitalService, DepartmentService],
  bootstrap: [AppComponent],
  entryComponents: [
    SNackBarComponent,
    EditHospitalDialog,
    EditDepartmentDialog,
  ],
})
export class AppModule {}
