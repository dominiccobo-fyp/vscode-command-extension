import {Directive, ViewContainerRef} from '@angular/core';

@Directive({
  selector: '[appPresentationSource]'
})
export class PresentationSourceDirective {

  constructor(public viewContainerRef: ViewContainerRef) { }

}
