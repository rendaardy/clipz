import {
  Component,
  inject,
  Input,
  Output,
  EventEmitter,
  type OnInit,
  type OnDestroy,
  type OnChanges,
} from '@angular/core';
import { FormGroup, FormControl, Validators } from "@angular/forms";

import { ModalService } from "../../services/modal.service";
import { ClipService } from "../../services/clip.service";

import type { Clip } from "../../models/clip.model";

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit, OnChanges, OnDestroy {
  #modalService = inject(ModalService);
  #clipService = inject(ClipService);

  editForm = new FormGroup({
    id: new FormControl("", { nonNullable: true }),
    title: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(3)],
    }),
  });

  showAlert = false;
  alertColor = "blue";
  alertMessage = "Please wait! Updating clip.";
  inSubmission = false;

  @Input()
  activeClip: Clip | null = null;

  @Output()
  update = new EventEmitter<Clip>();

  ngOnInit(): void {
    this.#modalService.register("editClip");
  }

  ngOnChanges(): void {
    this.inSubmission = false;
    this.showAlert = false;

    if (this.activeClip !== null) {
      this.editForm.setValue({
        id: this.activeClip.docId!,
        title: this.activeClip.title,
      });
    }
  }

  ngOnDestroy(): void {
    this.#modalService.unregister("editClip");
  }

  async submit(): Promise<void> {
    if (this.activeClip === null) {
      return;
    }

    this.inSubmission = true;
    this.showAlert = true;
    this.alertColor = "blue";
    this.alertMessage = "Please wait! Updating clip.";

    try {
      const { id: { value: id }, title: { value: title } } = this.editForm.controls;

      await this.#clipService.updateClip(id, title);

      this.alertColor = "green";
      this.alertMessage = "Success!";

      this.activeClip.title = title;
      this.update.emit(this.activeClip);
    } catch (error) {
      this.inSubmission = false;
      this.alertColor = "red";
      this.alertMessage = "Something went wrong! Please try again.";
      console.error(error);
    }
  }
}
