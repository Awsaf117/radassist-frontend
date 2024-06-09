import React from 'react'

class DrawArea extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
     painting: false,
     ctx: null,
     canvas: null
    };

  }
  
  draw = (e) => {
    if(!this.painting)return;
    this.ctx.lineWidth = 6;
    this.ctx.lineCap = 'round';

    this.ctx.lineTo(e.clientX, e.clientY);
    this.ctx.stroke();
  }
  render(){
    const { classes } = this.props;
    const { painting, ctx, canvas} = this.state;
    
    //variables

    return (
      <div></div>
    );
  }
  componentDidMount(){
    var x = startPosition = ()=>{
      this.painting = true;
    }
    finishPosition = ()=>{
      this.painting = false;
    }
    window.addEventListener("load", ()=>{
      this.canvas = document.querySelector(".drawCanvas div canvas");
      this.ctx = this.canvas.getContext("2d");
      console.log("ctx found");
    });

    //EventListerners


    this.canvas.addEventListener('mousedown', function(){});
    this.canvas.addEventListener('mouseup', startPosition);
    this.canvas.addEventListener('mousemove', draw);
  }
}

export default (DrawArea);