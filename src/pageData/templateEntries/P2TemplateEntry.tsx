import React from 'react';
import Link from '../../router/Link';
import GetMore from '../components/GetMore';
import { Item, List } from '../models/pageEntry';
import './P2TemplateEntry.css';

class P2PageEntry extends React.PureComponent<List> {
  render() {
    return (
      <div>
        <h1>
          <Link to={this.props.path}>
            {this.props.title} <small>{this.props.id}</small>
          </Link>
        </h1>

        <div className="list-row">
          {this.renderList(this.props.items)}{' '}
          <GetMore className="test" page={this.props.paging}>
            More
          </GetMore>
        </div>
        {/* <pre>{JSON.stringify(this.props, null, 2)}</pre> */}
      </div>
    );
  }

  private renderList(items: Item[]): React.ReactNodeArray {
    return (
      items &&
      items.map(item => (
        <div key={item.id}>
          <Link to={item.path}>
            <img src={item.images ? item.images.poster : ''} alt="" />
          </Link>
        </div>
      ))
    );
  }
}

export default P2PageEntry;
