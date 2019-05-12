import React from 'react';
import { Paging } from '../../pageData/models/pageEntry';
import { GetMoreConsumer } from './GetMoreContext';

export interface GetMoreProps extends React.HTMLProps<HTMLSpanElement> {
  className: string;
  page: Paging;
}

class GetMore extends React.PureComponent<GetMoreProps> {
  render() {
    const { page, ...rest } = this.props;
    return (
      <GetMoreConsumer>
        {({ getMore }) =>
          !!page &&
          page.next && <span {...rest} onClick={() => getMore(page)} />
        }
      </GetMoreConsumer>
    );
  }
}

export default GetMore;
