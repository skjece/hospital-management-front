import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';

const BACKEND_URL = environment.BACKEND_URL;

@Injectable({
  providedIn: 'root',
})
export class DepartmentService {
  constructor(private http: HttpClient) {}

  departmentServiceEvent = new Subject<any>();

  fetchDepartmentList(hospitalname: any) {
    let action = 'FETCH_DEPARTMENTS';

    this.http
      .get(BACKEND_URL + '/getDepartmentsList', {
        params: { hospitalname },
      })
      .subscribe(
        (res: any) => {
          //console.log(res.departments);
          if (res.status == 'SUCCESS' && res.departments) {
            this.departmentServiceEvent.next({
              action,
              departments: res.departments,
            });
          } else {
            this.departmentServiceEvent.next({
              action,
              staus: 'ERROR',
            });
          }
        },
        (err) => {
          this.departmentServiceEvent.next({
            action,
            staus: 'ERROR',
          });
        }
      );
  }

  addDepartment(
    department_name: string,
    head_name: string,
    contact: string,
    hospital_name: string
  ) {
    let action = 'ADD_DEPARTMENT';

    //console.log(name, contact);
    this.http
      .post(BACKEND_URL + '/addDepartment', {
        department_name,
        head_name,
        contact,
        hospital_name,
      })
      .subscribe(
        (res: any) => {
          //console.log(res);
          if (res.status == 'SUCCESS' && res.departments) {
            this.departmentServiceEvent.next({
              action,
              departments: res.departments,
            });
          } else {
            this.departmentServiceEvent.next({
              action,
              status: res.status || 'ERROR',
            });
          }
        },
        (err) => {
          //console.log(err);

          this.departmentServiceEvent.next({
            action,
            status: err.error.status || 'ERROR',
          });
        }
      );
  }

  deleteDepartment(department: any) {
    let action = 'DELETE_DEPARTMENT';

    this.http
      .post(BACKEND_URL + '/deleteDepartment', {
        department,
      })
      .subscribe(
        (res: any) => {
          //console.log(res);
          if (res.status == 'SUCCESS' && res.departments) {
            this.departmentServiceEvent.next({
              action,
              departments: res.departments,
            });
          } else {
            this.departmentServiceEvent.next({
              action,
              status: res.status || 'ERROR',
            });
          }
        },
        (err) => {
          //console.log(err);

          this.departmentServiceEvent.next({
            action,
            status: err.error.status || 'ERROR',
          });
        }
      );
  }

  updateDepartment(
    old_department_name: string,
    hospital_name: string,
    new_department_name: string,
    new_head_name: string,
    new_contact: string
  ) {
    //console.log(arguments);
    let action = 'UPDATE_DEPARTMENT';
    this.http
      .post(BACKEND_URL + '/updateDepartment', {
        old_department_name,
        hospital_name,
        new_department_name,
        new_head_name,
        new_contact,
      })
      .subscribe(
        (res: any) => {
          //console.log(res);
          if (res.status == 'SUCCESS' && res.departments) {
            this.departmentServiceEvent.next({
              action,
              departments: res.departments,
            });
          } else {
            this.departmentServiceEvent.next({
              action,
              status: res.status || 'ERROR',
            });
          }
        },
        (err) => {
          //console.log(err);
          this.departmentServiceEvent.next({
            action,
            status: err.error.status || 'ERROR',
          });
        }
      );
  }

  getDepartmentServiceEventAsObs() {
    return this.departmentServiceEvent.asObservable();
  }
}
