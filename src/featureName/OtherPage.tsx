import React from 'react';
import { PageEntry } from './Testdata';

class OtherPage extends React.Component<PageEntry, any> {
  componentDidUpdate(
    prevProps: Readonly<PageEntry>,
    prevState: Readonly<any>
  ): void {
    console.log(this.props);
  }

  render() {
    return <pre>OtherPage {JSON.stringify(this.props, null, 2)}</pre>;
  }
}

export default OtherPage;
