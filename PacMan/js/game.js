class Game{
    constructor()
    {
        this.canvas = document.createElement("canvas");
    }

    updateGameArea()
    {
        myGameArea.clear();
        /*myObstacle.update();
        myGamePiece.speedX = 0;
        myGamePiece.speedY = 0;    
        if (myGameArea.keys && myGameArea.keys[37]) {myGamePiece.speedX = -1; }
        if (myGameArea.keys && myGameArea.keys[39]) {myGamePiece.speedX = 1; }
        if (myGameArea.keys && myGameArea.keys[38]) {myGamePiece.speedY = -1; }
        if (myGameArea.keys && myGameArea.keys[40]) {myGamePiece.speedY = 1; }
        myGamePiece.newPos();    
        myGamePiece.update();*/
        logic.runGameLogic();
    }

    start()
    {
        this.canvas.width = 800;
        this.canvas.height = 600;
        this.context = this.canvas.getContext("2d");
        this.canvas.style.background="black";
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.interval = setInterval(this.updateGameArea, 20);
        this.mouseX=0;
        this.mouseY=0;
        window.addEventListener('keydown', function (e) {
            myGameArea.keys = (myGameArea.keys || []);
            myGameArea.keys[e.keyCode] = true;
        })
        window.addEventListener('keyup', function (e) {
            myGameArea.keys[e.keyCode] = false;
        })
        window.addEventListener('mousedown', function (e) {
            myGameArea.mouseX = e.pageX;
            myGameArea.mouseY = e.pageY;

        })
        window.addEventListener('mouseup', function (e) {
            myGameArea.mouseX = false;
            myGameArea.mouseY = false;
        })
    }

    clear(){
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

class Component
{
    constructor(width, height, x, y) 
    {
        this.width = width;
        this.height = height;
        this.x = x;
        this.y = y;
    }    
    draw ()
    {
        this.ctx = myGameArea.context;
    }

    update()
    {  
    }
        
}

class Button extends Component
{
    constructor(width, height, x, y,color) 
    {
        super(width, height, x, y);
        this.color=color;
        this.myleft = this.x;
        this.myright = this.x + (this.width);
        this.mytop = this.y;
        this.mybottom = this.y + (this.height);
    }

    clicked () {
        this.myleft = this.x;
        this.myright = this.x + (this.width);
        this.mytop = this.y;
        this.mybottom = this.y + (this.height);
        var clicked = true;
        if ((this.mybottom < myGameArea.mouseY) || (this.mytop > myGameArea.mouseY) || (this.myright < myGameArea.mouseX) || (this.myleft > myGameArea.mouseX)) {
            clicked = false;
        }
        return clicked;
    }

    draw()
    {
        this.ctx = myGameArea.context;
        this.ctx.fillStyle = this.color;
        this.ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

class Checkpoint extends Component
{
    constructor(width, height, x, y,id)
    {
        super(width,height,x,y);
        this.id=id;
    }

    draw(x,y)
    {
        this.ctx=myGameArea.context;
        this.ctx.strokeStyle = "yellow";
        this.ctx.lineWidth=1;
        this.ctx.strokeRect(y+this.y, x+this.x,this.width, this.height);
    }
}

class Map
{
    
    constructor(textureName,obstacles,checkpoints,mapElements,directions)
    {
        this.image=document.getElementById(textureName);
        this.obstacles=obstacles;
        this.checkpoints=checkpoints;
        this.mapElements=mapElements;
        this.directions=directions;

    }

    draw(x,y)
    {
        myGameArea.context.drawImage(this.image,y,x);
        for(let i=0;i<this.mapElements.length;i++)
            this.mapElements[i].draw(x,y);
    }
}

class MapFromJson extends Map
{
    constructor(jsonFile)
    {
        let mapData=JSON.parse(jsonFile);
        let obstacles=[];
        let checkpoints=[];
        for(let i=0;i<mapData[1].length;i++)
        {
            //console.log(mapData[1][i]);
            obstacles.push(new Component(mapData[1][i].width,mapData[1][i].height,mapData[1][i].x,mapData[1][i].y));
        }

        for(let i=0;i<mapData[2].length;i++)
        {
            //console.log(mapData[2][i]);
            checkpoints.push(new Checkpoint(mapData[2][i].width,mapData[2][i].height,mapData[2][i].x,mapData[2][i].y,mapData[2][i].id));
        }

        super(mapData[0],obstacles,checkpoints,[],[]);
        this.pierceMap(mapData[3]);
        this.addDirections(this.roomMatrix,mapData[4],mapData[5],mapData[6]);
        //this.addDir(mapData[4],this.roomMatrix,mapData[5],mapData[6]);
        this.addGeneratedObstacles(mapData[5],mapData[6]);
        


        //console.log(mapData[3]);

        //let c210Data=["c210",obstacles,checkpoints,gaps,impenetrable,offsetX,offsetY];

        

    }

    pierceMap(roomMatrix)
    {
        for(let i=1;i<roomMatrix.length-1;i++)
        {
            for(let j=1;j<roomMatrix[i].length;j++)
            {
                if(roomMatrix[i][j]==1)
                    if(Math.floor(Math.random()*2)==1)
                    {
                            {
                                if(((roomMatrix[i][j-1]!=0)||(roomMatrix[i-1][j-1]!=0)||(roomMatrix[i-1][j]!=0))&&((roomMatrix[i-1][j+1]!=0)||(roomMatrix[i][j+1]!=0)||(roomMatrix[i-1][j]!=0))&&((roomMatrix[i][j+1]!=0)||(roomMatrix[i+1][j+1]!=0)||(roomMatrix[i+1][j]!=0))&&((roomMatrix[i+1][j]!=0)||(roomMatrix[i+1][j-1]!=0)||(roomMatrix[i][j-1]!=0)))
                                    roomMatrix[i][j]=0;
                            }
                    }
            }
        }

        this.roomMatrix=roomMatrix;
    }

    addDirections(roomMatrix,impenetrable,offsetX,offsetY)
    {
        let gapsCount=0;
        let gapsDirections=[];
        let directions=[];
        let roomMatrixDirections=[];
        for(let i=1;i<roomMatrix.length-1;i++)
        {
            for(let j=1;j<roomMatrix[i].length;j++)
            {
                gapsDirections=[];
                gapsCount=0;
                if(!impenetrable.includes(roomMatrix[i][j]))
                {
                    gapsCount=(!impenetrable.includes(roomMatrix[i-1][j])?1:0)+(!impenetrable.includes(roomMatrix[i+1][j])?1:0)+(!impenetrable.includes(roomMatrix[i][j-1])?1:0)+(!impenetrable.includes(roomMatrix[i][j+1])?1:0);
                    if(gapsCount>0)
                        if(gapsCount!=2)
                        {
                            if(!impenetrable.includes(roomMatrix[i-1][j]))
                                gapsDirections.push(0);
                            if(!impenetrable.includes(roomMatrix[i+1][j]))
                                gapsDirections.push(1);
                            if(!impenetrable.includes(roomMatrix[i][j-1]))
                                gapsDirections.push(2);
                            if(!impenetrable.includes(roomMatrix[i][j+1]))
                                gapsDirections.push(3);
                            directions.push(new DirectionSwitch(offsetX+48*i,offsetY+48*j,gapsDirections));
                            
                        }
                        else
                        {
                            if(((!impenetrable.includes(roomMatrix[i-1][j]))||(!impenetrable.includes(roomMatrix[i+1][j])))&&((!impenetrable.includes(roomMatrix[i][j-1]))||(!impenetrable.includes(roomMatrix[i][j+1]))))
                            {
                                if(!impenetrable.includes(roomMatrix[i-1][j]))
                                    gapsDirections.push(0);
                                if(!impenetrable.includes(roomMatrix[i+1][j]))
                                    gapsDirections.push(1);
                                if(!impenetrable.includes(roomMatrix[i][j-1]))
                                    gapsDirections.push(2);
                                if(!impenetrable.includes(roomMatrix[i][j+1]))
                                    gapsDirections.push(3);
                                directions.push(new DirectionSwitch(offsetX+48*i,offsetY+48*j,gapsDirections));
                            }
                        }
                }
            }
        }
       this.directions=directions;
    }


    addGeneratedObstacles(offsetX,offsetY)
    {
        for(let i=1;i<this.roomMatrix.length-1;i++)
        {
            for(let j=1;j<this.roomMatrix[i].length;j++)
            {
                if(this.roomMatrix[i][j]==1)
                {
                    this.mapElements.push(new MapElement(48,48,offsetX+48*i,offsetY+48*j,"obstacle"));
                    this.obstacles.push(new Component(46,46,offsetX+48*i,offsetY+48*j));
                }
            }
        }
    }

}

class MapElement extends Component
{
    constructor(width, height, x, y,textureName)
    {
        super(width,height,x,y);
        this.image=document.getElementById(textureName);
    }

    draw(x,y)
    {
        myGameArea.context.drawImage(this.image,y+this.y,x+this.x);
    }

}

class Player extends Component
{
    constructor(width, height, x, y,textureName) 
    {
        super(width, height, x, y) ;
        this.texture=document.getElementById(textureName);
        this.realX=0;
        this.realY=0;
        this.map=0;
        this.speed=2;
        this.mobs=[];
        this.collectibles=[];
    }

    addMobs(mobs)
    {
        this.mobs=mobs;
    }

    changeMap(map)
    {
        this.map=map;
    }

    hasColidedWithMob()
    {
        for(let i=0;i<this.mobs.length;i++)
        {
            if(this.hasColidedWithObject(this.mobs[i]))
                return i;
        }
        return -1;
    }

    defineCollectibles(collectibles)
    {
        this.collectibles=collectibles;
    }

    hasColidedWithCollectible()
    {
        for(let i=0;i<this.collectibles.length;i++)
        {
            if(this.hasColidedWithObject(this.collectibles[i]))
                return this.collectibles[i].id;
        }
        return -1;
    }

    hasColidedWithObject(object)
    {
        return this.isInTheObject(object)||object.isInTheObject(this);
    }

    isInTheObject(object)
    {
        let x1=this.realX;
        let y1=this.realY;
        let x2=this.realX+this.height-1;
        let y2=this.realY+this.width-1;


        
        let cx1=object.x;
        let cy1=object.y;
        let cx2=object.x+object.height-1;
        let cy2=object.y+object.width-1;

        if((x1>=cx1)&&(x1<=cx2))
        {
            if((y1>=cy1)&&(y1<=cy2))
                return true;
            if((y2>=cy1)&&(y2<=cy2))
                return true;
        }
        if((x2>=cx1)&&(x2<=cx2))
        {
            if((y1>=cy1)&&(y1<=cy2))
                return true;
            if((y2>=cy1)&&(y2<=cy2))
                return true;
        }
        

        return false;
    }

    draw()
    {
        myGameArea.context.drawImage(this.texture,this.y,this.x);
        //console.log(this.realX,this.realY);
    }

    update()
    {
        //if(this.getColidedPart()!=0)
            //console.log(this.getColidedPart())
        if (myGameArea.keys && myGameArea.keys[87]) 
            {
                for(let i=0;i<this.speed;i++)
                {
                    if(this.getColidedPart()[0]!=1) 
                        this.realX--;
                    else
                        break;
                    if(this.getCheckpointColision()!=0)
                        i=this.speed;
                }
                
            }
        if (myGameArea.keys && myGameArea.keys[83])
        {
            for(let i=0;i<this.speed;i++)
            {
                if(this.getColidedPart()[2]!=1)
                    this.realX++;
                else
                    break;
                if(this.getCheckpointColision()!=0)
                    i=this.speed;
            }
        }
        if (myGameArea.keys && myGameArea.keys[65]) 
        {
            for(let i=0;i<this.speed;i++)
            {
                if(this.getColidedPart()[3]!=1)
                    this.realY--;
                else
                    break;
                if(this.getCheckpointColision()!=0)
                    i=this.speed;
            }
        }
        if (myGameArea.keys && myGameArea.keys[68])
        {
            for(let i=0;i<this.speed;i++)
            {
                if(this.getColidedPart()[1]!=1)
                    this.realY++;
                else
                    break;
                if(this.getCheckpointColision()!=0)
                    i=this.speed;
            }
        }
    }

    getColidedPart()
    { 
        let colisions=[0,0,0,0];
        for(let i=0;i<this.map.obstacles.length;i++)
        {
            let obstacle=this.map.obstacles[i];
            for(let j=0;j<this.width;j++)
            {
                if((this.realX)==(obstacle.x+obstacle.height))
                    if(((this.realY+j)>=obstacle.y)&&((this.realY+j)<=obstacle.y+obstacle.width-1))
                    {
                        colisions[0]=1;
                        j=this.width;
                    }
                if((this.realX+this.height)==(obstacle.x))
                    if(((this.realY+j)>=obstacle.y)&&((this.realY+j)<=(obstacle.y+obstacle.width-1)))
                    {
                        colisions[2]=1;
                        j=this.width;
                    }
            }
            for(let j=0;j<this.height;j++)
            {
                if((this.realY)==(obstacle.y+obstacle.width))
                    if(((this.realX+j)>=obstacle.x)&&((this.realX+j)<=(obstacle.x+obstacle.height-1)))
                    {
                        colisions[3]=1;
                        j=this.height;
                    }
                if((this.realY+this.width)==(obstacle.y))
                    if(((this.realX+j)>=obstacle.x)&&((this.realX+j)<=(obstacle.x+obstacle.height-1)))
                    {
                        colisions[1]=1;
                        j=this.height;
                    }
            }
        }
        return colisions;
    }

    getCheckpointColision()
    {
        for(let i=0;i<this.map.checkpoints.length;i++)
        {
            let checkpoint=this.map.checkpoints[i];
            for(let j=0;j<this.width;j++)
            {
                if((this.realX)==(checkpoint.x+checkpoint.height))
                    if(((this.realY+j)>=checkpoint.y)&&((this.realY+j)<=checkpoint.y+checkpoint.width-2))
                    {
                        return checkpoint.id;
                    }
                if((this.realX+this.height)==(checkpoint.x))
                    if(((this.realY+j)>=checkpoint.y)&&((this.realY+j)<=(checkpoint.y+checkpoint.width-2)))
                    {
                        return checkpoint.id;
                    }
            }
            for(let j=0;j<this.height;j++)
            {
                if((this.realY)==(checkpoint.y+checkpoint.width))
                    if(((this.realX+j)>=checkpoint.x)&&((this.realX+j)<=(checkpoint.x+checkpoint.height-2)))
                    {
                        return checkpoint.id;
                    }
                if((this.realY+this.width)==(checkpoint.y))
                    if(((this.realX+j)>=checkpoint.x)&&((this.realX+j)<=(checkpoint.x+checkpoint.height-2)))
                    {
                        return checkpoint.id;
                    }
            }
        }
        return 0;
    }

}

class DirectionSwitch
{
    constructor(x,y,directions)
    {
        this.x=x;
        this.y=y;
        this.d=directions;
    }

    changeDirection(dir)
    {
        if(this.d.length>2)
        {
            let randomDir=this.d[Math.floor(Math.random()*this.d.length)];
            while(randomDir==this.getOpposingDirection(dir))
                randomDir=this.d[Math.floor(Math.random()*this.d.length)];
            return randomDir;

        }
        if(this.d.length==2)
        {
            if(this.d[0]==this.getOpposingDirection(dir))
                return this.d[1];
            else
                return this.d[0];
        }
        
        return this.d[0];
        


    }

    getOpposingDirection(dir)
    {
        if(dir==0)
            return 1;
        if(dir==1)
            return 0;
        if(dir==2)
            return 3;
        else
            return 2;
    }
}

class Mob extends Component
{
    constructor(width, height, x, y,textureName,map)
    {
        super(width, height, x, y);
        this.texture=document.getElementById(textureName);
        this.realX=x;
        this.realY=y;
        this.map=map;
        this.speed=1;

        let colisions=this.getColidedPart();
        if(colisions[0]==0)
            this.direction=0;
        else
            if(colisions[1]==0)
                this.direction=2;
            else
                if(colisions[2]==0)
                    this.direction=3;
                else
                    if(colisions[3]==0)
                        this.direction=1;
    }


    getColidedPart()
    { 
        let colisions=[0,0,0,0];
        for(let i=0;i<this.map.obstacles.length;i++)
        {
            let obstacle=this.map.obstacles[i];
            for(let j=0;j<this.width;j++)
            {
                if((this.x)==(obstacle.x+obstacle.height))
                    if(((this.y+j)>=obstacle.y)&&((this.y+j)<=obstacle.y+obstacle.width-1))
                    {
                        colisions[0]=1;
                        j=this.width;
                    }
                if((this.x+this.height)==(obstacle.x))
                    if(((this.y+j)>=obstacle.y)&&((this.y+j)<=(obstacle.y+obstacle.width-1)))
                    {
                        colisions[2]=1;
                        j=this.width;
                    }
            }
            for(let j=0;j<this.height;j++)
            {
                if((this.y)==(obstacle.y+obstacle.width))
                    if(((this.x+j)>=obstacle.x)&&((this.x+j)<=(obstacle.x+obstacle.height-1)))
                    {
                        colisions[3]=1;
                        j=this.height;
                    }
                if((this.y+this.width)==(obstacle.y))
                    if(((this.x+j)>=obstacle.x)&&((this.x+j)<=(obstacle.x+obstacle.height-1)))
                    {
                        colisions[1]=1;
                        j=this.height;
                    }
            }
        }
        return colisions;
    }


    checkForDirection()
    {
        let direction;
        for(let i=0;i<this.map.directions.length;i++)
        {
            direction=this.map.directions[i];
             if((this.x==direction.x-2)&&(this.y==direction.y-2))
            {
                //console.log("direction at:",direction.x,direction.y);
                //console.log("old direction:",this.direction);
                this.direction=direction.changeDirection(this.direction);
                //console.log("new direction",this.direction);
            }
                 //console.log("DIRECTION",direction.x,direction.y);

        }
    }
    update()
    {
        this.checkForDirection();
        
        if (this.direction==0) 
            {
                for(let i=0;i<this.speed;i++)
                {
                    if(this.getColidedPart()[0]!=1) 
                        this.x--;
                    else
                        break;
                    
                }
                
            }
        if (this.direction==1)
        {
            for(let i=0;i<this.speed;i++)
            {
                if(this.getColidedPart()[2]!=1)
                    this.x++;
                else
                    break;
                
            }
        }
        if (this.direction==2)
        {
            for(let i=0;i<this.speed;i++)
            {
                if(this.getColidedPart()[3]!=1)
                    this.y--;
                else
                    break;
                
            }
        }
        if (this.direction==3)
        {
            for(let i=0;i<this.speed;i++)
            {
                if(this.getColidedPart()[1]!=1)
                    this.y++;
                else
                    break;
                
            }
        }
    }

    draw(x,y)
    {
        myGameArea.context.drawImage(this.texture,y+this.y,x+this.x);
        //myGameArea.context.drawImage(this.texture,0,0);
    }

    isInTheObject(object)
    {
        let x1=this.x;
        let y1=this.y;
        let x2=this.x+this.height-1;
        let y2=this.y+this.width-1;


        
        let cx1=object.realX;
        let cy1=object.realY;
        let cx2=object.realX+object.height-1;
        let cy2=object.realY+object.width-1;
        
        if((x1>=cx1)&&(x1<=cx2))
        {
            if((y1>=cy1)&&(y1<=cy2))
                return true;
            if((y2>=cy1)&&(y2<=cy2))
                return true;
        }
        if((x2>=cx1)&&(x2<=cx2))
        {
            if((y1>=cy1)&&(y1<=cy2))
                return true;
            if((y2>=cy1)&&(y2<=cy2))
                return true;
        }
        

        return false;
    }

}


class Collectible extends Component
{
    constructor(width,height,x,y,textureName,id)
    {
        super(width,height,x,y);
        this.texture=document.getElementById(textureName);
        this.id=id;
    }

    draw(x,y)
    {
        myGameArea.context.drawImage(this.texture,y+this.y,x+this.x);
    }

    hasColidedWithObject(object)
    {
        return this.isInTheObject(object)||object.isInTheObject(this);
    }

    isInTheObject(object)
    {
        let x1=this.x;
        let y1=this.y;
        let x2=this.x+this.height-1;
        let y2=this.y+this.width-1;


        
        let cx1=object.realX;
        let cy1=object.realY;
        let cx2=object.realX+object.height-1;
        let cy2=object.realY+object.width-1;
        
        if((x1>=cx1)&&(x1<=cx2))
        {
            if((y1>=cy1)&&(y1<=cy2))
                return true;
            if((y2>=cy1)&&(y2<=cy2))
                return true;
        }
        if((x2>=cx1)&&(x2<=cx2))
        {
            if((y1>=cy1)&&(y1<=cy2))
                return true;
            if((y2>=cy1)&&(y2<=cy2))
                return true;
        }
        

        return false;
    }

}



class gameLogic
{
    constructor()
    {
        this.state=0;
    }

    runGameLogic()
    {
        if(this.state==0)
        {
            this.loadPlayerDetails()
            this.state++;
            return 0;
        }
        if(this.state==1)
        {
            this.displayCharacter()
            if (this.myButton.clicked())
            {
                console.log("button clicked");
                this.state++;
            }
            return 0;
        }
        if(this.state==2)//load ground floor map
        {
            this.loadGroundLevelGame();
            this.state++;
            return 0;
        }
        if(this.state==3)//play ground floor map
        {
            let checkpoint=0;
            checkpoint=this.displayGroundLevelMap();
            if(checkpoint=="c210")
                this.state++;

            return 0;
        }
        if(this.state==4)//load c210 map
        {
            this.loadC210Map();
            this.state++;
            return 0;
        }
        if(this.state==5)//play c210 map
        {
            this.displayC210Map();
            return 0;
        }
        
    }


    loadPlayerDetails()
    {
        console.log("loaded character details");
        this.image=document.getElementById("legitimatie");
        this.avatar=document.getElementById("avatarImg");
        this.myButton=new Button(30, 30, 375, 512,"red");
    }
    displayCharacter()
    {
        //console.log("displaying character details");
        myGameArea.context.drawImage(this.image, 10, 10);
        myGameArea.context.drawImage(this.avatar, 50, 335);
        myGameArea.context.font = "30px Arial";
        myGameArea.context.fillStyle = "black";
        myGameArea.context.fillText("Hello World",360, 300);
        this.myButton.draw();
        
        
    }
    loadGroundLevelGame()
    {
        let obstacles=[];        
        obstacles[0]=new Component(648,24,84,84);
        obstacles[1]=new Component(72,12,90,732);
        obstacles[2]=new Component(1416,24,84,804);
        obstacles[3]=new Component(24,1272,84,84);
        obstacles[4]=new Component(24,312,84,660);
        obstacles[5]=new Component(24,312,84,804);
        obstacles[6]=new Component(24,312,84,996);
        obstacles[7]=new Component(24,504,324,1668);
        obstacles[8]=new Component(456,24,372,84);
        obstacles[9]=new Component(72,12,378,540);
        obstacles[10]=new Component(72,24,372,612);
        obstacles[11]=new Component(552,24,372,996);
        obstacles[12]=new Component(72,9,379,1548);
        obstacles[13]=new Component(72,24,372,1620);

        obstacles[14]=new Component(12,42,396,1338);
        obstacles[15]=new Component(72, 24, 468, 84);
        obstacles[16]=new Component(72,10,475,156);
        obstacles[17]=new Component(312,24,468,228);
        obstacles[18]=new Component(120,120,468,612);
        obstacles[19]=new Component(24,840,516,1524);
        obstacles[20]=new Component(204,12,522,1338);
        obstacles[21]=new Component(12,60,522,1338);
        obstacles[22]=new Component(24,312,468,372);
        obstacles[23]=new Component(24,72,468,516);
        obstacles[24]=new Component(12,348,666,1338);
        obstacles[25]=new Component(24,72,612,516);
        obstacles[26]=new Component(103,14,617,372);
        obstacles[27]=new Component(168,24,756,372);
		obstacles[28]=new Component(696,24,804,1524);
        obstacles[29]=new Component(24,120,756,516);
        obstacles[30]=new Component(10,72,876,523);
        obstacles[31]=new Component(24,72,948,516);
        obstacles[32]=new Component(120,120,900,900);
        obstacles[33]=new Component(204,12,1002,1338);
        obstacles[34]=new Component(120,24,900,1236);
        obstacles[35]=new Component(72,312,900,1236);
        obstacles[36]=new Component(72,10,1003,540);
        obstacles[37]=new Component(24,360,996,612);
        obstacles[38]=new Component(60,12,1242,618);
        obstacles[39]=new Component(204,12,1242,762);
        obstacles[40]=new Component(12,83,1254,810);
        obstacles[41]=new Component(12,83,1254,954);
        obstacles[42]=new Component(571,12,1337,617);



        obstacles[43]=new Component(38,28,447,1109);
		obstacles[44]=new Component(3,3,481,1098);
		obstacles[45]=new Component(80,42,484,1065);
		
		obstacles[46]=new Component(91,50,534,1439); //computer
		obstacles[47]=new Component(35,15,608,1495); //computer

		obstacles[48]=new Component(37,34,679,1494);
		obstacles[49]=new Component(43,143,721,1348);
		obstacles[50]=new Component(44,38,774,1394);
		obstacles[51]=new Component(88,40,963,1398);
		
		obstacles[52]=new Component(2,1,867,1210); //trash
		obstacles[53]=new Component(2,1,868,1211); //trash
		obstacles[54]=new Component(2,1,869,1212); //trash
		obstacles[55]=new Component(2,1,870,1213); //trash
		obstacles[56]=new Component(2,1,871,1214); //trash
		obstacles[57]=new Component(2,1,872,1215); //trash
		obstacles[58]=new Component(2,1,873,1216); //trash
		obstacles[59]=new Component(20,21,874,1202); //trash
		
		obstacles[60]=new Component(93,35,871,1249);
		obstacles[61]=new Component(38,30,921,1205);
		obstacles[62]=new Component(65,127,1205,1209);
		obstacles[63]=new Component(32,35,1302,1160);


        let checkpoints=[];
        checkpoints[0]=new Checkpoint(1619-1548,9,380,1548,"c210");


        var groundFloorData=["map",obstacles,checkpoints,[],[]];
        let zeJs=JSON.stringify(groundFloorData);
        //console.log(zeJs);
        //var loadedJson=JSON.parse(zeJs);
        this.groundFloorMap=new MapFromJson(zeJs);
        //let test=new MapFromJson(zeJs);
        //console.log(JSON.stringify(groundFloorData));
        
        //this.groundFloorMap=new Map("map",obstacles,checkpoints,[],[]);
        this.player=new Player(50,50,275,375,"player");

      

        this.player.changeMap(this.groundFloorMap)

        //this.player.realX=1270;
        //this.player.realY=700;

        
        this.player.realX=450;
        this.player.realY=1550;

        //var myJson=JSON.stringify(obstacles);
        //console.log(myJson);
        
        //this.mainEntranceX=1270;
        //this.mainEntranceY=700;

        //this.c210X=420;
        //this.c210Y=1560;
        
    }
    displayGroundLevelMap()
    {
        this.groundFloorMap.draw(0-(this.player.realX)+this.player.x,0-(this.player.realY)+this.player.y);
        this.groundFloorMap.checkpoints[0].draw(0-(this.player.realX)+this.player.x,0-(this.player.realY)+this.player.y);


        this.player.update();
        this.player.draw();

        if(this.player.getCheckpointColision()!=0)
            if(this.player.getCheckpointColision()=="c210")
                return "c210";
    }

    loadC210Map()
    {
        let obstacles=[];
        let checkpoints=[];
        let mapElements=[];
        this.collectibles=[];
        

        let offsetX=144-48;
        let offsetY=144-48;
/*let gaps=
        [
        [9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9],
        [9,1,1,1,1,1,1,1,2,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,9],
        [9,1,0,0,1,0,0,1,2,2,1,0,0,0,0,0,0,0,0,0,0,0,0,1,9],
        [9,1,0,1,1,1,0,1,2,2,1,1,1,1,1,1,1,1,1,1,1,1,0,1,9],
        [9,1,0,0,0,1,0,1,2,2,1,0,0,0,0,0,0,0,0,0,0,0,0,1,9],
        [9,1,0,1,0,1,0,1,2,2,1,0,1,0,1,1,1,1,1,1,1,1,1,1,9],
        [9,1,0,1,1,1,0,1,2,2,1,0,1,1,1,0,1,0,0,0,0,0,0,0,9],
        [9,1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,0,9],
        [9,1,1,1,1,1,1,1,2,2,0,0,1,1,1,1,1,0,0,0,0,0,0,0,9],
        [9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9]
        ];*/

        let gaps=
        [
        [9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9],
        [9,1,1,1,1,1,1,1,2,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,9],
        [9,1,0,0,1,0,0,1,2,2,1,0,0,0,0,0,0,0,0,0,0,0,0,1,9],
        [9,1,0,1,1,1,0,1,2,2,1,1,1,1,1,1,1,1,1,1,1,1,0,1,9],
        [9,1,0,0,0,1,0,1,2,2,1,0,0,0,0,0,0,0,0,0,0,0,0,1,9],
        [9,1,0,1,0,1,0,1,2,2,1,0,1,0,1,1,1,1,1,1,1,1,1,1,9],
        [9,1,0,1,1,1,0,1,2,2,1,0,1,1,1,0,1,0,0,0,0,0,0,0,9],
        [9,1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,0,9],
        [9,1,1,1,1,1,1,1,2,2,0,0,1,1,1,1,1,0,0,0,0,0,0,0,9],
        [9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9]
        ];
        let impenetrable=[1,2,9];

        /*for(let i=1;i<9;i++)
        {
            for(let j=1;j<24;j++)
            {
                if(gaps[i][j]==1)
                    if(Math.floor(Math.random()*2)==1)
                    {
                            {
                                if(((gaps[i][j-1]!=0)||(gaps[i-1][j-1]!=0)||(gaps[i-1][j]!=0))&&((gaps[i-1][j+1]!=0)||(gaps[i][j+1]!=0)||(gaps[i-1][j]!=0))&&((gaps[i][j+1]!=0)||(gaps[i+1][j+1]!=0)||(gaps[i+1][j]!=0))&&((gaps[i+1][j]!=0)||(gaps[i+1][j-1]!=0)||(gaps[i][j-1]!=0)))
                                    gaps[i][j]=0;
                            }
                    }
            }
        }

        let gapsCount=0;
        let gapsDirections=[];
        let directions=[];



        for(let i=1;i<9;i++)
        {
            for(let j=1;j<24;j++)
            {
                gapsDirections=[];
                gapsCount=0;
                if(!impenetrable.includes(gaps[i][j]))
                {
                    gapsCount=(!impenetrable.includes(gaps[i-1][j])?1:0)+(!impenetrable.includes(gaps[i+1][j])?1:0)+(!impenetrable.includes(gaps[i][j-1])?1:0)+(!impenetrable.includes(gaps[i][j+1])?1:0);
                    if(gapsCount>0)
                        if(gapsCount!=2)
                        {
                            if(!impenetrable.includes(gaps[i-1][j]))
                                gapsDirections.push(0);
                            if(!impenetrable.includes(gaps[i+1][j]))
                                gapsDirections.push(1);
                            if(!impenetrable.includes(gaps[i][j-1]))
                                gapsDirections.push(2);
                            if(!impenetrable.includes(gaps[i][j+1]))
                                gapsDirections.push(3);
                            directions.push(new DirectionSwitch(offsetX+48*i,offsetY+48*j,gapsDirections));
                            
                        }
                        else
                        {
                            if(((!impenetrable.includes(gaps[i-1][j]))||(!impenetrable.includes(gaps[i+1][j])))&&((!impenetrable.includes(gaps[i][j-1]))||(!impenetrable.includes(gaps[i][j+1]))))
                            {
                                if(!impenetrable.includes(gaps[i-1][j]))
                                    gapsDirections.push(0);
                                if(!impenetrable.includes(gaps[i+1][j]))
                                    gapsDirections.push(1);
                                if(!impenetrable.includes(gaps[i][j-1]))
                                    gapsDirections.push(2);
                                if(!impenetrable.includes(gaps[i][j+1]))
                                    gapsDirections.push(3);
                                directions.push(new DirectionSwitch(offsetX+48*i,offsetY+48*j,gapsDirections));
                            }
                        }
                    //console.log(i,j,":",gapsCount);
                    //if((gaps[i-1],j==0)&&(gaps[i][j-1]==0)&&(gaps[i],[j+1]==0))||((gaps[i+1],j==0)&&(gaps[i][j-1]==0)&&(gaps[i],[j+1]==0))
                }
            }
        }

        //for(let i=0;i<directions.length;i++)
          //  console.log(directions[i].x,directions[i].y,directions[i].d);


        for(let i=0;i<9;i++)
        {
            for(let j=0;j<24;j++)
            {
                if(gaps[i][j]==1)
                {
                    mapElements.push(new MapElement(48,48,offsetX+48*i,offsetY+48*j,"obstacle"));
                    obstacles.push(new Component(46,46,offsetX+48*i,offsetY+48*j));
                }
            }
        }*/


        let c210Data=["c210",[],checkpoints,gaps,impenetrable,offsetX,offsetY];
        let c210JSON=JSON.stringify(c210Data);
        console.log(c210JSON);
        //var c210FromJson=new MapFromJson(c210JSON);

        //this.c210Map=new Map("c210",obstacles,checkpoints,mapElements,directions);

        this.c210Map=new MapFromJson(c210JSON);

       

        this.player.changeMap(this.c210Map);
        this.player.realX=500;
        this.player.realY=600;
        this.player.map=this.c210Map;

        //288 336
        //288 288
        this.mobs=[];
        
        //this.mob=new Mob(50,50,334,286,"mobFace",this.c210Map);
        //this.mob2=new Mob(50,50,286,286,"mobFace",this.c210Map);
        this.mobs.push(new Mob(50,50,334,286,"varlan",this.c210Map));
        this.mobs.push(new Mob(50,50,286,286,"vlad",this.c210Map));

        this.player.addMobs(this.mobs);
        //constructor(width, height, x, y,textureName,map);


        //628 251
        this.collectibles.push(new Collectible(40,25,299,628,"arduino","arduino"));
        this.player.defineCollectibles(this.collectibles);
    }

    displayC210Map()
    {
        this.player.update();
        for(let i=0;i<this.mobs.length;i++)
            this.mobs[i].update();
        //this.mob.update();
        this.c210Map.draw(0-(this.player.realX)+this.player.x,0-(this.player.realY)+this.player.y);

        for(let i=0;i<this.collectibles.length;i++)
            this.collectibles[i].draw(0-(this.player.realX)+this.player.x,0-(this.player.realY)+this.player.y);

        //this.mob.draw(0-(this.player.realX)+this.player.x,0-(this.player.realY)+this.player.y);
        for(let i=0;i<this.mobs.length;i++)
            this.mobs[i].draw(0-(this.player.realX)+this.player.x,0-(this.player.realY)+this.player.y);
        

        
        this.player.draw();
        
        if(this.player.hasColidedWithMob()!=-1)
        {
            console.log(this.player.hasColidedWithMob());
            this.state=4;
        }

        if(this.player.hasColidedWithCollectible()!=-1)
        {
            console.log(this.player.hasColidedWithCollectible());
            if(this.player.hasColidedWithCollectible()=="arduino")
            {
                this.collectibles=[];
                this.player.collectibles=[];


            }
        }
        
    }

}
















//var myGamePiece;
var myGameArea=new Game();
var logic=new gameLogic();

function startGame() {
    //myGamePiece = new component(30, 30, "red", 10, 120);
    myGameArea.start();
    //myObstacle = new component(10, 200, "green", 300, 120);
    
}




/*class Component
{
    constructor(width, height, color, x, y) 
    {
        this.width = width;
        this.height = height;
        this.speedX = 0;
        this.speedY = 0;
        this.x = x;
        this.y = y;
        this.color=color;
    }    
    draw ()
    {
        this.ctx = myGameArea.context;
        this.ctx.fillStyle = this.color;
        this.ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    update()
    {
        this.x += this.speedX;
        this.y += this.speedY;        
    }
        
}*/