let canvas = document.getElementById("Canvas");
let ctx = canvas.getContext('2d');

let nodes = [
    {x:50,y:50},

]
//this logic works alright
function PreviewLine(x,y) {
     ctx.clearRect(0,0,1000,1000)
     ctx.beginPath();
     ctx.moveTo(nodes[nodes.length - 1].x,nodes[nodes.length - 1].y); 
     ctx.lineTo(x, y); 
     ctx.lineWidth = 2;
     ctx.strokeStyle = "blue";
     ctx.stroke();
}
  
function drawLine(i){
     ctx.beginPath();
     ctx.moveTo(nodes[i].x,nodes[i].y); 
     if(nodes[i+1]) {
         ctx.lineTo(nodes[i+1].x,nodes[i+1].y); 
     } 
     ctx.lineWidth = 2;
     ctx.strokeStyle = "blue";
     ctx.stroke();
}

function drawEverything(){
    for (let i=0;i< nodes.length; i++) {
      drawLine(i)
    }
}

canvas.addEventListener('mousemove',function(event) {
    let rect = canvas.getBoundingClientRect() //This has to be done bc sometimes the canvas is in the middle other times not so we adjust it
    let mouseX = event.clientX - rect.left;
    let mouseY = event.clientY - rect.top;

    PreviewLine(mouseX,mouseY)
   
})

canvas.addEventListener('mousedown', function(event) {
    const rect = canvas.getBoundingClientRect(); //This has to be done bc sometimes the canvas is in the middle other times not so we adjust it
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    nodes.push({x:mouseX,y:mouseY})
});

function tick(){
    drawEverything()
    requestAnimationFrame(tick)
}
requestAnimationFrame(tick)
