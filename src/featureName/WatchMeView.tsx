import React from 'react';

interface WatchMeProps extends React.Props<any> {
  item: any[];
  render: <T>(data: T) => any;
}

class WatchMeView extends React.Component<WatchMeProps, any> {
  render() {
    return this.props.item.map(i => (
      <div key={i.login.uuid}>
        {this.props.render(this.props)}

        <img src={i.picture.medium} alt="dfsf" />
        <pre>{JSON.stringify(i, null, 2)}</pre>
      </div>
    ));
  }
}

export default WatchMeView;
