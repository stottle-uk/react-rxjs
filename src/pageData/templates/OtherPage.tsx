import React, { ComponentType } from 'react';
import {
  Dictionary,
  List,
  PageEntry,
  PageTemplateData
} from '../models/pageEntry';
import CS5TemplateEntry from '../templateEntries/CS5TemplateEntry';
import P2PageEntry from '../templateEntries/P2TemplateEntry';
import NotFound from './NotFound';

class OtherPage extends React.Component<PageTemplateData, any> {
  componentDidMount(): void {
    console.log(this.props);
  }

  componentDidUpdate(
    prevProps: Readonly<PageTemplateData>,
    prevState: Readonly<any>
  ): void {
    console.log(this.props);
  }

  render() {
    const { pageEntry, lists } = this.props;

    return (
      <div>
        {pageEntry && pageEntry.entries && this.renderEntries(pageEntry, lists)}
        {/* <pre>{JSON.stringify(this.props, null, 2)}</pre> */}
      </div>
    );
  }

  private renderEntries(
    page: PageEntry,
    lists: Dictionary<List>
  ): JSX.Element[] {
    return page.entries.map(entry => {
      const Template = pageEntries[entry.template];
      const list = entry.type === 'ListDetailEntry' ? page.list : entry.list;

      if (list) {
        const foundList = lists[list.id];

        return (
          <div key={entry.id}>
            {Template ? <Template {...foundList} /> : <NotFound {...entry} />}
          </div>
        );
      }
      return <span key={entry.id} />;
    });
  }
}

export default OtherPage;

const pageEntries: { [hey: string]: ComponentType<List> } = {
  P2: P2PageEntry,
  CS5: CS5TemplateEntry
};
