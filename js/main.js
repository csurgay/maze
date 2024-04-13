const canvas=document.getElementById("canvas");
const ctx=canvas.getContext("2d");
const colors=["red","green","blue","cyan","magenta","yellow","pink",
    "orange","navy","plum","purple","salmon","brown","yellowgreen",
    "wheat","tan","steelblue","gray","skyblue","orangered","olive",
    "maroon","lime","khaki","indigo","indianred","gold","crimson",
    "chocolate","aqua","aquamarine" // beige
];
var ptrColor=0;
canvas.width=window.innerWidth; 
canvas.height=window.innerHeight;
ctx.translate(1.5,1.5);
ctx.lineWidth=3;
const d=Math.floor(Math.max(canvas.width/24, canvas.height/24));
const dx=Math.floor(canvas.width/d), dy=Math.floor(canvas.height/d);
var ms=0, lastFrame=0, delay=0, speeder=5;
const maze=new Maze();
const grid=[], opt=[], path=[];
var x=0, y=0; // current pos in path
addEventListener("mousedown",eventlistener);
addEventListener("mousemove",eventlistener);
addEventListener("mouseup",eventlistener);
addEventListener("touchstart",eventlistener);
addEventListener("touchmove",eventlistener, {passive:false});
addEventListener("touchend",eventlistener);

var userPath=[new Point(0,d/2)];
var state="BUILD";
function eventlistener(e) {
    if (e.type=="touchmove") e.preventDefault();
    if (e.type=="mousedown" || e.type=="touchstart") 
        state="DOWN";
    if (e.type=="mouseup" || e.type=="touchend") 
        state="IDLE";
    if (state=="DOWN" && e.type=="mousemove") 
        userPath.push(new Point(e.clientX,e.clientY));
    if (state=="DOWN" && e.type=="touchmove") {
        var t=e.changedTouches[0];
        userPath.push(new Point(t.pageX,t.pageY));
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
    }
    requestAnimationFrame(animate);
}

initAllWalls();
animate();
