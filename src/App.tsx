import React, { Component } from 'react';
import { of } from 'rxjs';
import './App.css';
import { AppRouter } from './featureName/AppRouter';
import HomePage from './featureName/HomePage';
import * as testData from './featureName/homePageData';
import OtherPage from './featureName/OtherPage';
import { getHomePageData } from './featureName/pageData/getHomePageData';
import { PageEntry } from './featureName/Testdata';
import WatchMe from './featureName/WatchMe';

class App extends Component<any, any> {
  private router = new AppRouter<PageEntry>({
    defaultRoute: '',
    routes: [
      {
        name: 'Home',
        path: '/',
        template: HomePage,
        data: () => getHomePageData()
      },
      {
        name: 'Home',
        path: '/home',
        template: HomePage,
        data: () => of(testData.homePageData)
      },
      {
        name: 'Other',
        path: '/other',
        template: OtherPage,
        data: () => of(testData.otherPageData)
      }
    ]
  });

  changeUrl = (e: any): void => {
    console.log(e.currentTarget.pathname);

    e.preventDefault();
    const location = e.currentTarget.pathname;
    this.router.go(location);
  };

  render() {
    return (
      <div className="App">
        <a href="/" onClick={this.changeUrl}>
          Home
        </a>
        -
        <a href="other" onClick={this.changeUrl}>
          Other
        </a>
        <WatchMe router={this.router} />
      </div>
    );
  }
}

export default App;
