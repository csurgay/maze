const dir=[ [1,0],[0,1],[-1,0],[0,-1] ];

class Point {
    constructor(x,y) {
        this.x=x;
        this.y=y;
    }
}

class Wall {
    constructor(p1,p2) {
        this.p1=p1;
        this.p2=p2;
    }
}

class Maze {
    constructor() {
        this.m=[];
        for (let i=0; i<dx-1; i++) {
            this.m.push(new Array(dy-1).fill("."));
        }
    }
}

function colorTest() {
    colors.forEach(c=>{
        ctx.fillStyle=c;
        ctx.fillRect(0,0,500,500);
        console.log(c);
    });
}

function initAllWalls() {
    for (let i=0; i<dx; i++) {
        for (let j=0; j<dy; j++) {
            if (j<dy-1 && !(i==0 && j==0) && !(i==dx-1 && j==dy-2)) {
                grid.push(new Wall(new Point(i,j),new Point(i,j+1)));
            }
            if (i<dx-1) {
                grid.push(new Wall(new Point(i,j),new Point(i+1,j)));
            }
        }
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
    path.forEach(g=>{
        ctx.beginPath();
        ctx.strokeStyle=g.color;
        ctx.moveTo(d*g.wall.p1.x+d/2,d*g.wall.p1.y+d/2);
        ctx.lineTo(d*g.wall.p2.x+d/2,d*g.wall.p2.y+d/2);
        ctx.stroke();
    })
}

function drawUserPath() {
    x=0; y=d/2;
        userPath.forEach(g=>{
        ctx.beginPath();
        ctx.strokeStyle="red";
        ctx.lineWidth=5;
        ctx.moveTo(x,y);
        ctx.lineTo(g.x,g.y);
        x=g.x; y=g.y;
        ctx.stroke();
    })
}

function mazeFull() {
    var ret=true;
    maze.m.forEach(rows=>{
        rows.forEach(cell=>{if (cell=='.') ret=false;})
    });
    return ret;
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
    var d=dir0[r];
    if (dir0.length>=1) {
        dir0.splice(r,1);
        dir0.forEach(o=>opt.push([x,y,o]));
        var p1=new Point(x,y);
        x=x+d[0]; y=y+d[1];
        var p2=new Point(x,y);
        path.push({ color: colors[ptrColor], wall: new Wall(p1,p2) });
        removeCrossingWall(p1,p2);
    }
    else if (dir0.length==0) {
        //ptrColor=(ptrColor+1)%colors.length;
        do {
            var o=opt.shift();
            if (o) { x=o[0]; y=o[1]; d=o[2]; }
        } while (!mazeFull() && o!=null && maze.m[x+d[0]][y+d[1]]!='.')
    }
}
