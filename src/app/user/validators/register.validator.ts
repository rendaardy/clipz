import type { ValidatorFn } from "@angular/forms";

export class RegisterValidator {
  static match(controlName: string, matchingControlName: string): ValidatorFn {
    return (group) => {
      const control = group.get(controlName);
      const matchingControl = group.get(matchingControlName);

      if (control === null || matchingControl === null) {
        console.error("Form control cannot be found in the form group");
        return { controlNotFound: true };
      }

      const error = control.value === matchingControl.value
        ? null
        : { noMatch: true };
      matchingControl.setErrors(error);

      return error;
    };
  }
}
