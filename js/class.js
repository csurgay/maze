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
