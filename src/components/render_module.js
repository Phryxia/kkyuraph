import React from 'react';

export default class RenderModule extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <canvas id='screen' width='640' height='640'></canvas>
      </div>
    );
  }
}