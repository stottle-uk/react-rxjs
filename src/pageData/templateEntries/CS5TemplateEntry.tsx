import React from 'react';
import Link from '../../router/Link';
import GetMore from '../components/GetMore';
import { Item, List } from '../models/pageEntry';
import './P2TemplateEntry.css';

class CS5TemplateEntry extends React.PureComponent<List> {
  render() {
    return (
      <div>
        <h1>{this.props.title}</h1>
        <h2>{this.props.tagline}</h2>

        <div className="list-row">
          {this.renderList(this.props.items)}
          <GetMore className="test" page={this.props.paging}>
            More
          </GetMore>
        </div>
      </div>
    );
  }

  private renderList(items: Item[]) {
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

export default CS5TemplateEntry;
