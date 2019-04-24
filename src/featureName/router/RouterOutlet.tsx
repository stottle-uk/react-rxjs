import React from 'react';
import { RouterContext } from '../../dataService';

export interface RouterOutletProps {}

class RouterOutlet extends React.PureComponent<RouterOutletProps> {
  render() {
    return (
      <RouterContext.Consumer>
        {context => <context.element {...context.data} />}
      </RouterContext.Consumer>
    );
  }
}

export default RouterOutlet;
