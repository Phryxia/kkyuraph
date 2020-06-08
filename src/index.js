import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
import Parser from './parser';
import Utility from './utility';

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

  render() {
  	return (
  	  <div>
  	  	<canvas id='canvas' width='640' height='360'></canvas><br />
	  	SYNTAX: <textarea id='expression' onChange={(evt) => {
	  	  this.s = evt.target.value;
	  	  this.renderSyntax(this.state.vari);
	  	}}></textarea><br />
	  	<Variable name='n' parent={this} /><br />
	  	<span>Result = {this.state.result}</span>
	  </div>
	);
  }
}

class Variable extends React.Component {
  constructor(props) {
  	super(props);
  }

  render() {
  	return (
  	  <span style={{display: 'inline-block'}}>
  		{this.props.name}: <input type='number' onChange={(evt) => {
  			this.props.parent.setVariable(this.props.name, evt.target.value);
  		}} />
  	  </span>
  		);
  }
}

ReactDOM.render(<App />,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
