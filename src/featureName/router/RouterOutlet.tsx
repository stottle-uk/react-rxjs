import React from 'react';

export interface RouterOutletProps {}

class RouterOutlet extends React.PureComponent<RouterOutletProps> {
  render() {
    return <div />;
    // return (
    //   // <RouterContext.Consumer>
    //   //   {context => <div>fsdfsdfsd{context.template}</div>}
    //   // </RouterContext.Consumer>
    // );
  }
}

export default RouterOutlet;
