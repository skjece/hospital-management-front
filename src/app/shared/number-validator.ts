import {
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';

export class numberValidators {
  static isVaidContact(control: AbstractControl): ValidationErrors | null {
    let input_val = JSON.stringify(control.value);
    let initial_digit = input_val.substr(0, 1);
    // console.log("inside numberValidator:"+input_val+"::initial_digit"+initial_digit);

    if (input_val == 'null' || input_val == 'undefined' || input_val == '')
      return { required: true };
    else if (input_val.length < 10) return { minlength: true };
    else if (input_val.length > 10) return { maxlength: true };
    else if (
      !(
        initial_digit == '6' ||
        initial_digit == '7' ||
        initial_digit == '8' ||
        initial_digit == '9'
      )
    )
      return { practicalnumber: true };
    else return null;
  }
}
