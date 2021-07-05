import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { numberValidators } from 'src/app/shared/number-validator';

@Component({
  selector: 'edit-hospital-dialog',
  templateUrl: './editHospital.component.html',
  styleUrls: ['./editHospital.component.css'],
})
export class EditHospitalDialog implements OnInit {
  constructor(
    private dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  hospital_form_update = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    contact: new FormControl('', [numberValidators.isVaidContact]),
  });

  get name() {
    return this.hospital_form_update.get('name');
  }
  get contact() {
    return this.hospital_form_update.get('contact');
  }

  closeDialog() {
    // console.log('closing dialog');
    this.dialogRef.close();
  }

  updateHospitalInfo() {
    if (this.hospital_form_update.invalid) {
      this.hospital_form_update.markAllAsTouched();
      return;
    }
    this.dialogRef.close({
      new_name: this.name?.value,
      new_contact: this.contact?.value,
    });
  }

  ngOnInit() {
    this.hospital_form_update.patchValue({
      name: this.data.hospitalname,
      contact: this.data.contactnumber,
    });
  }
}
