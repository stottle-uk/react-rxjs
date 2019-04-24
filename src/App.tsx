import React, { Component } from 'react';
import './App.css';
import { PageEntry } from './featureName/models/pageEntry';
import { AppRouter } from './featureName/router/AppRouter';
import WatchMe from './featureName/router/WatchMe';

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
