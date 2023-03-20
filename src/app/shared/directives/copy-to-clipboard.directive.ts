import { Directive, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appCopyToClipboard]'
})
export class CopyToClipboardDirective {
  @Input()
  appCopyThis?: string;

  @HostListener("click", ["$event"])
  async handleClick(event: Event): Promise<void> {
    event.preventDefault();

    if (!this.appCopyThis) {
      return;
    }

    const url = `${window.location.origin}/clip/${this.appCopyThis}`;
    await navigator.clipboard.writeText(url);

    alert("url has been copied to clipboard");
  }
}
