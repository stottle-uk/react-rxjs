import React from 'react';
import { router } from '../../dataService';
import { Item, List } from '../models/pageEntry';
import './P2TemplateEntry.css';

class CS5TemplateEntry extends React.PureComponent<List> {
  getMore() {
    this.props.getMore(this.props.paging);
  }

  render() {
    return (
      <div>
        <h1>{this.props.title}</h1>
        <h2>{this.props.tagline}</h2>
        {this.props.getMore && (
          <button onClick={this.getMore.bind(this)}>click</button>
        )}

        <div className="list-row">{this.renderList(this.props.items)}</div>
        {/* <pre>{JSON.stringify(this.props, null, 2)}</pre> */}
      </div>
    );
  }

  changeUrl = (e: any): void => {
    e.preventDefault();
    const location = e.currentTarget.pathname;
    router.go(location);
  };

  private renderList(items: Item[]) {
    // console.log(list);

    return (
      items &&
      items.map(item => (
        <div key={item.id}>
          <a href={item.path} onClick={this.changeUrl}>
            <img src={item.images ? item.images.poster : ''} alt="" />
          </a>
        </div>
      ))
    );
  }
}

export default CS5TemplateEntry;
