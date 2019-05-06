import React, { Component } from 'react';
import { Dictionary, Entry, List, PageTemplateData } from '../models/pageEntry';
import { pageTemplateEntries } from '../pageEntries';
import NotFound from './NotFound';

class HomePage extends Component<PageTemplateData, any> {
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
        const Template = pageTemplateEntries[entry.template];
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
