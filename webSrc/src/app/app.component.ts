import {Component, ComponentFactoryResolver, Directive, HostListener, OnInit, ViewChild} from '@angular/core';
import {PresentationSourceDirective} from "./presentation-source.directive";
import {DocumentationComponent} from "./documentation/documentation.component";
import {HttpClient} from "@angular/common/http";
import {PresentationSourceItem} from "./presentation-source-item";
import {PresentationSource} from "./presentation-source";
import {WorkItem} from "./work-items/work-item";
import {WorkItemsComponent} from "./work-items/work-items.component";
import {ExpertsComponent} from "./experts/experts.component";

@Component({
  selector: 'app-root',
  template: `
    <div>
      <ng-template appPresentationSource></ng-template>
    </div>
  `,
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  @ViewChild(PresentationSourceDirective) sourceContainer: PresentationSourceDirective;

  vscodeApi: object;

  constructor(private componentFactoryResolver: ComponentFactoryResolver) {
  }

  @HostListener('window:message', ['$event'])
  onMessage(event) {
    const message = event.data; // The json data that the extension sent
    console.log(JSON.stringify(message));
    switch (message.command) {
      case 'search': {
        let payload: any = {};
        payload.connectorUrl = message.serverHost;
        payload.fileUri = message.folderUri;
        this.loadComponent(message.resource, payload);
        break;
      }
      case 'findDocumentation': {
        let payload: any = {};
        payload.connectorUrl = message.serverHost;
        payload.fileUri = message.folderUri;
        payload.searchTerm = message.queryTerm;
        this.loadComponent('documentationQuestion', payload);
        break;
      }
    }
  }

  private loadComponent(resourceName: string, payload: any) {
    switch (resourceName) {
      case 'documentationQuestion': {
        let presentationSourceItem = new PresentationSourceItem(DocumentationComponent, payload);
        this.loadIntoCurrentView(presentationSourceItem, payload);
        break;
      }
      case 'workItems': {
        let presentationSourceItem = new PresentationSourceItem(WorkItemsComponent, payload);
        this.loadIntoCurrentView(presentationSourceItem, payload);
        break;
      }
      case 'experts': {
        let presentationSourceItem = new PresentationSourceItem(ExpertsComponent, payload);
        this.loadIntoCurrentView(presentationSourceItem, payload);
        break;
      }
    }
  }

  private loadIntoCurrentView(presentationSourceItem: PresentationSourceItem, payload: any) {
    let componentFactory = this.componentFactoryResolver.resolveComponentFactory(presentationSourceItem.component);
    const viewContainerRef = this.sourceContainer.viewContainerRef;
    viewContainerRef.clear();
    const componentRef = viewContainerRef.createComponent(componentFactory);
    (<PresentationSource>componentRef.instance).payload = payload;
  }

  ngOnInit(): void {
    // @ts-ignore
    this.vscodeApi = acquireVsCodeApi();
  }
}
