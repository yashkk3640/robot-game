import React from 'react';
import Robot from './Robot'
// import Square from './Square';

const App = () => {

  return (
    <div>
      {/* <button style={{position:'fixed',bottom:30,left:30,zIndex:0}} onClick={() => setFlag(!flag)}>W</button>
      <button style={{position:'fixed',bottom:0,left:30,zIndex:0}} onClick={() => setFlag(!flag)}>S</button>
      <button style={{position:'fixed',bottom:0,left:60,zIndex:0}} onClick={() => setFlag(!flag)}>D</button>
      <button style={{position:'fixed',bottom:0,zIndex:0}} onClick={() => setFlag(!flag)}>A</button> */}
      <Robot />
      {/* {flag ? <Robot /> : <Square /> } */}
      {/* <Square /> */}
    </div>
  );

}

export default App;
