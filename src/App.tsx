import React, { Component } from 'react';
import './App.css';
import WatchMe from './featureName/WatchMe';

class App extends Component<any, any> {
  state = {
    location: (window.location.pathname + window.location.search).substring(1)
  };

  componentDidMount(): void {
    window.onpopstate = event => {
      this.setState({
        location: (window.location.pathname + window.location.search).substring(1)
      });
    };
  }

  changeUrl = (e: any): void => {
    const rnd = `someUrl${Math.random()}`;
    history.pushState({}, window.document.title, rnd);
    this.setState({
      location: rnd
    });
  };

  render() {
    return (
      <div className="App">
        <a onClick={this.changeUrl}>ClickMe</a>
        <WatchMe interval={1000} location={this.state.location} />
      </div>
    );
  }
}

export default App;
