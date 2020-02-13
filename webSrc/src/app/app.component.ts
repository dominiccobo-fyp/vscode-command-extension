import {Component, ComponentFactoryResolver, HostListener, OnInit, ViewChild} from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <div>
      <app-work-items [fileUri]="fileUri" [connectorUrl]="host" *ngIf="resource ==='workItems'">Loading app work items</app-work-items>
    </div>
  `,
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Main page';
  vscodeApi: object;
  resource: string;
  fileUri: string;
  host: string;

  @HostListener('window:message', ['$event'])
  onMessage(event) {
    const message = event.data; // The json data that the extension sent

    // TODO:
    console.log('test!');
    switch (message.command) {
      case 'search':
        this.host = message.serverHost;
        this.resource =  message.resource;
        this.fileUri = message.folderUri;
        break;

      case 'findDocumentation': {
        const serverHost = message.serverHost;
        const folderUri = message.folderUri;
        const queryTerm = message.queryTerm;
        console.log(serverHost);
        console.log(queryTerm);
        console.log(folderUri);
        break;
      }
    }
  }

  ngOnInit(): void {
    // @ts-ignore
    this.vscodeApi = acquireVsCodeApi();
  }
}
