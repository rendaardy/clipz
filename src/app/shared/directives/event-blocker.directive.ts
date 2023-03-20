import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appEventBlocker]'
})
export class EventBlockerDirective {
  @HostListener("drop", ["$event"])
  @HostListener("dragover", ["$event"])
  handleEvent(event: DragEvent): void {
    event.preventDefault();
  }
}
