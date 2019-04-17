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
        <a href="/lancamentos-de-filmes" onClick={this.changeUrl}>
          Other
        </a>
        <a
          href="/filme/Mamma_Mia_Lá_Vamos_Nós_De_Novo_11947"
          onClick={this.changeUrl}
        >
          Film
        </a>
        <WatchMe router={this.props.router} />
      </div>
    );
  }
}

export default App;
