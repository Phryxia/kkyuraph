import React from 'react';
import ModuleHeader from './module_header';

export default class ControlModule extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <ModuleHeader title='CONTROL' />
        X : <input type='number' /> ~ <input type='number' /><br />
        Y : <input type='number' /> ~ <input type='number' /><br />
        Resolution : <input type='range' min='100' max='10000' />
      </div>
    );
  }
}