import {Component, EventEmitter, Input, OnInit} from '@angular/core';
import {WorkItem} from './work-item';
import {catchError, delay, switchMap, tap} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {PresentationSource} from "../presentation-source";
import {WebViewApi} from "../web-view-api";

class PreFetchResponse {
  constructor(readonly identifier: string, readonly message: string) {}
}

@Component({
  selector: 'app-work-items',
  template: `
    <div>
      <button (click)="reloadPageContent()">Reload items</button>
      <input style="margin-left: 20px; width:200px" type="search" placeholder="Filter text" [(ngModel)]="filterTerm"/>
    </div>
    <div class="results" infinite-scroll (scrolled)="onScrolledDown()" (scrolledUp)="onScrolledUp()">
      <div *ngFor="let workItem of getItemsToShow()">
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
  filterTerm: string  = "";

  getItemsToShow(): WorkItem[] {
    return this.workItems.filter(value => this.shouldFilter(value));
  }

  shouldFilter(item: WorkItem) {
    return item.title.toLocaleLowerCase().includes(this.filterTerm.toLocaleLowerCase()) ||
      item.body.toLocaleLowerCase().includes(this.filterTerm.toLocaleLowerCase());
  }

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.updatePageContent();
  }

  updatePageContent() {
    this.getWorkItems().subscribe(items => items.forEach(
      item => {
        this.workItems.push(item);
      }
    ));
  }

  onScrolledDown() {
    this.currentPage++;
    this.updatePageContent();
  }

  onScrolledUp() {}

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

  reloadPageContent() {
    this.currentPage = 0;
    this.workItems = [];
    this.updatePageContent();
  }
}
