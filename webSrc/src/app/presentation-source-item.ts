import {Type} from "@angular/core";

export class PresentationSourceItem {
  constructor(public component: Type<any>, public payload: any) {
  }
}
