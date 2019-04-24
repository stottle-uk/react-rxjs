import React, { ComponentType } from 'react';
import { List, PageEntry } from '../models/pageEntry';
import CS5TemplateEntry from '../templateEntries/CS5TemplateEntry';
import P2PageEntry from '../templateEntries/P2TemplateEntry';
import NotFound from './NotFound';

class OtherPage extends React.Component<PageEntry, any> {
  componentDidMount(): void {
    console.log(this.props);
  }

  componentDidUpdate(
    prevProps: Readonly<PageEntry>,
    prevState: Readonly<any>
  ): void {
    // console.log(this.props);
  }

  render() {
    console.log(this.props);

    return (
      <div>
        {this.props.entries && this.renderEntries(this.props)}
        {/* <pre>{JSON.stringify(this.props, null, 2)}</pre> */}
      </div>
    );
  }

  private renderEntries(page: PageEntry): JSX.Element[] {
    return page.entries.map(entry => {
      const Template = pageEntries[entry.template];
      const list = entry.type === 'ListDetailEntry' ? page.list : entry.list;

      return (
        <div key={entry.id}>
          {Template ? <Template {...list} /> : <NotFound {...entry} />}
        </div>
      );
    });
  }
}

export default OtherPage;

const pageEntries: { [hey: string]: ComponentType<List> } = {
  P2: P2PageEntry,
  CS5: CS5TemplateEntry
};
