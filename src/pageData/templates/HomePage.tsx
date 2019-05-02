import React, { Component, ComponentType } from 'react';
import { Dictionary, Entry, List, PageTemplateData } from '../models/pageEntry';
import P2PageEntry from '../templateEntries/P2TemplateEntry';
import NotFound from './NotFound';

class HomePage extends Component<PageTemplateData, any> {
  componentDidMount(): void {
    console.log(this.props);
  }

  componentDidUpdate(
    prevProps: Readonly<PageTemplateData>,
    prevState: Readonly<any>
  ): void {
    // console.log(this.props);
  }

  render() {
    const { pageEntry, lists } = this.props;

    return (
      <div>
        <h1>{pageEntry.title}</h1>
        {pageEntry.entries && this.renderEntries(pageEntry.entries, lists)}
        {/* <pre>{JSON.stringify(this.props, null, 2)}</pre> */}
      </div>
    );
  }

  private renderEntries(
    entries: Entry[],
    lists: Dictionary<List>
  ): JSX.Element[] {
    return entries.map(entry => {
      if (entry.type === 'ListEntry') {
        const Template = pageEntries[entry.template];
        const list = lists[entry.list.id];

        return (
          <div key={entry.id}>
            {Template ? <Template {...list} /> : <NotFound {...entry} />}
          </div>
        );
      }
      return <span key={entry.id} />;
    });
  }
}

export default HomePage;

const pageEntries: { [hey: string]: ComponentType<List> } = {
  P2: P2PageEntry,
  '2:3 Poster (Standard)': P2PageEntry,
  '2:3 Poster (Block Hero)': P2PageEntry
};
