import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'docSanitiser'
})
export class DocSanitiserPipe implements PipeTransform {

  transform(value: string, ...args: unknown[]): unknown {
    return value.replace(/\n/g, "<br/>");
  }

}
