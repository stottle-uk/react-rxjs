import React from 'react';
import { HistoryConsumer } from './RouterContext';

export interface LinkProps {
  to: string;
}

class Link extends React.PureComponent<LinkProps> {
  handleClick(
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    go: (path: string) => void
  ): void {
    event.preventDefault();
    go(event.currentTarget.pathname);
  }

  render() {
    const { to, ...rest } = this.props;
    return (
      <HistoryConsumer>
        {({ history }) => (
          <a
            {...rest}
            onClick={event => this.handleClick(event, history.go.bind(history))}
            href={to}
          />
        )}
      </HistoryConsumer>
    );
  }
}

export default Link;
