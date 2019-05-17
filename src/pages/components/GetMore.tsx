import React, { useContext } from 'react';
import { Paging } from '../../pageData/models/pageEntry';
import { getMoreContext } from './GetMoreContext';

export interface GetMoreProps extends React.HTMLProps<HTMLSpanElement> {
  page: Paging;
}

const GetMore = (props: GetMoreProps) => {
  const { page, ...rest } = props;
  const { getMore } = useContext(getMoreContext);
  return <span {...rest} onClick={() => getMore(page)} />;
};

export default GetMore;
