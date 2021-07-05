import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { EditDepartmentDialog } from '../dialog/edit-department/editDepartment.component';
import { EditHospitalDialog } from '../dialog/edit-hospital/editHospital.component';
import { SNackBarComponent } from '../dialog/snackbar/snackbar.component';
import { DepartmentService } from '../services/department.service';
import { numberValidators } from '../shared/number-validator';

@Component({
  selector: 'app-department-list',
  templateUrl: './department-list.component.html',
  styleUrls: ['./department-list.component.css'],
})
export class DepartmentListComponent implements OnInit, OnDestroy {
  constructor(
    public departmentService: DepartmentService,
    public matsnackbar: MatSnackBar,
    public dialog: MatDialog,
    public router: Router,
    public route: ActivatedRoute
  ) {}

  department_form = new FormGroup({
    department_name: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
    ]),
    head_name: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
    ]),
    contact: new FormControl('', [numberValidators.isVaidContact]),
  });

  get department_name() {
    return this.department_form.get('department_name');
  }
  get head_name() {
    return this.department_form.get('head_name');
  }
  get contact() {
    return this.department_form.get('contact');
  }

  departmentServiceEventSubs = new Subscription();
  department_list: any;
  fetchDepartmentStatus: string = 'NOT_FETCHING';
  addingStatus = 'NOT_ADDING';
  hospital_name: any;

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      //console.log(params);

      if (!params.hospitalname) {
        this.router.navigateByUrl('/hospital', { replaceUrl: true });
        this.showSnack(false, 'Some error occuerd');
        return;
      }

      this.hospital_name = params.hospitalname;
      this.fetchDepartmentStatus = 'FETCHING';
      this.departmentService.fetchDepartmentList(this.hospital_name);
      this.subscribeToDepartmentServiceEvent();
    });
  }

  subscribeToDepartmentServiceEvent() {
    if (this.departmentServiceEventSubs)
      this.departmentServiceEventSubs.unsubscribe();
    this.departmentServiceEventSubs = this.departmentService
      .getDepartmentServiceEventAsObs()
      .subscribe((response: any) => {
        //console.log(         'response in departmen t component subs' + JSON.stringify(response));
        if (response.action == 'FETCH_DEPARTMENTS') {
          if (response.departments) {
            this.fetchDepartmentStatus = 'FETCHED';
            this.department_list = response.departments;
          } else {
            this.fetchDepartmentStatus = 'ERROR';
          }
        } else if (response.action == 'ADD_DEPARTMENT') {
          //console.log('tset1');
          if (response.departments) {
            //console.log('tset2');
            this.addingStatus = 'ADDED';
            this.department_list = response.departments;
            this.showSnack(true, 'Added Successfully');
            this.department_form.reset();
          } else if (response.status == 'DEPARTMENT_ALREADY_EXIST') {
            //console.log('tset3');
            // //console.log("already exist")
            this.addingStatus = 'ERROR';
            this.showSnack(false, 'Department already exist.');
            // this.department_form.reset();
          } else {
            this.showSnack(false, 'Some error occured.');
            this.addingStatus = 'ERROR';
          }
        } else if (response.action == 'DELETE_DEPARTMENT') {
          this.resetDeleteFlags();
          if (response.departments) {
            this.department_list = response.departments;
            this.showSnack(true, 'Deleted');
          } else if (response.status == 'DEPARTMENT_NOT_FOUND') {
            this.showSnack(false, 'Not found.');
          } else {
            this.showSnack(false, 'Some error occured.');
          }
        } else if (response.action == 'UPDATE_DEPARTMENT') {
          this.resetUpdateFlags();
          if (response.departments) {
            this.department_list = response.departments;
            this.showSnack(true, 'Updated');
          } else if (response.status == 'DEPARTMENT_NOT_FOUND') {
            this.showSnack(false, 'Not found.');
          } else {
            this.showSnack(false, 'Some error occured.');
          }
        }
      });
  }

  createNewDepartment() {
    if (this.department_form.invalid) {
      this.department_form.markAllAsTouched();
      return;
    }

    this.addingStatus = 'ADDING';

    setTimeout(() => {
      this.departmentService.addDepartment(
        this.department_name?.value,
        this.head_name?.value,
        this.contact?.value,
        this.hospital_name
      );
    }, 1000);
  }

  deleteDepartment(department: any) {
    setTimeout(() => {
      this.departmentService.deleteDepartment(department);
    }, 1000);
  }

  showSnack(issuccess: Boolean, msg: string) {
    this.matsnackbar.openFromComponent(SNackBarComponent, {
      duration: 1000,
      data: {
        text: msg,
        issuccess: issuccess,
      },
    });
  }

  editDepartment(department: any) {
    let hospital_name = this.hospital_name;
    let old_department_name = department.departmentname;
    let old_head_name = department.head;
    let old_department_number = department.contactnumber;

    let obj = {
      old_department_name,
      old_head_name,
      old_department_number,
    };

    let dialogRef = this.dialog.open(EditDepartmentDialog, { data: obj });

    dialogRef.afterClosed().subscribe((updating_department) => {
      //console.log( 'updating_department from dialog:' + JSON.stringify(updating_department));

      if (
        old_department_name == updating_department.new_department_name &&
        old_department_number == updating_department.new_contact &&
        old_head_name == updating_department.new_head_name
      ) {
        this.resetUpdateFlags();
        this.showSnack(false, 'Nothing to update');
        return;
      }

      setTimeout(() => {
        this.departmentService.updateDepartment(
          old_department_name,
          hospital_name,
          updating_department.new_department_name,
          updating_department.new_head_name,
          updating_department.new_contact
        );
      }, 1000);
    });
  }

  resetUpdateFlags() {
    this.department_list.forEach((department: any) => {
      department.updating = false;
    });
  }

  resetDeleteFlags() {
    this.department_list.forEach((department: any) => {
      department.deleting = false;
    });
  }

  sortByName() {
    this.department_list.sort(function (a: any, b: any) {
      if (a.departmentname < b.departmentname) {
        return -1;
      }
      if (a.departmentname > b.departmentname) {
        return 1;
      }
      return 0;
    });
  }

  ngOnDestroy() {
    if (this.departmentServiceEventSubs)
      this.departmentServiceEventSubs.unsubscribe();
  }
}
