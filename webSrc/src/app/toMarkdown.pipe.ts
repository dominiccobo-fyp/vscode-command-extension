import { Pipe, PipeTransform } from '@angular/core';
import Showdown from 'showdown';
@Pipe({
  name: 'toMarkdown'
})
export class ToMarkdownPipe implements PipeTransform {

  transform(value: string, ...args: unknown[]): string {
    return new Showdown.Converter().makeHtml(value).replace(/<pre>/g, `
    <div style="white-space: pre-wrap !important; width: 99% !important;">`);
  }

}
