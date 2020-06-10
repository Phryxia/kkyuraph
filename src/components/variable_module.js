import React from 'react';
import ModuleHeader from './module_header';

/*
  하나의 상수를 담당하는 컴포넌트

  props
    varname   상수 이름
    varvalue  상수 값
    immutable 수정 가능 여부
    onVarChange: 상수 값이 바뀔 때 핸들러, (name, value) => void
    onVarDelete: 상수 값이 삭제될 때 핸들러, (name) => void
*/
class VariableRow extends React.Component {
  constructor(props) {
    super(props);

    // 이벤트 핸들러
    this.handleValueChange = this.handleValueChange.bind(this);
    this.handleButtonClick = this.handleButtonClick.bind(this);
  }

  render() {
    return (
      <div className='var-row'>
        <input type='text' className='var-name' value={this.props.varname} readOnly={true} />
        <input type='text' className='var-value' value={this.props.varvalue} 
          onChange={this.props.immutable ? null : this.handleValueChange} 
          readOnly={this.props.immutable} />
        
        {/* 삭제 불가능한 상수는 버튼을 렌더링하지 않는다. */}
        {this.props.immutable ? 
          <span style={{width: '10%'}}></span> : 
          <input type='button' 
                 value='삭제' 
                 onClick={this.handleButtonClick}
                 style={{width: '10%'}} />}
      </div>
    );
  }

  /*
    상수 값이 변경되었을 때 이벤트 핸들러
  */
  handleValueChange(event) {
    if (this.props.onVarChange)
      this.props.onVarChange(this.props.varname, event.target.value)
  }

  /*
    삭제 버튼을 클릭했을 때 일어나는 일을 담당한다.
    상위 컴포넌트의 상수를 삭제해야하므로, 상위 컴포넌트에서 넘겨받은
    이벤트 핸들러에 상수 이름을 전달해준다.
  */
  handleButtonClick(event) {
    if (this.props.onVarDelete)
      this.props.onVarDelete(this.props.varname);
  }
}

/*
  props
    varlist: {varname, varvalue, immutable}의 리스트
    onVarCreate: 상수 값이 생성될 때 핸들러, (name) => void
    onVarChange: 상수 값이 바뀔 때 핸들러, (name, value) => void
    onVarDelete: 상수 값이 삭제될 때 핸들러, (name) => void
*/
export default class VariableModule extends React.Component {
  constructor(props) {
    super(props);

    // 이벤트 핸들러
    this.handleAddButtonClick = this.handleAddButtonClick.bind(this);
  }
  
  render() {
    return (
      <div>
        <ModuleHeader title='VARIABLE' />
        <div className='var-frame'>
          {this.props.varlist.map(varprof => {
            return <VariableRow varname={varprof.varname} 
                                varvalue={varprof.varvalue} 
                                immutable={varprof.immutable}
                                onVarChange={this.props.onVarChange} 
                                onVarDelete={this.props.onVarDelete}
                                key={varprof.varname} />
          })}
          <input type='button' value='추가' 
                style={{width: '100%'}} onClick={this.handleAddButtonClick} />
        </div>
      </div>
    );
  }

  /*
    변수 추가 버튼을 눌렀을 때를 담당합니다.
    프롬프트를 띄워 변수 이름을 입력받습니다.
  */
  handleAddButtonClick(event) {
    let varname = prompt('상수 이름을 입력하세요:', '');
    if (varname) {
      if (!varname.match(/^[a-zA-Z_][a-zA-Z_0-9]*$/)) {
        alert('상수 이름은 영문자 또는 _로 시작하고 영문자나 숫자, _로만 이루어져야 합니다.');
        return;
      }
      else if (varname === 'x') {
        alert('상수 이름은 x가 될 수 없습니다.');
        return;
      }
      if (this.props.onVarCreate)
        this.props.onVarCreate(varname);
    }
  }
}