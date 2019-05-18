import React from 'react';
import Link from '../../router/Link';

const Header = () => {
  return (
    <div>
      <Link to={'/'}>Home</Link>
      <span> - </span>
      <Link to={'/filmes-comedia/g'}>Category</Link>
      <span> - </span>
      <Link to={'/filmes-marvel'}>Marvel</Link>

      <hr />
    </div>
  );
};

export default Header;
