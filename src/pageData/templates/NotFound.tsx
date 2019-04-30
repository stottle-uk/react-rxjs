import React from 'react';

class NotFound extends React.Component<any, any> {
  render() {
    return this.props ? (
      <div>{this.props.template} not defined</div>
    ) : (
      <div>fack!</div>
    );
  }
}

export default NotFound;
