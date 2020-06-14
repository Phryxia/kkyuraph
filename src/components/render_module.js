import React from 'react';
import Utility from '../utility'
import Parser from '../parser';

/*
  그래프를 그려주는 모듈입니다.
  canvas2D를 활용합니다.

  props
    width, height: number, 캔버스의 크기
    xmin, xmax, ymin, ymax: number, 그래프를 그릴 영역
    resolution: number, 그래프의 해상도
    expression: string, 수식
    variables: Map, 상수 목록
*/
export default class RenderModule extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <canvas id='screen' width={this.props.width} height={this.props.height}></canvas>
      </div>
    );
  }

  componentDidMount() {
    if (this.safetyCheck()) {
      this.drawGrid();
      this.drawGraph();
    }
  }

  componentDidUpdate() {
    if (this.safetyCheck()) {
      this.drawGrid();
      this.drawGraph();
    }
  }

  drawGrid() {
    let w = this.props.width;
    let h = this.props.height;
    let xmin = this.props.xmin;
    let ymin = this.props.ymin;
    let xmax = this.props.xmax;
    let ymax = this.props.ymax;

    // dom 불러오기
    let dom = document.getElementById('screen');
    let ctx = dom.getContext('2d');
    ctx.fillStyle = '#FFFFFF';
    ctx.lineWidth = 1;
    ctx.fillRect(0, 0, this.props.width, this.props.height);
    
    // y축 그리기
    // 몇 가지 케이스가 있다.
    // case 1: 0이 현재 범위에 포함된 경우
    // 이 경우 0을 중심으로 격자를 그어야 한다.
    // case 2: xmax < 0인 경우
    // case 3: xmin > 0인 경우
    // 이 두 경우 그냥 uniform하게 그으면 된다. 
    let xi, xp;
    let dx = (xmax - xmin) / 8;
    if (xmin < 0 && 0 < xmax) {
      for (xi = 0; xi <= xmax; xi += dx) {
        xp = Utility.map(xi, xmin, xmax, 0, w);
        ctx.beginPath();
        ctx.strokeStyle = '#bbbbbb';
        ctx.moveTo(xp, 0);
        ctx.lineTo(xp, h);
        ctx.stroke();
      }
      for (xi = 0; xi >= xmin; xi -= dx) {
        xp = Utility.map(xi, xmin, xmax, 0, w);
        ctx.beginPath();
        ctx.strokeStyle = '#bbbbbb';
        ctx.moveTo(xp, 0);
        ctx.lineTo(xp, h);
        ctx.stroke();
      }
    }
    else {
      for (xi = xmin; xi <= xmax; xi += dx) {
        xp = Utility.map(xi, xmin, xmax, 0, w);
        ctx.beginPath();
        ctx.strokeStyle = '#bbbbbb';
        ctx.moveTo(xp, 0);
        ctx.lineTo(xp, h);
        ctx.stroke();
      }
    }

    // x축 그리기
    // y축 그리기와 동일한 로직이다 
    let yi, yp;
    let dy = (ymax - ymin) / 8;
    if (ymin < 0 && 0 < ymax) {
      for (yi = 0; yi <= ymax; yi += dy) {
        yp = Utility.map(yi, ymin, ymax, h, 0);
        ctx.beginPath();
        ctx.strokeStyle = '#bbbbbb';
        ctx.moveTo(0, yp);
        ctx.lineTo(w, yp);
        ctx.stroke();
      }
      for (yi = 0; yi >= ymin; yi -= dy) {
        yp = Utility.map(yi, ymin, ymax, h, 0);
        ctx.beginPath();
        ctx.strokeStyle = '#bbbbbb';
        ctx.moveTo(0, yp);
        ctx.lineTo(w, yp);
        ctx.stroke();
      }
    }
    else {
      for (yi = ymin; yi <= ymax; yi += dy) {
        yp = Utility.map(yi, ymin, ymax, h, 0);
        ctx.beginPath();
        ctx.strokeStyle = '#bbbbbb';
        ctx.moveTo(0, yp);
        ctx.lineTo(w, yp);
        ctx.stroke();
      }
    }

    // 주축
    xp = Math.min(Math.max(0, Utility.map(0, xmin, xmax, 0, w)), w);
    ctx.beginPath();
    ctx.strokeStyle = '#000000';
    ctx.moveTo(xp, 0);
    ctx.lineTo(xp, h);
    ctx.stroke();

    yp = Math.min(Math.max(0, Utility.map(0, ymin, ymax, h, 0)), h);
    ctx.beginPath();
    ctx.strokeStyle = '#000000';
    ctx.moveTo(0, yp);
    ctx.lineTo(w, yp);
    ctx.stroke();
  }

  drawGraph() {
    // 수식이 비어있으면 평가하지 않는다.
    if (!this.props.expression)
      return;

    let dom = document.getElementById('screen');
    let ctx = dom.getContext('2d');

    // 상수 목록을 복제한 뒤 변수를 추가해준다.
    let vars = new Map(this.props.variables);
    vars.set('x', {value: 0, immutable: false});

    // 값 초기화
    let x, y, xp, yp;
    let dx = (this.props.xmax - this.props.xmin) / this.props.resolution;
    let parser = new Parser();
    let reset = true;
    ctx.strokeStyle = '#c40000';
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (x = this.props.xmin; x <= this.props.xmax; x += dx) {
      // 변수 설정
      vars.get('x').value = x;

      try {
        y = parser.parse(this.props.expression, vars);
      }
      catch(e) {

      }

      if (y === undefined || isNaN(y) || !isFinite(y)) {
        reset = true;
        continue;
      }

      // 위치계산
      xp = Utility.map(x, this.props.xmin, this.props.xmax, 0, this.props.width);
      yp = Utility.map(y, this.props.ymin, this.props.ymax, this.props.height, 0);

      // NaN이나 undefined 등으로 값이 존재하지 않을 경우 선을 그리지 않는다.
      if (reset) {
        reset = false;
        ctx.beginPath();
        ctx.moveTo(xp, yp);
      }
      else {
        ctx.lineTo(xp, yp);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(xp, yp);
      }
    }
  }

  safetyCheck() {
    return this.props.xmin !== undefined &&
      this.props.xmax !== undefined &&
      this.props.ymin !== undefined &&
      this.props.ymax !== undefined &&
      this.props.xmin < this.props.xmax &&
      this.props.ymin < this.props.ymax;
  }
}