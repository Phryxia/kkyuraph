import React from 'react';
import ModuleHeader from './module_header';

/*
  수식을 입력하는 공간입니다.

  props
    expression: string
    onExprChange: (value) => void
*/
export default class SyntaxModule extends React.Component {
  constructor(props) {
    super(props);

    this.handleExprChange = this.handleExprChange.bind(this);
  }

  render() {
    return (
      <div>
        <ModuleHeader title='SYNTAX' />
        <textarea id='expression' 
                  value={this.props.expression}
                  onChange={this.handleExprChange}></textarea>
      </div>
    );
  }

  handleExprChange(event) {
    if (this.props.onExprChange)
      this.props.onExprChange(event.target.value);
  }
}