import React from 'react';
import ModuleHeader from './module_header';

export default class VariableModule extends React.Component {
  constructor(props) {
    super(props);
  }
  
  render() {
    return (
      <div>
        <ModuleHeader title='VARIABLE' />
        <div>
          <input type='text' value='PI' />
          <input type='text' value='3.141592' />
        </div>
        <div>
          <input type='text' value='E' />
          <input type='text' value='2.7184' />
        </div>
      </div>
    );
  }
}