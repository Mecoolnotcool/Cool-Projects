let canvasId = "canvas";


export const canvas = document.getElementById(canvasId);
export const ctx = canvas.getContext('2d');

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
    textUi: class {
        constructor(x,y,text,fontSize,maxGivenWidth,name){
            this.x = x;
            this.y = y;
            this.text = text;
            this.fontSize = fontSize;
            this.maxGivenWidth = maxGivenWidth;
            this.name = name;
            this.words 
            this.lines = {}
        }
        //automatically called on object creation for drawing purposes
        splitText() {
            let splitTextArray = this.text.split(" ");
            this.words = splitTextArray;
        }
    },

    clickMethods : {},
    
    rect : canvas.getBoundingClientRect(),
    buttonList : {},
    text : {},

    //methods 
    addObject:function(obj,name,type){
        if(type == null || type == undefined) {
            console.error('No button type. Cannot add the object to the ui list') 
            return
        }
        obj['type'] = type;
        let NewElement = this.buttonList[name] = obj;
        if(NewElement.type == "text"){
            NewElement.splitText();
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
        return collided;
    },
    drawBox: function(x,y,color,width,height){
        ctx.fillStyle = color;
        ctx.fillRect(x,y,width,height);
    },
    //includes text wrapping
    drawText:function(obj){
        //apparently this saves fps or something according to a stack overflow dude
        const canvas = document.getElementById(canvasId);
        const ctx = canvas.getContext("2d");

        ctx.font = "30px Arial";
        //create lines 
        let lineWidth = 0;
        let currentLine = "";
        obj.lines = [];
        let x = obj.x;
        let y = obj.y;

        for(let i = 0; i< obj.words.length; i++){
            let measurements = ctx.measureText(obj.words[i] + " ");
            let Textwidth = Math.floor(measurements.width)

            if(lineWidth + Textwidth < obj.maxGivenWidth){
                currentLine = currentLine + " " + obj.words[i];
                lineWidth += Textwidth;

            } else {
                currentLine.trim();
                obj.lines.push({"text":currentLine,x,y});
                currentLine = "";
                lineWidth = 0;
                x = x;
                y += 30

                //push the current word into the new line
                currentLine = obj.words[i];
                lineWidth += Textwidth;
            }
            
        }
        // TODO: fix this 
        //last word isn't added to the lines array

        //draw lines
        for(let i = 0; i< obj.lines.length; i++){
            ctx.fillStyle = "white";
            let text = obj.lines[i].text
            ctx.fillText(text, obj.lines[i].x,obj.lines[i].y) ;
        }
    },
    drawAll:function(){
        Object.keys(this.buttonList).forEach(key => {
            let toDraw = this.buttonList[key]; 
            if(toDraw.name != undefined && toDraw.type == "buttonObjectBox"){
                this.drawBox(toDraw.x,toDraw.y,toDraw.color,toDraw.width,toDraw.height);
                toDraw.drawChildren();
            }
            if(toDraw.name != undefined && toDraw.type == "text"){
                let toDraw = this.buttonList[key];
                this.drawText(toDraw)
            }

        });
    },

    drawloop: function(){
        if(this.clear_canvas == true){
            ctx.clearRect(0,0,1000,1000);
        }
        this.drawAll();

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
};       

