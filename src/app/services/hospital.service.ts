import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';

const BACKEND_URL = environment.BACKEND_URL;

@Injectable({
  providedIn: 'root',
})
export class HospitalService {
  constructor(private http: HttpClient) {}

  hospitalServiceEvent = new Subject<any>();

  fetchHospitalList() {
    let action = 'FETCH_HOSPITALS';

    this.http.get(BACKEND_URL + '/getHospitalsList').subscribe(
      (res: any) => {
        //console.log(res.hospitals);
        if (res.status == 'SUCCESS' && res.hospitals) {
          this.hospitalServiceEvent.next({
            action,
            hospitals: res.hospitals,
          });
        } else {
          this.hospitalServiceEvent.next({
            action,
            staus: 'ERROR',
          });
        }
      },
      (err) => {
        this.hospitalServiceEvent.next({
          action,
          staus: 'ERROR',
        });
      }
    );
  }

  addHospital(name: string, contact: string) {
    let action = 'ADD_HOSPITAL';

    //console.log(name, contact);
    this.http
      .post(BACKEND_URL + '/addHospital', {
        name,
        contact,
      })
      .subscribe(
        (res: any) => {
          //console.log(res);
          if (res.status == 'SUCCESS' && res.hospitals) {
            this.hospitalServiceEvent.next({
              action,
              hospitals: res.hospitals,
            });
          } else {
            this.hospitalServiceEvent.next({
              action,
              status: res.status || 'ERROR',
            });
          }
        },
        (err) => {
          //console.log(err);

          this.hospitalServiceEvent.next({
            action,
            status: err.error.status || 'ERROR',
          });
        }
      );
  }

  deleteHospital(hospital: any) {
    let action = 'DELETE_HOSPITAL';
    this.http
      .post(BACKEND_URL + '/deleteHospital', {
        hospital,
      })
      .subscribe(
        (res: any) => {
          //console.log(res);
          if (res.status == 'SUCCESS' && res.hospitals) {
            this.hospitalServiceEvent.next({
              action,
              hospitals: res.hospitals,
            });
          } else {
            this.hospitalServiceEvent.next({
              action,
              status: res.status || 'ERROR',
            });
          }
        },
        (err) => {
          //console.log(err);

          this.hospitalServiceEvent.next({
            action,
            status: err.error.status || 'ERROR',
          });
        }
      );
  }

  updateHospital(old_name: string, new_name: string, new_contact: string) {
    //console.log(arguments);
    let action = 'UPDATE_HOSPITAL';
    this.http
      .post(BACKEND_URL + '/updateHospital', {
        old_name,
        new_name,
        new_contact,
      })
      .subscribe(
        (res: any) => {
          //console.log(res);
          if (res.status == 'SUCCESS' && res.hospitals) {
            this.hospitalServiceEvent.next({
              action,
              hospitals: res.hospitals,
            });
          } else {
            this.hospitalServiceEvent.next({
              action,
              status: res.status || 'ERROR',
            });
          }
        },
        (err) => {
          //console.log(err);
          this.hospitalServiceEvent.next({
            action,
            status: err.error.status || 'ERROR',
          });
        }
      );
  }

  getHospitalServiceEventAsObs() {
    return this.hospitalServiceEvent.asObservable();
  }
}
