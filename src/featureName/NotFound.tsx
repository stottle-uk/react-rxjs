import React from 'react';
import { Entry } from './Testdata';

class NotFound extends React.Component<Entry, any> {
  render() {
    return this.props ? (
      <div>{this.props.template} not defined</div>
    ) : (
      <div>fack!</div>
    );
  }
}

export default NotFound;
