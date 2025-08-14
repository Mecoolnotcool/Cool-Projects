import { GuiCreator, canvas } from './canvasGui/CanvasGui.js';

//create a basic re-usable yes or no button
const YesOrNoButton = {
    createThisButton:function(name,UiX,UiY){
        let frame = new GuiCreator.frame(0,0,200,200,false,"FrameBackground",'blue');
        let yesButton = new GuiCreator.buttonBase(30,150,40,40,true,"yesButton",'green');
        let noButton = new GuiCreator.buttonBase(130,150,40,40,true,"noButton",'red');

        frame.addChild(yesButton,yesButton.name);
        frame.addChild(noButton,noButton.name);
        frame.offsets = GuiCreator.createOffsets(frame);

        GuiCreator.createButtonEvent('yesButton','yesButtonClicked');
        GuiCreator.createButtonEvent('noButton','noButtonClicked');

        GuiCreator.addObject(frame,name,'buttonObjectBox');
        GuiCreator.setInitalPosition(frame,UiX,UiY);
        
    }
};
//creating it
YesOrNoButton.createThisButton("ConfirmBuyButton2",300,300);

//clickable frame
let frame = new GuiCreator.frame(0,500,200,200,true,"clickableFrame",'blue')
GuiCreator.addObject(frame,'clickableFrame',"buttonObjectBox");
GuiCreator.createButtonEvent('clickableFrame','FrameBackgroundClicked');

//setup the game loop and click detection
requestAnimationFrame(() => GuiCreator.drawloop());
canvas.addEventListener('click', (event) => {
    GuiCreator.handleClick(event.x,event.y)
})

//button event listeners
document.addEventListener('yesButtonClicked', (event) => {
    console.log(event.detail.ButtonClicked);
    //add logic here (the console.log can be removed)
});
document.addEventListener('noButtonClicked', (event) => {
    console.log(event.detail.ButtonClicked);
    //add logic here (the console.log can be removed)
});
document.addEventListener('FrameBackgroundClicked', (event) => {
    console.log(event.detail.ButtonClicked);
    //add logic here (the console.log can be removed)
});

let textObj = new GuiCreator.textUi(300,325,"Are you sure you want to click the green button? If so beware.....",30,200,"textObj");
GuiCreator.addObject(textObj,"textObj","text");
