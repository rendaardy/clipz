import { Pipe, type PipeTransform } from '@angular/core';

@Pipe({
  name: 'fireTimestamp'
})
export class FireTimestampPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
