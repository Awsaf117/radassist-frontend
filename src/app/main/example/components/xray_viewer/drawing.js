window.addEventListener("load", ()=>{
    canvas = document.querySelector(".drawCanvas div canvas");
    ctx = this.canvas.getContext("2d");
    console.log("ctx found");
  });

  var x = startPosition = ()=>{
    this.painting = true;
  }
  draw = (e) => {
    if(!this.painting)return;
    this.ctx.lineWidth = 6;
    this.ctx.lineCap = 'round';

    this.ctx.lineTo(e.clientX, e.clientY);
    this.ctx.stroke();
  }
  finishPosition = ()=>{
    this.painting = false;
  }

canvas.addEventListener('mousedown', function(){});
canvas.addEventListener('mouseup', startPosition);
canvas.addEventListener('mousemove', draw);