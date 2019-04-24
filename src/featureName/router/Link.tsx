import React from 'react';
import { RouterContext } from '../../dataService';

export interface LinkProps {
  to: string;
}

class Link extends React.PureComponent<LinkProps> {
  handleClick(
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    go: (path: string) => void
  ) {
    event.preventDefault();
    go(event.currentTarget.pathname);
  }

  render() {
    const { to, ...rest } = this.props;
    return (
      <RouterContext.Consumer>
        {context => (
          <a
            {...rest}
            onClick={event => this.handleClick(event, context.go)}
            href={to}
          />
        )}
      </RouterContext.Consumer>
    );
  }
}

export default Link;
