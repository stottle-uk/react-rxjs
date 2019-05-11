import React from 'react';
import { RouterOutletConsumer } from './RouterContext';

export interface RouterOutletProps<T> {
  data: T;
}

class RouterOutlet<T> extends React.PureComponent<RouterOutletProps<T>> {
  render() {
    return (
      <RouterOutletConsumer>
        {context => <context.element {...this.props.data} />}
      </RouterOutletConsumer>
    );
  }
}

export default RouterOutlet;
