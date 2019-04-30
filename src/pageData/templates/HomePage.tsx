import React, { Component, ComponentType } from 'react';
import { Entry, List, PageEntry } from '../models/pageEntry';
import P2PageEntry from '../templateEntries/P2TemplateEntry';
import NotFound from './NotFound';

class HomePage extends Component<PageEntry, any> {
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
      const Template = pageEntries[entry.template];

      return (
        <div key={entry.id}>
          {Template ? <Template {...entry.list} /> : <NotFound {...entry} />}
        </div>
      );
    });
  }
}

export default HomePage;

const pageEntries: { [hey: string]: ComponentType<List> } = {
  P2: P2PageEntry,
  '2:3 Poster (Standard)': P2PageEntry,
  '2:3 Poster (Block Hero)': P2PageEntry
};