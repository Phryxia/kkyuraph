import React from 'react';
import ModuleHeader from './module_header';

const FunctionRow = (props) => {
  return (
    <div className='func-row'>
      <span className='func-name'>{props.signature}</span>
      <span className='func-desc'>{props.description}</span>
    </div>
  );
};

export default class FunctionModule extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      query: '',
      results: []
    };

    // 핸들러 함수 등록
    this.handleQueryChange = this.handleQueryChange.bind(this);
  }
  
  render() {
    return (
      <div>
        <ModuleHeader title='FUNCTIONS' />
        <div>Search <input type='text' value={this.state.query} onChange={this.handleQueryChange} /></div>
        <FunctionRow signature='sin(x)' description='삼각함수 중 사인 함수입니다.' />
      </div>
    );
  }

  /*
    검색어가 변경될 때 핸들러 함수입니다.
  */
  handleQueryChange(event) {
    this.setState({
      query: event.target.value ? event.target.value : ''
    })
  }
}