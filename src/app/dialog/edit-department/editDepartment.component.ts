import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { numberValidators } from 'src/app/shared/number-validator';

@Component({
  selector: 'edit-department-dialog',
  templateUrl: './editDepartment.component.html',
  styleUrls: ['./editDepartment.component.css'],
})
export class EditDepartmentDialog implements OnInit {
  constructor(
    private dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  department_form_update = new FormGroup({
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
    return this.department_form_update.get('department_name');
  }
  get head_name() {
    return this.department_form_update.get('head_name');
  }
  get contact() {
    return this.department_form_update.get('contact');
  }

  closeDialog() {
    // console.log('closing dialog');
    this.dialogRef.close();
  }

  updateDepartmentInfo() {
    if (this.department_form_update.invalid) {
      this.department_form_update.markAllAsTouched();
      return;
    }
    this.dialogRef.close({
      new_department_name: this.department_name?.value,
      new_head_name: this.head_name?.value,
      new_contact: this.contact?.value,
    });
  }

  ngOnInit() {
    this.department_form_update.patchValue({
      department_name: this.data.old_department_name,
      head_name: this.data.old_head_name,
      contact: this.data.old_department_number,
    });
  }
}
