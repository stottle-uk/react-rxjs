import React from 'react';
import { router } from '../../dataService';
import { Entry, List } from '../Testdata';
import './P2TemplateEntry.css';

class P2PageEntry extends React.Component<Entry, any> {
  getMore() {
    this.props.list.getMore(this.props.list.paging);
  }

  render() {
    return (
      <div>
        <h1>
          {this.props.list.title} <small>{this.props.template}</small>{' '}
        </h1>
        {this.props.list.getMore && (
          <button onClick={this.getMore.bind(this)}>click</button>
        )}

        <div className="list-row">{this.renderList(this.props.list)}</div>
        {/* <pre>{JSON.stringify(this.props, null, 2)}</pre> */}
      </div>
    );
  }

  changeUrl = (e: any): void => {
    e.preventDefault();
    const location = e.currentTarget.pathname;
    router.go(location);
  };

  private renderList(list: List) {
    // console.log(list);

    return list.items.map(item => (
      <div key={item.id}>
        <a href={item.path} onClick={this.changeUrl}>
          <img src={item.images ? item.images.poster : ''} alt="" />
        </a>
      </div>
    ));
  }
}

export default P2PageEntry;
