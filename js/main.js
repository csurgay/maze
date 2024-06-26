const canvas=document.getElementById("canvas");
const ctx=canvas.getContext("2d");
const colors=["red","green","blue","cyan","magenta","yellow","pink",
    "orange","navy","plum","purple","salmon","brown","yellowgreen",
    "wheat","tan","steelblue","gray","skyblue","orangered","olive",
    "maroon","lime","khaki","indigo","indianred","gold","crimson",
    "chocolate","aqua","aquamarine" // beige
];
var ptrColor;
var d, dx, dy; // maze size parameters
var ms, lastFrame, delay, speeder, delayMouse; // timing parameters
var maze;
const grid=[], opt=[], path=[];
var x, y; // current pos in path
var xMouse, yMouse; // current pos of the running mouse
var img, nImg, ptrMouse;

function loadImages(n) {
    nImg=n;
    img=new Image();
    img.onload=loadedImage();
    img.src="mouse.png";
}

function loadedImage() {
    nImg--;
    if (nImg==0) init();
}

function init() {
    canvas.width=window.innerWidth; 
    canvas.height=window.innerHeight;
    ptrColor=0;
    ptrMouse=0;
    xMouse=0, yMouse=0;
    d=Math.floor(Math.max(canvas.width/24, canvas.height/24));
    dx=Math.floor(canvas.width/d); dy=Math.floor(canvas.height/d);
    maze = new Maze();
    ms=0; lastFrame=0; delay=10; speeder=5; 
    delayMouse=15, lastMouse=0;
    x=0; y=0;
    ctx.translate(20.5,10.5);
    ctx.lineWidth=3;
    addEventListener("mousedown",eventlistener);
    addEventListener("mousemove",eventlistener);
    addEventListener("mouseup",eventlistener);
    addEventListener("touchstart",eventlistener, {passive:false});
    addEventListener("touchmove",eventlistener, {passive:false});
    addEventListener("touchend",eventlistener);
    initAllWalls();
    animate();
}

var userPath=[new Point(0,d/2)];
var state="BUILD";
var downX, downY;

function eventlistener(e) {
    if (e.type=="touchstart") e.preventDefault();
    if (e.type=="touchmove") e.preventDefault();
    if (e.type=="mousedown") {
        if (Math.hypot(e.clientX-20-d/2-xMouse,
                       e.clientY-10-d/2-yMouse)<10) {
            state="DRAG";
            downX=e.clientX; downY=e.clientY;
        }
    }    
    if (e.type=="touchstart") {
        var t=e.changedTouches[0];
        console.log(t.pageX+" "+t.pageY);
        console.log((t.pageX-20-d/2)+" "+(t.pageY-10-d/2));
        if (Math.hypot(t.pageX-20-d/2-xMouse,
                       t.pageY-10-d/2-yMouse)<10) {
            state="DRAG";
            downX=t.pageX; downY=t.pageY;
        }
    }
    if (e.type=="mouseup" || e.type=="touchend") {
        state="IDLE";
    }
    if (state=="DRAG" && e.type=="mousemove") {
        xMouse+=e.clientX-downX;
        yMouse+=e.clientY-downY;
        downX=e.clientX;
        downY=e.clientY;
        userPath.push(new Point(e.clientX-20,e.clientY-10));
    }
    if (state=="DRAG" && e.type=="touchmove") {
        var t=e.changedTouches[0];
        xMouse+=t.pageX-downX;
        yMouse+=t.pageY-downY;
        downX=t.pageX;
        downY=t.pageY;
        userPath.push(new Point(t.pageX-20,t.pageY-10));
    }
}

function animate() {
    ms=Date.now();
    if (state=="BUILD" && ms>=lastFrame+delay) {
        clearScreen();
        ctx.strokeStyle="black";
        drawGrid();
        drawPath();
        lastFrame=ms;
        for (let i=0; i<speeder; i++) process();
        if (mazeFull())
            state="IDLE";
    }
    else {
        clearScreen();
        ctx.strokeStyle="black";
        drawGrid();
        drawUserPath();
        var dxMouse=167, dyMouse=103, delta=30;
        var ixMouse=ptrMouse%6, iyMouse=Math.floor(ptrMouse/6)%2;
        ctx.drawImage(img,ixMouse*dxMouse+delta-20,iyMouse*dyMouse,
            dxMouse-delta,dyMouse,xMouse-20,yMouse+5,
            5*(dxMouse-delta)/12,5*dyMouse/12);
        if (ms>lastMouse+delayMouse) {
            ptrMouse=(ptrMouse+1)%12;
            lastMouse=ms;
        }
    }
    requestAnimationFrame(animate);
}

loadImages(1);
