import React, { Component } from 'react';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import './App.css';
import { Sitemap } from './pageData/models/config';
import { PageEntry } from './pageData/models/pageEntry';
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
  }

  private mapSitemapToRoute(
    sitemap: Sitemap[]
  ): RouterConfigRoute<PageEntry>[] {
    return sitemap.map(s => ({
      name: s.title,
      path: s.path,
      template: pageEntries[s.template]
    }));
  }

  private onRouteChange(path: RouterConfigRoute<PageEntry>): void {
    this.setState({
      routeName: path.path
    });
  }

  private getRouteData(path: string): Observable<PageEntry> {
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
