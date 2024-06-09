import React from 'react';
import './DtoolComponent.scss';

import DrawArea from './DrawArea';

class DtoolComponent extends React.Component{
    
  constructor(props) {
    super(props);
    this.state = {
     
      
    };


  }
    //x = init();

    render(){
      
      return(
        <div>
        <canvas cd = "container"></canvas>
        <DrawArea />
        </div>
        );

    }
    

  }
export default (DtoolComponent)