import React, { Component, ComponentType } from 'react';
import { PageEntry } from './Testdata';

// This function takes a component...
export function Route(WrappedComponent: ComponentType<PageEntry>) {
  function someFunction(): void {
    console.log('dfsfds');
  }
  // ...and returns another component...
  return class extends Component<PageEntry> {
    constructor(props: PageEntry) {
      super(props);
      // this.handleChange = this.handleChange.bind(this);
      // this.state = {
      //   data: selectData(DataSource, props)
      // };
    }

    componentDidMount() {
      // someFunction();
      // ... that takes care of the subscription...
      // DataSource.addChangeListener(this.handleChange);
    }

    // componentWillUnmount() {
    //   DataSource.removeChangeListener(this.handleChange);
    // }

    // handleChange() {
    //   this.setState({
    //     data: selectData(DataSource, this.props)
    //   });
    // }

    render() {
      // ... and renders the wrapped component with the fresh data!
      // Notice that we pass through any additional props
      return <WrappedComponent {...this.props} />;
    }
  };
}
