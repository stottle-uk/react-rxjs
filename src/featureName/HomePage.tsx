import React from 'react';
import { PageEntry } from './Testdata';

class HomePage extends React.Component<PageEntry, any> {
  componentDidUpdate(
    prevProps: Readonly<PageEntry>,
    prevState: Readonly<any>
  ): void {
    console.log(this.props);
  }

  render() {
    return (
      <div>
        <h1>Home Page</h1>
        {this.renderEntries(this.props.entries)}
        <pre>{JSON.stringify(this.props, null, 2)}</pre>
      </div>
    );
  }

  private renderEntries(entries: any[]): JSX.Element[] {
    return entries.map(entry => (
      <div key={entry.id}>
        <pre>{JSON.stringify(entry, null, 2)}</pre>
      </div>
    ));
  }
}

export default HomePage;
