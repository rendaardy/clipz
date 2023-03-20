import { Component, inject } from '@angular/core';

import { AuthService } from "../../services/auth.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  showAlert = false;
  alertMessage = "Please wait! We'll be logging you in.";
  alertColor = "blue";
  inSubmission = false;

  credentials = {
    email: "",
    password: "",
  };

  #auth = inject(AuthService);

  async login(): Promise<void> {
    this.showAlert = true;
    this.alertMessage = "Please wait! We'll be logging you in.";
    this.alertColor = "blue";
    this.inSubmission = true;

    try {
      await this.#auth.signin(this.credentials.email, this.credentials.password);

      this.alertMessage = "Success! You've logged in";
      this.alertColor = "green";
    } catch (error) {
      console.error(error);

      this.alertMessage = "An unexpected error occurred! Please try again later.";
      this.alertColor = "red";
      this.inSubmission = false;
    }
  }
}
