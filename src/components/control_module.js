import React from 'react';
import ModuleHeader from './module_header';
import {DebounceInput} from 'react-debounce-input';

/*
  x와 y의 범위 및 해상도를 조정하는 모듈입니다.

  props
    xmin, xmax, ymin, ymax, resolution: number
    onValueChange: (name, value) => void ()
*/
export default class ControlModule extends React.Component {
  constructor(props) {
    super(props);

    this.handleValueChange = this.handleValueChange.bind(this);
  }

  render() {
    return (
      <div>
        <ModuleHeader title='CONTROL' />
        X : <DebounceInput name='xmin' type='number'
                   value={this.props.xmin} 
                   onChange={this.handleValueChange}
                   debounceTimeout={500} /><span> ~ </span>
            <DebounceInput name='xmax' type='number' 
                   value={this.props.xmax} 
                   onChange={this.handleValueChange}
                   debounceTimeout={500} /><br />
        Y : <DebounceInput name='ymin' type='number' 
                   value={this.props.ymin}
                   onChange={this.handleValueChange}
                   debounceTimeout={500} /><span> ~ </span>
            <DebounceInput name='ymax' type='number' 
                   value={this.props.ymax}
                   onChange={this.handleValueChange}
                   debounceTimeout={500} /><br />
        Resolution : <input name='resolution' type='range' 
                            min='100' max='1000' 
                            value={this.props.resolution}
                            onChange={this.handleValueChange} />
      </div>
    );
  }

  handleValueChange(event) {
    if (this.props.onValueChange)
      this.props.onValueChange(event.target.name, event.target.value);
  }
}