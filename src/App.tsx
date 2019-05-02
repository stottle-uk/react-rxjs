import React, { Component } from 'react';
import { combineLatest, interval, Observable } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';
import './App.css';
import { Sitemap } from './pageData/models/config';
import { PageTemplateData } from './pageData/models/pageEntry';
import {
  configService,
  dataService,
  router
} from './pageData/pageDataServices';
import { pageEntries } from './pageData/pageEntries';
import Link from './router/Link';
import Router from './router/Router';
import RouterOutlet from './router/RouterOutlet';
import { RouterConfigRoute } from './router/types/router';

export interface AppProps {}

interface AppState {
  routeName: string;
}

class App extends Component<AppProps, AppState> {
  state = {
    routeName: ''
  };

  componentDidMount(): void {
    configService
      .getConfig()
      .pipe(
        map(config => config.sitemap),
        map(sitemap => this.mapSitemapToRoute(sitemap)),
        tap(routes => router.addRoutes(routes))
      )
      .subscribe();

    // this.testMe();
  }

  private testMe() {
    const timer1$ = interval(1000).pipe(map(count => `timer 1 - ${count}`));
    const timer2$ = interval(2000).pipe(map(count => `timer 2 - ${count}`));
    combineLatest(timer1$, timer2$)
      .pipe(
        take(12),
        tap(console.log)
      )
      .subscribe();
  }

  private mapSitemapToRoute(
    sitemap: Sitemap[]
  ): RouterConfigRoute<PageTemplateData>[] {
    return sitemap.map(s => ({
      name: s.title,
      path: s.path,
      template: pageEntries[s.template]
    }));
  }

  private onRouteChange(path: RouterConfigRoute<PageTemplateData>): void {
    this.setState({
      routeName: path.path
    });
  }

  private getRouteData(path: string): Observable<PageTemplateData> {
    return dataService.getHomePageData(path);
  }

  render() {
    return (
      <div className="App">
        <Router
          router={router}
          getRouteData={this.getRouteData}
          onRouteChange={this.onRouteChange.bind(this)}
        >
          {this.renderHeader()}
          <RouterOutlet />
        </Router>
      </div>
    );
  }

  private renderHeader(): React.ReactNode {
    return (
      <div>
        <pre>{this.state.routeName}</pre>
        <Link to={'/'}>Home</Link>
        <span> - </span>
        <Link to={'/filmes-comedia/g'}>Category</Link>
        <hr />
      </div>
    );
  }
}

export default App;
