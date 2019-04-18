import React, { ComponentType } from 'react';
import NotFound from './NotFound';
import P2PageEntry from './templateEntries/P2TemplateEntry';
import { Entry, PageEntry } from './Testdata';

class HomePage extends React.Component<PageEntry, any> {
  componentDidMount(): void {
    console.log(this.props);
  }

  componentDidUpdate(
    prevProps: Readonly<PageEntry>,
    prevState: Readonly<any>
  ): void {
    console.log(this.props);
  }

  render() {
    return (
      <div>
        <h1>{this.props.title}</h1>
        {this.props.entries && this.renderEntries(this.props.entries)}
        {/* <pre>{JSON.stringify(this.props, null, 2)}</pre> */}
      </div>
    );
  }

  private renderEntries(entries: Entry[]): JSX.Element[] {
    return entries.map(entry => {
      const Template = pageEntries[entry.template]
        ? pageEntries[entry.template]
        : NotFound;
      return (
        <div key={entry.id}>
          <Template {...entry} />
        </div>
      );
    });
  }
}

export default HomePage;

const pageEntries: { [hey: string]: ComponentType<any> } = {
  P2: P2PageEntry,
  '2:3 Poster (Standard)': P2PageEntry,
  '2:3 Poster (Block Hero)': P2PageEntry
};
