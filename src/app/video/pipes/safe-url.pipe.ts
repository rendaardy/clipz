import { Pipe, inject, type PipeTransform } from '@angular/core';
import { DomSanitizer, type SafeUrl } from "@angular/platform-browser";

@Pipe({
  name: 'safeUrl'
})
export class SafeUrlPipe implements PipeTransform {
  #sanitizer = inject(DomSanitizer);

  transform(value: string): SafeUrl {
    return this.#sanitizer.bypassSecurityTrustUrl(value);
  }
}
