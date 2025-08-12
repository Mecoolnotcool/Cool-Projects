let canvas = document.getElementById('Canvas');
let ctx = canvas.getContext('2d');

const GuiCreator = {
    frame:  class {
        constructor(x,y,width,height,clickable,name,color){
            this.height = height;
            this.width = width;
            this.x = x;
            this.y = y;
            this.clickable = clickable;
            this.name = name;
            this.children = {};
            this.offsets;
            this.color = color;
        }
        addChild(NewChild,NewId){
            if(NewChild != undefined || NewChild != null) {
                NewChild.parent = this;
                this.children[NewId] = NewChild;
            } else{
                console.error('failed to add child to object')
                return
            }  
        }
        drawChildren(){
            Object.keys(this.children).forEach(key => {
                    let toDrawChild = this.children[key]
                    if(typeof toDrawChild === 'object'){
                      GuiCreator.drawBox(toDrawChild.x,toDrawChild.y,toDrawChild.color,toDrawChild.width,toDrawChild.height)
                    }
            })
        }
    },

    buttonBase: class {
        constructor(x,y,width,height,clickable,name,color){
            this.height = height;
            this.width = width;
            this.x = x;
            this.y = y;
            this.clickable = clickable;
            this.name = name;
            this.children = {};
            this.parent = null;
            this.color = color;
        }
    },

    rect : canvas.getBoundingClientRect(),
    buttonList : {},

    //methods 
    addObject:function(obj,name){
       this.buttonList[name] = obj;
    },
    handleClick:function(Ex,Ey) {
       let mouseX = Ex - this.rect.left;
       let mouseY = Ey - this.rect.top;

       let Clicked = this.checkCollision(mouseX,mouseY)
       if (Clicked == true){
         console.log('clicked a button')
       }

       let ChildClicked = this.checkChildCollison(mouseX,mouseY)
       if (ChildClicked == true){
         console.log('clicked a child button')
       }
    },
    checkCollision:function(mouseX,mouseY) {
        let collided = false;
        Object.keys(this.buttonList).forEach(key =>{
            let UiObj = this.buttonList[key];
            if (mouseX >= UiObj.x && mouseX <= UiObj.width + UiObj.x && mouseY >= UiObj.y && mouseY <= UiObj.height + UiObj.y){
                if(UiObj.clickable){
                    collided = true;
                }
            }
        })
        return collided
    },
    checkChildCollison:function(mouseX,mouseY){
        let collided = false;
        Object.keys(this.buttonList).forEach(key =>{
            let UiObj = this.buttonList[key];
            if(UiObj.children){
                Object.keys(UiObj.children).forEach(key =>{
                    let child = UiObj.children[key]
                    if(mouseX >= child.x && mouseX <= child.width + child.x && mouseY >= child.y && mouseY <= child.height + child.y){
                        if(child.clickable){
                            collided = true
                        }
                    }
                });
            }
            
        })
        return collided
    },
    drawBox: function(x,y,color,width,height){
        ctx.fillStyle = color;
        ctx.fillRect(x,y,width,height);
    },
    drawloop: function(){
        ctx.clearRect(0,0,1000,1000);
        this.drawText("are you sure u wanna buy this bro");
        Object.keys(this.buttonList).forEach(key => {
            let toDraw = this.buttonList[key]; 
            this.drawBox(toDraw.x,toDraw.y,toDraw.color,toDraw.width,toDraw.height);
            toDraw.drawChildren()
        });
        requestAnimationFrame(this.drawloop.bind(this));
    },  
    //this automatically creates offsets for your ui elements
    createOffsets(parent){
        let finalOffsets = {};
        if(parent.children){
            Object.keys(parent.children).forEach(key =>{
                let child = parent.children[key];
                    finalOffsets[child.name] = {
                        "xOffset":child.x - parent.x,
                        "yOffset":child.y - parent.y,
                    };
            });
        }
        return finalOffsets;
    },
    setInitalPosition:function(main,x,y){
        main.x = x;
        main.y = y;
        if(main.children && main.offsets){
            Object.keys(main.children).forEach(key =>{
                let child = main.children[key];
                if(main.offsets.hasOwnProperty(child.name)){
                    child.x = main.x + main.offsets[child.name].xOffset;
                    child.y = main.y + main.offsets[child.name].yOffset;
                }
            });
        }
    },
    drawText:function(txt){
        ctx.fillStyle = "#009578"
        ctx.fillText(txt,100,100);
    }
    
        
}


let buttons = {}

//create a basic re-usable yes or no button
const YesOrNoButton = {
    createThisButton:function(name,UiX,UiY){
        let frame = new GuiCreator.frame(0,0,200,200,false,"FrameBackground",'blue');
        let yesButton = new GuiCreator.buttonBase(30,150,40,40,true,"yesButton",'green');
        let noButton = new GuiCreator.buttonBase(130,150,40,40,true,"noButton",'red');

        frame.addChild(yesButton,yesButton.name);
        frame.addChild(noButton,noButton.name);
        frame.offsets = GuiCreator.createOffsets(frame);

        GuiCreator.addObject(frame,name);
        GuiCreator.setInitalPosition(frame,UiX,UiY);
        
    }
}
//creating it
YesOrNoButton.createThisButton("ConfirmBuyButton2",300,300);

//clickable frame
let frame = new GuiCreator.frame(0,500,200,200,true,"FrameBackground",'blue')
GuiCreator.addObject(frame,'clickableFrame');


GuiCreator.drawText()


//setup the game loop and click detection
requestAnimationFrame(() => GuiCreator.drawloop());
canvas.addEventListener('click', (event) => {
    GuiCreator.handleClick(event.x,event.y)
})

