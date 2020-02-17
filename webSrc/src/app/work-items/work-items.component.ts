import {Component, EventEmitter, Input, OnInit} from '@angular/core';
import {WorkItem} from './work-item';
import {catchError, delay, switchMap, tap} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {environment} from '../../environments/environment';
import {PresentationSource} from "../presentation-source";
import {WebViewApi} from "../web-view-api";

class PreFetchResponse {
  constructor(readonly identifier: string, readonly message: string) {}
}

@Component({
  selector: 'app-work-items',
  template: `
    <div class="results" infinite-scroll (scrolled)="onScrolledDown()" (scrolledUp)="onScrolledUp()">
      <div *ngFor="let workItem of workItems">
        <h1>{{workItem.title}}</h1>
        <div [innerHTML]="workItem.body | toMarkdown "></div>
      </div>
    </div>
  `,
  styles: []
})
export class WorkItemsComponent implements OnInit, PresentationSource {

  @Input() payload: any;
  @Input() containerAPI: WebViewApi;

  currentPage = 0;
  workItems: WorkItem[] = [];
  currentIdentifier: PreFetchResponse;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.updatePageContent();
  }

  private updatePageContent() {
    this.getWorkItems().subscribe(items => items.forEach(
      item => {
        this.workItems.push(item);
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

  private fetchWorkItems(): Observable<WorkItem[]> {
    return this.http.get<PreFetchResponse>(`http://${this.getUrl()}/workItems?uri=${(this.getFileUri())}`)
      .pipe(
        catchError(err  => {
          this.containerAPI.showErrorNotification("Could queue request for work items.", err);
          return [];
        }),
        delay(2000),
        switchMap((value) => {
            this.currentIdentifier = value;
            return this.fetchResults(value);
          }
        )
      );
  }

  private getFileUri() {
    return this.payload.fileUri;
  }

  fetchResults(value: PreFetchResponse) {
    return this.http.get<WorkItem[]>(`http://${(this.getUrl())}/workItems/${value.identifier}?page=${this.currentPage}`)
      .pipe(
        catchError(err => {
          this.containerAPI.showErrorNotification(`Failed to retrieve work items from aggregate ${value.identifier}`, err);
          return of([]);
        })
      );
  }

  private getUrl() {
    return this.payload.connectorUrl;
  }

  getWorkItems(): Observable<WorkItem[]> {
    if (this.currentIdentifier !== undefined) {
      return this.fetchResults(this.currentIdentifier);
    } else {
      return this.fetchWorkItems();
    }
  }
}
