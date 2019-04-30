import React from 'react';
import { Paging } from '../models/pageEntry';
import { GetMoreConsumer } from '../pageDataServices';

export interface GetMoreProps {
  className: string;
  page: Paging;
}

class GetMore extends React.PureComponent<GetMoreProps> {
  render() {
    const { page, ...rest } = this.props;
    return (
      <GetMoreConsumer>
        {({ getMore }) => <span {...rest} onClick={() => getMore(page)} />}
      </GetMoreConsumer>
    );
  }
}

export default GetMore;
