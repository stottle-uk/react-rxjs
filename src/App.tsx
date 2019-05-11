import React, { Component } from 'react';
import './App.css';
import { PageTemplateData } from './pageData/models/pageEntry';
import Page from './pageData/Page';
import { pagesDataService, router } from './pageData/pageDataServices';
import Link from './router/Link';
import Router from './router/Router';
import { RouterConfigRoute } from './router/types/router';

export interface AppProps {}

interface AppState {
  routeName: string;
  pageData: PageTemplateData;
}

class App extends Component<AppProps, AppState> {
  private onRouteChange(route: RouterConfigRoute<PageTemplateData>): void {
    pagesDataService.getPageData(route.path);
  }

  render() {
    return (
      <div className="App">
        <Router router={router} onRouteFound={this.onRouteChange.bind(this)}>
          {this.renderHeader()}
          <Page />
        </Router>
      </div>
    );
  }

  private renderHeader(): React.ReactNode {
    return (
      <div>
        <Link to={'/'}>Home</Link>
        <span> - </span>
        <Link to={'/filmes-comedia/g'}>Category</Link>
        <hr />
      </div>
    );
  }
}

export default App;
