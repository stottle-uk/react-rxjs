import React, { PureComponent } from 'react';
import './App.css';
import Link from './featureName/router/Link';
import WatchMe from './featureName/router/WatchMe';

export interface AppProps {}

class App extends PureComponent<AppProps> {
  routerContainer<T>(Page: React.ComponentType<T>, data: T): JSX.Element {
    return (
      <div>
        <Link to={'/'}>Home</Link>
        <span> - </span>
        <Link to={'/filmes-comedia/g'}>Category</Link>
        <hr />
        <Page {...data} />
      </div>
    );
  }
  render() {
    return (
      <div className="App">
        <WatchMe container={this.routerContainer} />
      </div>
    );
  }
}

export default App;
