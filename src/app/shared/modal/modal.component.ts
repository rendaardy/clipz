import { Component, inject, Input, ElementRef, type OnInit, type OnDestroy } from '@angular/core';

import { ModalService } from "../../services/modal.service";

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit, OnDestroy {
  @Input()
  modalId = "";

  modalService = inject(ModalService);
  #el = inject(ElementRef);

  ngOnInit(): void {
    document.body.appendChild(this.#el.nativeElement);
  }

  ngOnDestroy(): void {
    document.body.removeChild(this.#el.nativeElement);
  }
}
