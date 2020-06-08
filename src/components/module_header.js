import React from 'react';

export default class ModuleHeader extends React.Component {
  constructor(props) {
    super(props);
  }
  
  render() {
    return (
      <div className='hr-container'>
        <span className='hr hr-short'></span>
        <span className='hr-label'>{this.props.title}</span>
        <span className='hr hr-long'></span>
      </div>
    );
  }
}