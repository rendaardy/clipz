import { Component, inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from "@angular/forms";

import { AuthService } from "../../services/auth.service";
import { RegisterValidator } from "../validators/register.validator";
import { EmailTaken } from "../validators/email-taken.validator";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  showAlert = false;
  alertMessage = "Please wait! Your account is being created.";
  alertColor = "blue";
  inSubmission = false;

  #emailTaken = inject(EmailTaken);
  #auth = inject(AuthService);

  registerForm = new FormGroup({
    name: new FormControl("", [Validators.required, Validators.minLength(3)]),
    email: new FormControl("", [
      Validators.required,
      Validators.email,
    ], [
      this.#emailTaken.validate.bind(this.#emailTaken),
    ]),
    age: new FormControl<number | null>(null, [
      Validators.required,
      Validators.min(18),
      Validators.max(120),
    ]),
    password: new FormControl("", [
      Validators.required,
      Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm),
    ]),
    confirmPassword: new FormControl("", [Validators.required]),
    phoneNumber: new FormControl("", [
      Validators.required,
      Validators.minLength(13),
      Validators.maxLength(13),
    ]),
  }, [RegisterValidator.match("password", "confirmPassword")]);

  async register(): Promise<void> {
    this.showAlert = true;
    this.alertMessage = "Please wait! Your account is being created.";
    this.alertColor = "blue";
    this.inSubmission = true;

    const { name, email, password, age, phoneNumber } = this.registerForm.value;

    try {
      await this.#auth.createUser({
        name: name!,
        email: email!,
        password: password!,
        age: age!,
        phoneNumber: phoneNumber!,
      });

      this.alertMessage = "Success! Your account has been created.";
      this.alertColor = "green";
    } catch (error) {
      console.error(error);

      this.alertMessage = "An unexpected error occurred. Please try again later.";
      this.alertColor = "red";
      this.inSubmission = false;
    }
  }
}
