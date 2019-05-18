import React, { Component } from 'react';
import './App.css';
import { PageTemplateData } from './pageData/models/pageEntry';
import Page from './pages/Page';
import Link from './router/Link';

export interface AppProps {}

interface AppState {
  routeName: string;
  pageData: PageTemplateData;
}

class App extends Component<AppProps, AppState> {
  render() {
    return (
      <div className="App">
        {this.renderHeader()}
        <Page />
      </div>
    );
  }

  private renderHeader(): React.ReactNode {
    return (
      <div>
        <Link to={'/'}>Home</Link>
        <span> - </span>
        <Link to={'/filmes-comedia/g'}>Category</Link>
        <span> - </span>
        <Link to={'/filmes-marvel'}>Marvel</Link>

        <hr />
      </div>
    );
  }
}

export default App;
