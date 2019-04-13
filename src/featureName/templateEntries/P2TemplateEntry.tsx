import React from 'react';
import { Entry, List } from '../Testdata';
import './P2TemplateEntry.css';

class P2PageEntry extends React.Component<Entry, any> {
  render() {
    return (
      <div>
        <h1>
          {this.props.list.title} <small>{this.props.template}</small>{' '}
        </h1>
        <div className="list-row">{this.renderList(this.props.list)}</div>
        {/* <pre>{JSON.stringify(this.props, null, 2)}</pre> */}
      </div>
    );
  }

  private renderList(list: List) {
    return list.items.map(item => (
      <div key={item.id}>
        <img src={item.images ? item.images.poster : ''} alt="" />
      </div>
    ));
  }
}

export default P2PageEntry;
