import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { WorkItemsComponent } from './work-items/work-items.component';
import { ToMarkdownPipe } from './toMarkdown.pipe';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { ExpertsComponent } from './experts/experts.component';
import { DocumentationComponent } from './documentation/documentation.component';
import { DocSanitiserPipe } from './doc-sanitiser.pipe';
import { PresentationSourceDirective } from './presentation-source.directive';


@NgModule({
  declarations: [
    AppComponent,
    WorkItemsComponent,
    ToMarkdownPipe,
    ExpertsComponent,
    DocumentationComponent,
    DocSanitiserPipe,
    PresentationSourceDirective
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    InfiniteScrollModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
