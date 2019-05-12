import React, { Component } from 'react';
import { Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import { PageTemplateData } from '../pageData/models/pageEntry';
import { pagesDataService } from '../pageData/pageDataServices';
import RouterOutlet from '../router/RouterOutlet';

export interface PageProps {}

interface PageState {
  pageData: PageTemplateData;
}

class Page extends Component<PageProps, PageState> {
  destory$ = new Subject();

  componentDidMount(): void {
    pagesDataService.pageData$
      .pipe(
        takeUntil(this.destory$),
        tap(pageData =>
          this.setState({
            pageData
          })
        )
      )
      .subscribe();
  }

  componentWillUnmount(): void {
    this.destory$.next();
    this.destory$.complete();
  }

  render() {
    return this.state && this.state.pageData && !this.state.pageData.loading ? (
      <RouterOutlet {...this.state.pageData} />
    ) : (
      <div>loading!!!</div>
    );
  }
}

export default Page;
