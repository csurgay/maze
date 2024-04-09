const canvas=document.getElementById("canvas");
const ctx=canvas.getContext("2d");
canvas.width=window.innerWidth; 
canvas.height=window.innerHeight;
ctx.translate(0.5,0.5);
ctx.lineWidth=3;
const d=30, dx=20, dy=15;
const maze=new Maze();
const grid=[], opt=[], path=[], rands=[];
var ptrRands=0;

for (let i=0; i<dx; i++) {
    for (let j=0; j<dy; j++) {
        if (j<dy-1) grid.push(new Wall(new Point(i,j),new Point(i,j+1)));
        if (i<dx-1) grid.push(new Wall(new Point(i,j),new Point(i+1,j)));
    }
}

function clearScreen() {
    ctx.fillStyle="white";
    ctx.fillRect(0,0,canvas.width,canvas.height);
}

function removeCrossingWall(p1,p2) {
    grid.forEach((v,i)=>{
        if (v.p1.x==p1.x && v.p1.y==p1.y && v.p2.x==p1.x && p2.x-p1.x==-1 ||
            v.p1.x==p1.x && v.p1.y==p1.y && v.p2.y==p1.y && p2.y-p1.y==-1 ||
            v.p1.x==p1.x+1 && v.p1.y==p1.y && v.p2.x==v.p1.x && p2.x-p1.x==1 ||
            v.p1.x==p1.x && v.p1.y==p1.y+1 && v.p2.y==v.p1.y && p2.y-p1.y==1
        ) {
            grid.splice(i,1);
        }
    });
}

function drawGrid() {
    ctx.beginPath();
    grid.forEach(g=>{
        ctx.moveTo(d*g.p1.x,d*g.p1.y);
        ctx.lineTo(d*g.p2.x,d*g.p2.y);
    })
    ctx.stroke();
}

function drawPath() {
    ctx.beginPath();
    path.forEach(g=>{
        ctx.moveTo(d*g.p1.x+d/2,d*g.p1.y+d/2);
        ctx.lineTo(d*g.p2.x+d/2,d*g.p2.y+d/2);
    })
    ctx.stroke();
}

function mazeFull() {
    var ret=true;
    maze.m.forEach(rows=>{
        rows.forEach(cell=>{if (cell=='.') ret=false;})
    });
    return ret;
}

function drawMaze() {
    ctx.beginPath();
    for (let i=0; i<dx-1; i++) {
        for (let j=0; j<dy-1; j++) {
            if (maze.m[i][j]=='.') {
                ctx.moveTo(d*i+d/2-1, d*j+d/2-1);
                ctx.lineTo(d*i+d/2, d*j+d/2);
            }
            else if (maze.m[i][j]=='o') {
                ctx.moveTo(d*i+d/2+5, d*j+d/2);
                ctx.arc(d*i+d/2,d*j+d/2,5,0,2*Math.PI);
            }
        }
    }
    ctx.stroke();
}

function process() {
    maze.m[x][y]='o';
    var dir0=[];
    dir.forEach(d=>{
        if (x+d[0]<0 || x+d[0]>=dx-1 || y+d[1]<0 || y+d[1]>=dy-1) {
        }
        else if (maze.m[x+d[0]][y+d[1]]=='o') {
        }
        else {
            dir0.push(d);
        }
    });
    var r=Math.floor(dir0.length*Math.random());
    rands.push(r);
 //   r=rands[ptrRands++];
    var d=dir0[r];
    if (dir0.length>=1) {
        dir0.splice(r,1);
        dir0.forEach(o=>opt.push([x,y,o]));
        var p1=new Point(x,y);
        x=x+d[0]; y=y+d[1];
        var p2=new Point(x,y);
        path.push(new Wall(p1,p2));
        removeCrossingWall(p1,p2);
    }
    else if (dir0.length==0) {
        do {
            var o=opt.shift();
            if (o) { x=o[0]; y=o[1]; d=o[2]; }
        } while (maze.m[x+d[0]][y+d[1]]!='.' && !mazeFull() && o!=null)
    }
}

var ms=0, lastFrame=0; delay=0;
var x=0, y=0;

function animate() {
    ms=Date.now();
    if (ms>lastFrame+delay) {
        clearScreen();
        ctx.strokeStyle="black";
        drawGrid();
        drawMaze();
        ctx.strokeStyle="red";
        drawPath();
        lastFrame=ms;
        process();
    }
    if (mazeFull()) {
        clearScreen();
        ctx.strokeStyle="black";
        drawGrid();
    }
    else requestAnimationFrame(animate);
}

animate();
