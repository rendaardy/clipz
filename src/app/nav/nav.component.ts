import { Component, inject } from '@angular/core';

import { ModalService } from "../services/modal.service";
import { AuthService } from "../services/auth.service";

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent {
  modalService = inject(ModalService);
  authService = inject(AuthService);

  openModal(event: Event): void {
    event.preventDefault();

    this.modalService.toggle("auth");
  }

  async logout(event: Event): Promise<void> {
    event.preventDefault();

    await this.authService.signout();
  }
}
