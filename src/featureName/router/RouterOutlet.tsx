import React from 'react';
import { RouterConsumer } from './RouterContext';

export interface RouterOutletProps {}

class RouterOutlet extends React.PureComponent<RouterOutletProps> {
  render() {
    return (
      <RouterConsumer>
        {context => <context.element {...context.data} />}
      </RouterConsumer>
    );
  }
}

export default RouterOutlet;
