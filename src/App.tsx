import React, { PureComponent } from 'react';
import './App.css';
import Link from './featureName/router/Link';
import RouterOutlet from './featureName/router/RouterOutlet';
import WatchMe from './featureName/router/WatchMe';

export interface AppProps {}

class App extends PureComponent<AppProps> {
  routerContainer(): React.ReactNode {
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
        <WatchMe>
          {this.routerContainer()}
          <RouterOutlet />
        </WatchMe>
      </div>
    );
  }
}

export default App;
