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
        location: (window.location.pathname + window.location.search).substring(
          1
        )
      });
    };
  }

  changeUrl = (e: any): void => {
    console.log(e.currentTarget.pathname.substring(1));

    e.preventDefault();
    const location = e.currentTarget.pathname.substring(1);
    this.pushState(location);
  };

  render() {
    return (
      <div className="App">
        <a href="home" onClick={this.changeUrl}>
          Home
        </a>
        -
        <a href="other" onClick={this.changeUrl}>
          Other
        </a>
        <WatchMe defaultPage={'home'} location={this.state.location} />
      </div>
    );
  }

  private pushState(location: string) {
    history.pushState({}, window.document.title, location);
    this.setState({ location });
  }
}

export default App;
