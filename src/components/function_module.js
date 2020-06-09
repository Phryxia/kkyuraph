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
    
    this.fndata = [
      ['abs(x)',    '절댓값'],
      ['acos(x)',   '역코사인 삼각 함수'],
      ['acosh(x)',  '역하이퍼볼릭 코사인 쌍곡선 함수'],
      ['asin(x)',   '역사인 삼각 함수'],
      ['asinh(x)',  '역하이퍼볼릭 사인 쌍곡선 함수'],
      ['atan(x)',   '역탄젠트 삼각 함수'],
      ['atanh(x)',  '역하이퍼볼릭 탄젠트 쌍곡선 함수'],
      ['atan2(y, x)', '역탄젠트 삼각 함수, x축과 이루는 각도를 반환'],
      ['cbrt(x)',   '세제곱근'],
      ['ceil(x)',   '올림, x보다 같거나 큰 가장 작은 정수를 반환'],
      ['clz32(x)',  '32비트 이진수로 나타냈을 때 앞에 나오는 0의 개수'],
      ['cos(x)',    '코사인 삼각 함수'],
      ['cosh(x)',   '하이퍼볼릭 코사인 쌍곡선 함수'],
      ['exp(x)',    'E를 밑으로 하는 지수 함수'],
      ['expm1(x)',  'E를 밑으로 하는 지수 함수에서 1을 뺀 것(e^x - 1)'],
      ['floor(x)',  '버림, x보다 같거나 작은 가장 큰 정수를 반환'],
      ['fround(x)', 'x를 단정밀도(float)로 표현한 실수를 반환'],
      ['hypot(x1, x2, ...)', '제곱의 합의 제곱근, 길이, sqrt(x1^2 + x2^2 + ...)'],
      ['imul(x, y)','32비트 정수 곱셈으로 x와 y를 곱하여 반환'],
      ['log(x)',    '자연로그'],
      ['log1p(x)',  'x + 1의 자연로그'],
      ['log10(x)',  '10을 밑으로 하는 로그'],
      ['log2(x)',   '2를 밑으로 하는 로그'],
      ['max(x1, x2, ...)', '최댓값'],
      ['min(x1, x2, ...)', '최솟값'],
      ['pow(x, y)', 'x의 y승, 지수 함수'],
      ['random()',  '0에서 1 사이의 난수를 반환'],
      ['round(x)',  '반올림, x와 가장 가까운 정수를 반환'],
      ['sign(x)',   'x의 부호를 반환, 0인 경우 0을 반환'],
      ['sin(x)',    '사인 삼각 함수'],
      ['sinh(x)',   '역사인 삼각 함수'],
      ['sqrt(x)',   '제곱근'],
      ['tan(x)',    '탄젠트 삼각 함수'],
      ['tanh(x)',   '하이퍼볼릭 탄젠트 쌍곡선 함수'],
      ['trunc(x)',  '음수면 올림, 양수면 버림, 절삭 함수']      
    ];
    
    this.state = {
      query: '',
      results: this.fndata
    };

    // 핸들러 함수 등록
    this.handleQueryChange = this.handleQueryChange.bind(this);
  }
  
  render() {
    return (
      <div>
        <ModuleHeader title='FUNCTIONS' />
        <div>Search <input type='text' value={this.state.query} onChange={this.handleQueryChange} /></div>
        <div className='func-frame'>
          {this.state.results.map(fnpair => <FunctionRow key={fnpair[0]} signature={fnpair[0]} description={fnpair[1]} />)}
        </div>
      </div>
    );
  }

  /*
    검색어가 변경될 때 핸들러 함수입니다.
  */
  handleQueryChange(event) {
    let query = event.target.value ? event.target.value : '';
    let results = this.fndata;

    /*
      스트링 검색을 해서 조건에 맞는 것들을 반환한다.
    */
    if (query) {
      results = results.filter(pair => {
        return pair[0].match(query) !== null || pair[1].match(query) !== null;
      })
    }
    
    this.setState({
      query,
      results
    });
  }
}