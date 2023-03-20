import { Component, inject, OnInit, OnDestroy } from '@angular/core';

import { ModalService } from "../../services/modal.service";

@Component({
  selector: 'app-auth-modal',
  templateUrl: './auth-modal.component.html',
  styleUrls: ['./auth-modal.component.css']
})
export class AuthModalComponent implements OnInit, OnDestroy {
  #modalService = inject(ModalService);

  ngOnInit(): void {
    this.#modalService.register("auth");
  }

  ngOnDestroy(): void {
    this.#modalService.unregister("auth");
  }
}
