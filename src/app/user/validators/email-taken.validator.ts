import { Injectable, inject } from "@angular/core";
import { Auth, fetchSignInMethodsForEmail } from "@angular/fire/auth";

import type { AbstractControl, AsyncValidator, ValidationErrors } from "@angular/forms";

@Injectable()
export class EmailTaken implements AsyncValidator {
  #auth = inject(Auth);

  async validate(control: AbstractControl): Promise<ValidationErrors | null> {
    return fetchSignInMethodsForEmail(this.#auth, control.value)
      .then((listOfEmails) => listOfEmails.length > 0 ? { emailTaken: true } : null);
  }
}
