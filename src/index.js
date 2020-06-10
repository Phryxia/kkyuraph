import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
import Parser from './parser';
import Utility from './utility';
import './index.css';

import RenderModule from './components/render_module';
import SyntaxModule from './components/syntax_module';
import ControlModule from './components/control_module';
import VariableModule from './components/variable_module';
import FunctionModule from './components/function_module';

class App extends React.Component {
  constructor(props) {
  	super(props);

  	this.state = {
  		xmin: -1, xmax: 1, xres: 0.01,
  		ymin: -1, ymax: 1, yres: 0.01,
  		vari: {}
  	};

  	this.parser = new Parser();
  }

  setVariable(vname, value) {
  	this.setState((state) => {
  	  let obj = {... state.vari};
  	  obj[vname] = Number.parseFloat(value);
  	  this.renderSyntax(obj);
  	  return {
  	  	vari: obj
  	  };
  	});
  }

  /*
  	Canvas에 그래프를 그립니다.
  */
  renderSyntax(vars) {
  	let dom = document.getElementById('canvas');
  	let ctx = dom.getContext('2d');
  	
  	if (!this.s)
  	  return;

  	// Draw grid
  	

  	let isFirst = true;
  	ctx.fillStyle = '#FFFFFF';
  	ctx.fillRect(0, 0, 640, 360);
  	for (let x = this.state.xmin; x <= this.state.xmax; x += this.state.xres) {
  	  vars.x = x;
  	  let y;
  	  try {
  	  	y = this.parser.parse(this.s, vars);
  	  }
  	  catch(e) {
  	  	y = NaN;
  	  }
  	  let xp = Utility.map(x, this.state.xmin, this.state.xmax, 0, 640);
  	  let yp = Utility.map(y, this.state.ymin, this.state.ymax, 360, 0);

  	  if (isFirst) {
  	  	isFirst = false;
  	  	ctx.beginPath();
  	  	ctx.moveTo(xp, yp);
  	  }
  	  else {
  	  	ctx.lineTo(xp, yp);
  	  	ctx.stroke();
  	  }
  	}
  }
}

class ProtoApp extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			varset: new Map()
		};

		// 기본 정의 상수
		['E', 'LN2', 'LN10', 'LOG2E', 'LOG10E', 'PI', 'SQRT1_2', 'SQRT2'].forEach(name => {
			this.state.varset.set(name, {value: Math[name], immutable: true});
		});
		
		// 이벤트 핸들러
		this.handleVarCreate = this.handleVarCreate.bind(this);
		this.handleVarChange = this.handleVarChange.bind(this);
		this.handleVarDelete = this.handleVarDelete.bind(this);
	}

	render() {
		// var map to list
		let varlist = [];
		for (let pair of this.state.varset.entries()) {
			varlist.push({
				varname: pair[0],
				varvalue: pair[1].value,
				immutable: pair[1].immutable
			});
		}

		return (
			<div id='mainframe'>
				<div>
					{/* RENDER MODULE */}
					<RenderModule />

					{/* SYNTAX MODULE */}
					<SyntaxModule />
				</div>

				<div>
					{/* CONTROL MODULE */}
					<ControlModule />

					{/* VARIABLE MODULE */}
					<VariableModule varlist={varlist}
													onVarCreate={this.handleVarCreate}
													onVarChange={this.handleVarChange}
													onVarDelete={this.handleVarDelete}/>

					{/* FUNCTION MODULE */}
					<FunctionModule />
				</div>
			</div>
		);
	}

	/*
		상수가 생성될 때 핸들러
	*/
	handleVarCreate(varname) {
		console.assert(varname);
		this.setState(state => {
			state.varset.set(varname, {value: 0.0, immutable: false});
			return { varset: state.varset };
		});
	}

	/*
		상수가 수정될 때 핸들러
	*/
	handleVarChange(varname, varvalue) {
		console.assert(varname);
		this.setState(state => {
			state.varset.set(varname, {value: varvalue, immutable: false});
			return { varset: state.varset };
		});
	}

	/*
		상수가 삭제될 때 핸들러
	*/
	handleVarDelete(varname) {
		console.assert(varname);
		this.setState(state => {
			state.varset.delete(varname);
			return { varset: state.varset };
		})
	}
}

ReactDOM.render(<ProtoApp />,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
