let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');

const ButtonCreator = {
    rect : canvas.getBoundingClientRect(),

    buttonList : {},
    createButton:function(id,x,y,color,width,height){
        let NewButton = new  this.buttonBox(x,y,id,color,width,height);
        this.buttonList[id] = NewButton
    },
    handleClick:function(Ex,Ey) {
       let mouseX = Ex - this.rect.left;
       let mouseY = Ey - this.rect.top;

       let Clicked = this.checkCollision(mouseX,mouseY)
       if (Clicked == true){
         console.log('clicked a button')
       }
    },
    checkCollision:function(mouseX,mouseY) {
        let collided = false;
        Object.keys(this.buttonList).forEach(key =>{
            let button = this.buttonList[key];
            if (mouseX >= button.x && mouseX <= button.width + button.x && mouseY >= button.y && mouseY <= button.height + button.y){
                collided = true;
            }
        })
        return collided
    },
    drawBox: function(x,y,color,width,height){
        ctx.fillStyle = color;
        ctx.fillRect(x,y,width,height);
    },
    drawloop: function(){
        ctx.clearRect(0,0,1000,1000)
        Object.keys(this.buttonList).forEach(key => {
            let toDraw = this.buttonList[key]; 
            this.drawBox(toDraw.x,toDraw.y,toDraw.color,toDraw.width,toDraw.height);
        });
        requestAnimationFrame(this.drawloop.bind(this));
    },   
    buttonBox: class{
        constructor(x,y,id,color,width,height){
            this.x = x;
            this.y = y;
            this.id = id;
            this.color  = color;
            this.width = width;
            this.height = height;
        }
    }
        
}


ButtonCreator.createButton("button1",0,0,"red",100,100);
ButtonCreator.createButton("button2",200,200,"gray",100,100);
ButtonCreator.createButton("button3",300,0,"teal",100,100);
ButtonCreator.createButton("button4",500,0,"purple",100,100);
ButtonCreator.createButton("button5",0,500,"violet",100,100);


//setup the game loop and click detection
requestAnimationFrame(() => ButtonCreator.drawloop());

canvas.addEventListener('click', (event) => {
    ButtonCreator.handleClick(event.x,event.y)
})