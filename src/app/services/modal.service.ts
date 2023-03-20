import { Injectable } from '@angular/core';

interface Modal {
  id: string;
  visible: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  #modals: Array<Modal> = [];

  register(id: string): void {
    this.#modals.push({ id, visible: false });
  }

  unregister(id: string): void {
    this.#modals = this.#modals.filter((modal) => modal.id !== id);
  }

  isOpen(id: string): boolean {
    return this.#modals.some((modal) => {
      if (modal.id === id) {
        return modal.visible;
      }

      return false;
    });
  }

  toggle(id: string): void {
    this.#modals = this.#modals
      .map((modal) => modal.id === id ? { ...modal, visible: !modal.visible } : modal);
  }
}
