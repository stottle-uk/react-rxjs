import React from 'react';
import { RouterConsumer } from './RouterContext';

export interface RouterOutletProps<T> {
  data: T;
}

class RouterOutlet<T> extends React.PureComponent<RouterOutletProps<T>> {
  render() {
    return (
      <RouterConsumer>
        {context => <context.element {...this.props.data} />}
      </RouterConsumer>
    );
  }
}

export default RouterOutlet;
