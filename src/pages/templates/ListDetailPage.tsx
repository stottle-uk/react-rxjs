import React from 'react';
import {
  Dictionary,
  List,
  PageEntry,
  PageTemplateData
} from '../../pageData/models/pageEntry';
import { pageTemplateEntries } from '../pageEntries';
import NotFound from './NotFound';

class ListDetailPage extends React.Component<PageTemplateData, any> {
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
      const Template = pageTemplateEntries[entry.template];
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

export default ListDetailPage;
