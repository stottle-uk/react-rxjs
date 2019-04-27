import React, { Component } from 'react';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import './App.css';
import { configService, dataService, router } from './dataService';
import { Sitemap } from './featureName/models/config';
import { PageEntry } from './featureName/models/pageEntry';
import Link from './featureName/router/Link';
import Router from './featureName/router/Router';
import RouterOutlet from './featureName/router/RouterOutlet';
import { RouterConfigRoute } from './featureName/router/types/router';
import { pageEntries } from './pageEntries';

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
