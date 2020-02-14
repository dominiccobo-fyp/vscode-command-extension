import {Component, Input, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {delay, switchMap, tap} from "rxjs/operators";
import {Expert, ContactDetails, ExpertTopic} from "./expert";

@Component({
  selector: 'app-experts',
  template: `
    <div class="results" infinite-scroll (scrolled)="onScrolledDown()" (scrolledUp)="onScrolledUp()">
      <div *ngFor="let expert of experts">
        <h1>{{expert.expertName}}</h1>
        <h4>Contact</h4>
        <ul>
          <li *ngFor="let detail of expert.contactDetails">
            {{ detail.meansName }} - {{ detail.details }}
          </li>
        </ul>
        <h4>Expert on:</h4>
        <ul>
          <li *ngFor="let topic of expert.expertTopics">
            {{ topic.expertTopic }} - {{ topic.details }}
          </li>
        </ul>
      </div>
    </div>
  `,
  styles: []
})
export class ExpertsComponent implements OnInit {

  @Input() fileUri: string;
  @Input() connectorUrl: string;

  currentPage = 0;
  experts: Expert[] = [];
  currentIdentifier: PreFetchResponse;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.updatePageContent();
  }

  private updatePageContent() {
    this.getWorkItems().subscribe(items => items.forEach(
      item => {
        this.experts.push(item);
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

  private fetchWorkItems(): Observable<Expert[]> {
    return this.queueQueryRequest()
      .pipe(
        tap(result => {
          console.log(result.identifier);
        }),
        delay(1000),
        switchMap((value) => {
            this.currentIdentifier = value;
            return this.fetchResults(value);
          }
        ));
  }

  private queueQueryRequest() {
    return this.http.get<PreFetchResponse>(`http://${this.connectorUrl}/experts?uri=${this.fileUri}`);
  }

  fetchResults(value: PreFetchResponse) {
    return this.http.get<Expert[]>(`http://${this.connectorUrl}/experts/${value.identifier}?page=${this.currentPage}`).pipe(
      tap(result => {
        console.log(result);
      })
    );
  }

  getWorkItems(): Observable<Expert[]> {
    if (this.currentIdentifier !== undefined) {
      return this.fetchResults(this.currentIdentifier);
    } else {
      return this.fetchWorkItems();
    }
  }
}

class PreFetchResponse {
  constructor(readonly identifier: string, readonly message: string) {}
}
