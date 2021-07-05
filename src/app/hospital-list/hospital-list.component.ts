import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { EditHospitalDialog } from '../dialog/edit-hospital/editHospital.component';
import { SNackBarComponent } from '../dialog/snackbar/snackbar.component';
import { HospitalService } from '../services/hospital.service';
import { numberValidators } from '../shared/number-validator';

@Component({
  selector: 'app-hospital-list',
  templateUrl: './hospital-list.component.html',
  styleUrls: ['./hospital-list.component.css'],
})
export class HospitalListComponent implements OnInit, OnDestroy {
  constructor(
    public hospitalService: HospitalService,
    public matsnackbar: MatSnackBar,
    public dialog: MatDialog,
    public router: Router
  ) {}

  hospital_form = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    contact: new FormControl('', [numberValidators.isVaidContact]),
  });

  get name() {
    return this.hospital_form.get('name');
  }
  get contact() {
    return this.hospital_form.get('contact');
  }

  hospitalServiceEventSubs = new Subscription();
  hospital_list: any;
  fetchHospitalStatus: string = 'NOT_FETCHING';
  addingStatus = 'NOT_ADDING';

  ngOnInit(): void {
    this.fetchHospitalStatus = 'FETCHING';
    this.hospitalService.fetchHospitalList();
    this.subscribeToHospitalServiceEvent();
  }

  subscribeToHospitalServiceEvent() {
    if (this.hospitalServiceEventSubs)
      this.hospitalServiceEventSubs.unsubscribe();
    this.hospitalServiceEventSubs = this.hospitalService
      .getHospitalServiceEventAsObs()
      .subscribe((response: any) => {
        //console.log('response in component subs' + JSON.stringify(response));
        if (response.action == 'FETCH_HOSPITALS') {
          if (response.hospitals) {
            this.fetchHospitalStatus = 'FETCHED';
            this.hospital_list = response.hospitals;
          } else {
            this.fetchHospitalStatus = 'ERROR';
          }
        } else if (response.action == 'ADD_HOSPITAL') {
          //console.log('tset1');
          if (response.hospitals) {
            //console.log('tset2');
            this.addingStatus = 'ADDED';
            this.hospital_list = response.hospitals;
            this.showSnack(true, 'Added Successfully');
            this.hospital_form.reset();
          } else if (response.status == 'HOSPITAL_ALREADY_EXIST') {
            //console.log('tset3');
            // //console.log("already exist")
            this.addingStatus = 'ERROR';
            this.showSnack(false, 'Hospital already exist.');
            // this.hospital_form.reset();
          } else {
            this.showSnack(false, 'Some error occured.');
            this.addingStatus = 'ERROR';
          }
        } else if (response.action == 'DELETE_HOSPITAL') {
          if (response.hospitals) {
            this.hospital_list = response.hospitals;
            this.showSnack(true, 'Deleted');
          } else if (response.status == 'HOSPITAL_NOT_FOUND') {
            this.showSnack(false, 'Not found.');
          } else {
            this.showSnack(false, 'Some error occured.');
          }
        } else if (response.action == 'UPDATE_HOSPITAL') {
          this.resetUpdateFlags();
          if (response.hospitals) {
            this.hospital_list = response.hospitals;
            this.showSnack(true, 'Updated');
          } else if (response.status == 'HOSPITAL_NOT_FOUND') {
            this.showSnack(false, 'Not found.');
          } else {
            this.showSnack(false, 'Some error occured.');
          }
        }
      });
  }

  createNewHospital() {
    if (this.hospital_form.invalid) {
      this.hospital_form.markAllAsTouched();
      return;
    }

    this.addingStatus = 'ADDING';

    setTimeout(() => {
      this.hospitalService.addHospital(this.name?.value, this.contact?.value);
    }, 1000);
  }

  deleteHospital(hospital: any) {
    setTimeout(() => {
      this.hospitalService.deleteHospital(hospital);
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

  editHospital(hospital: any) {
    let old_hospital_name = hospital.hospitalname;
    let old_hospital_number = hospital.contactnumber;

    let dialogRef = this.dialog.open(EditHospitalDialog, { data: hospital });

    dialogRef.afterClosed().subscribe((new_hospital) => {
      //console.log('new_hospital from dialog:' + JSON.stringify(new_hospital));

      if (
        old_hospital_name == new_hospital.new_name &&
        old_hospital_number == new_hospital.new_contact
      ) {
        this.resetUpdateFlags();
        this.showSnack(false, 'Nothing to update');
        return;
      }

      setTimeout(() => {
        this.hospitalService.updateHospital(
          old_hospital_name,
          new_hospital.new_name,
          new_hospital.new_contact
        );
      }, 1000);
    });
  }

  resetUpdateFlags() {
    this.hospital_list.forEach((hospital: any) => {
      hospital.updating = false;
    });
  }

  routeToDepartments(hospitalname: any) {
    this.router.navigateByUrl('/department?hospitalname=' + hospitalname);
  }

  sortByName() {
    this.hospital_list.sort(function (a: any, b: any) {
      if (a.hospitalname < b.hospitalname) {
        return -1;
      }
      if (a.hospitalname > b.hospitalname) {
        return 1;
      }
      return 0;
    });
  }

  ngOnDestroy() {
    if (this.hospitalServiceEventSubs)
      this.hospitalServiceEventSubs.unsubscribe();
  }
}
