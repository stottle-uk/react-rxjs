import React, { useContext } from 'react';
import { HistoryContext } from './RouterContext';

export interface LinkProps {
  to: string;
  children: React.ReactNode;
}

const Link = ({ to, ...rest }: LinkProps) => {
  const history = useContext(HistoryContext);
  const handleClick = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ): void => {
    event.preventDefault();
    history.go(event.currentTarget.pathname);
  };

  return <a {...rest} onClick={handleClick} href={to} />;
};

export default Link;
