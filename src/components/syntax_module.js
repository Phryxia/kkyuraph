import React from 'react';
import ModuleHeader from './module_header';

export default class SyntaxModule extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <ModuleHeader title='SYNTAX' />
        <textarea id='expression'></textarea>
      </div>
    );
  }
}