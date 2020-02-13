import {Component, EventEmitter, Input, OnInit} from '@angular/core';
import {WorkItem} from './work-item';
import {delay, switchMap, tap} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';

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
export class WorkItemsComponent implements OnInit {

  @Input() fileUri: string;
  @Input() connectorUrl: string;

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
    return this.http.get<PreFetchResponse>(`http://${this.connectorUrl}/workItems?uri=${this.fileUri}`)
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

  fetchResults(value: PreFetchResponse) {
    return this.http.get<WorkItem[]>(`http://${this.connectorUrl}/workItems/${value.identifier}?page=${this.currentPage}`).pipe(
      tap(result => {
        console.log(result);
      })
    );
  }

  getWorkItems(): Observable<WorkItem[]> {
    if (this.currentIdentifier !== undefined) {
      return this.fetchResults(this.currentIdentifier);
    } else {
      return this.fetchWorkItems();
    }
  }
}
