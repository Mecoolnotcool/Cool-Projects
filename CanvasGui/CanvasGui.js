export let canvas = document.getElementById('canvas');
export let ctx = canvas.getContext('2d');

export const GuiCreator = {
    clear_canvas : true,
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
    clickMethods : {},
    UiTypes : [
        "buttonObject",
        "text"
    ],


    rect : canvas.getBoundingClientRect(),
    buttonList : {},
    text : {},

    //methods 
    addObject:function(obj,name,type){
        if(type && this.UiTypes.includes(type)){
           let NewElement = this.buttonList[name] = obj;
            NewElement['type'] = type
        }
    },
    handleClick:function(Ex,Ey) {
       let mouseX = Ex - this.rect.left;
       let mouseY = Ey - this.rect.top;

       let Clicked = this.checkCollision(mouseX,mouseY)
       if (Clicked.clicked == true){
         if(this.clickMethods[Clicked.buttonName] && this.clickMethods[Clicked.buttonName].click){
            this.clickMethods[Clicked.buttonName].click()
         }
       }

       let ChildClicked = this.checkChildCollison(mouseX,mouseY)
       if (ChildClicked.clicked == true){
         if(this.clickMethods[ChildClicked.buttonName] && this.clickMethods[ChildClicked.buttonName].click){
            this.clickMethods[ChildClicked.buttonName].click()
         }
       }
    },
    checkCollision:function(mouseX,mouseY) {
        let collided = {"clicked":false,"buttonName":null};
        Object.keys(this.buttonList).forEach(key =>{
            let UiObj = this.buttonList[key];
            if (mouseX >= UiObj.x && mouseX <= UiObj.width + UiObj.x && mouseY >= UiObj.y && mouseY <= UiObj.height + UiObj.y){
                if(UiObj.clickable){
                    collided = {"clicked":true,"buttonName":UiObj.name};
                }
            }
        })
        return collided
    },
    checkChildCollison:function(mouseX,mouseY){
        let collided = {"clicked":false,"buttonName":null};
        Object.keys(this.buttonList).forEach(key =>{
            let UiObj = this.buttonList[key];
            if(UiObj.children){
                Object.keys(UiObj.children).forEach(key =>{
                    let child = UiObj.children[key]
                    if(mouseX >= child.x && mouseX <= child.width + child.x && mouseY >= child.y && mouseY <= child.height + child.y){
                        if(child.clickable){
                            collided = {"clicked":true,"buttonName":child.name};
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
        if(this.clear_canvas == true){
            ctx.clearRect(0,0,1000,1000);
        }
        this.drawText("testing text",100,100);
        Object.keys(this.buttonList).forEach(key => {
            let toDraw = this.buttonList[key]; 
            this.drawBox(toDraw.x,toDraw.y,toDraw.color,toDraw.width,toDraw.height);
            toDraw.drawChildren()
        });
        requestAnimationFrame(this.drawloop.bind(this));
    },  
    //this automatically creates offsets for your ui elements
    createOffsets:function(parent){
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
    //automatically creates a button click event
    //can be done manually
    createButtonEvent:function(buttonName,EventName){
        this.clickMethods[buttonName] =  {
            click:function(){
                const customEvent = new CustomEvent(EventName, {
                    detail: { ButtonClicked: "Clicked" }
                });
                document.dispatchEvent(customEvent);
            }
        }
    },
    drawText:function(txt,x,y){
        ctx.font = "30px serif";
        ctx.fillStyle = "#009578";
        ctx.strokeText(txt, x, y,500);
    },
};       
