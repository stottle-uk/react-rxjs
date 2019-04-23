import React, { Component } from 'react';
import './App.css';
import { AppRouter } from './featureName/AppRouter';
import { PageEntry } from './featureName/Testdata';
import WatchMe from './featureName/WatchMe';

export interface AppProps {
  router: AppRouter<PageEntry>;
}

class App extends Component<AppProps, any> {
  changeUrl = (e: any): void => {
    e.preventDefault();
    const location = e.currentTarget.pathname;
    this.props.router.go(location);
  };

  render() {
    return (
      <div className="App">
        <a href="/" onClick={this.changeUrl}>
          Home
        </a>
        -
        <a href="/filmes-comedia/g" onClick={this.changeUrl}>
          Category
        </a>
        <WatchMe router={this.props.router} />
      </div>
    );
  }
}

export default App;
