import {Component, Input, OnInit} from '@angular/core';
import {Expert} from "../experts/expert";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {delay, switchMap, tap} from "rxjs/operators";
import {Documentation} from "./documentation";
import {PresentationSource} from "../presentation-source";

@Component({
  selector: 'app-documentation',
  template: `
    <div class="results" infinite-scroll (scrolled)="onScrolledDown()" (scrolledUp)="onScrolledUp()">
      <div *ngFor="let doc of documentation">
        <h1><a href="{{doc.link}}">{{ doc.title }}</a></h1>
        <div><span *ngFor="let topic of doc.topic">{{topic}} | </span></div>
        <div [innerHTML]="doc.content | docSanitiser"></div>
      </div>
    </div>
  `,
  styles: []
})
export class DocumentationComponent implements OnInit, PresentationSource {

  @Input() payload: any;

  currentPage = 0;
  documentation: Documentation[] = [];
  currentIdentifier: PreFetchResponse;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.updatePageContent();
  }

  private updatePageContent() {
    this.getDocumentationItems().subscribe(items => items.forEach(
      item => {
        this.documentation.push(item);
      }
    ));
  }

  onScrolledDown() {
    console.log('scrolled down');
    this.currentPage++;
    this.updatePageContent();
  }

  onScrolledUp() {
    console.log('scrolled up');
  }

  private fetchDocumentation(): Observable<Documentation[]> {
    return this.queueQueryRequest()
      .pipe(
        tap(result => {
          console.log(result.identifier);
        }),
        delay(2000),
        switchMap((value) => {
            this.currentIdentifier = value;
            return this.fetchResults(value);
          }
        ));
  }

  private queueQueryRequest() {
    return this.http.get<PreFetchResponse>(`http://${(this.getUrl())}/documentation?uri=${(this.getFileUri())}&query=${(this.getSearchTerm())}`);
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
      tap(result => {
        console.log(result);
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
}

class PreFetchResponse {
  constructor(readonly identifier: string, readonly message: string) {}
}
