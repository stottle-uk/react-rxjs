import React, { PureComponent } from 'react';
import './App.css';
import { router } from './dataService';
import Link from './featureName/router/Link';
import Router from './featureName/router/Router';
import RouterOutlet from './featureName/router/RouterOutlet';

export interface AppProps {}

class App extends PureComponent<AppProps> {
  renderHeader(): React.ReactNode {
    return (
      <div>
        <Link to={'/'}>Home</Link>
        <span> - </span>
        <Link to={'/filmes-comedia/g'}>Category</Link>
        <hr />
      </div>
    );
  }

  render() {
    return (
      <div className="App">
        <Router router={router}>
          {this.renderHeader()}
          <RouterOutlet />
        </Router>
      </div>
    );
  }
}

export default App;
