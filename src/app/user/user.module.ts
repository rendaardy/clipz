import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from "@angular/forms";

import { AuthModalComponent } from './auth-modal/auth-modal.component';
import { SharedModule } from "../shared/shared.module";
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

import { EmailTaken } from "./validators/email-taken.validator";

@NgModule({
  declarations: [
    AuthModalComponent,
    LoginComponent,
    RegisterComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
  ],
  providers: [EmailTaken],
  exports: [AuthModalComponent],
})
export class UserModule { }
