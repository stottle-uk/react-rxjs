import React, { useContext } from 'react';
import { historyContext } from './RouterContext';

export interface LinkProps {
  to: string;
  children: React.ReactNode;
}

const Link = (props: LinkProps) => {
  const { history } = useContext(historyContext);
  const { to, ...rest } = props;

  const handleClick = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ): void => {
    event.preventDefault();
    history.go(event.currentTarget.pathname);
  };

  return <a {...rest} onClick={handleClick} href={to} />;
};

export default Link;
