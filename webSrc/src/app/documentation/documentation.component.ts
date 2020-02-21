import {Component, Input, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {catchError, delay, filter, switchMap, tap} from "rxjs/operators";
import {Documentation} from "./documentation";
import {PresentationSource} from "../presentation-source";
import {WebViewApi} from "../web-view-api";

@Component({
  selector: 'app-documentation',
  template: `
    <div>
      <button (click)="reloadContent()">Reload items</button>
      <input style="margin-left: 20px; width:200px" type="search" placeholder="Filter text" [(ngModel)]="filterTerm"/>
    </div>
    <div class="results" infinite-scroll (scrolled)="onScrolledDown()" (scrolledUp)="onScrolledUp()">
      <div *ngFor="let doc of getItemsToShow()">
        <h1><a href="{{doc.link}}">{{ doc.title }}</a></h1>
        <div><span *ngFor="let topic of doc.topic">{{topic.topic}} | </span></div>
        <div [innerHTML]="doc.content | docSanitiser"></div>
      </div>
    </div>
  `,
  styles: []
})
export class DocumentationComponent implements OnInit, PresentationSource {

  @Input() payload: any;
  @Input() containerAPI: WebViewApi;

  currentPage = 0;
  documentation: Documentation[] = [];
  currentIdentifier: PreFetchResponse;
  filterTerm: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.updatePageContent();
  }

  private updatePageContent() {
    this.getDocumentationItems().subscribe(items => items.forEach(item => this.documentation.push(item)));
  }

  onScrolledDown() {
    this.currentPage++;
    this.updatePageContent();
  }

  onScrolledUp() {}

  private fetchDocumentation(): Observable<Documentation[]> {
    return this.queueQueryRequest()
      .pipe(
        catchError(err => {
          this.containerAPI.showErrorNotification("Could not queue query request for documentation.", err);
          return [];
        }),
        delay(2000),
        switchMap((value) => {
            this.currentIdentifier = value;
            return this.fetchResults(value);
          }
        ));
  }

  private queueQueryRequest() {
    return this.http.get<PreFetchResponse>(`http://${(this.getUrl())}/documentation?uri=${(this.getFileUri())}&query=${(this.getSearchTerm())}`)
  }

  private getSearchTerm() {
    return this.payload.searchTerm;
  }

  private getFileUri() {
    return this.payload.fileUri;
  }

  private getUrl() {
    return this.payload.connectorUrl;
  }

  fetchResults(value: PreFetchResponse) {
    return this.http.get<Documentation[]>(`http://${this.getUrl()}/documentation/${value.identifier}?page=${this.currentPage}`).pipe(
      catchError((err) => {
        this.containerAPI.showErrorNotification(`Could not retrieve items from doc aggregate ${value.identifier}`, err);
        return [];
      })
    );
  }

  getDocumentationItems(): Observable<Documentation[]> {
    if (this.currentIdentifier !== undefined) {
      return this.fetchResults(this.currentIdentifier);
    } else {
      return this.fetchDocumentation();
    }
  }

  reloadContent() {
    this.currentPage = 0;
    this.documentation = [];
    this.updatePageContent();
  }

  getItemsToShow() {
    return this.documentation.filter(item => item.containsFilterTerm(this.filterTerm))
  }
}

class PreFetchResponse {
  constructor(readonly identifier: string, readonly message: string) {}
}
