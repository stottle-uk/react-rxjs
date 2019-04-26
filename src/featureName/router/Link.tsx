import React from 'react';
import { RouterConsumer } from './RouterContext';

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
      <RouterConsumer>
        {({ go }) => (
          <a
            {...rest}
            onClick={event => this.handleClick(event, go)}
            href={to}
          />
        )}
      </RouterConsumer>
    );
  }
}

export default Link;
