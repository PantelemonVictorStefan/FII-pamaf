class Game{
    constructor()
    {
        
        this.canvas=document.getElementById("gameCanvas");
    }

    updateGameArea()
    {
        myGameArea.clear();
        logic.runGameLogic();
    }

    start()
    {
        this.canvas.width = 800;
        this.canvas.height = 600;
        this.context = this.canvas.getContext("2d");
        this.canvas.style.background="black";
        
        this.interval = setInterval(this.updateGameArea, 20);
        this.mouseX=0;
        this.mouseY=0;
        this.mouseHoverX=0;
        this.mouseHoverY=0;
        window.addEventListener('keydown', function (e) {
            myGameArea.keys = (myGameArea.keys || []);
            myGameArea.keys[e.keyCode] = true;
        })
        window.addEventListener('keyup', function (e) {
            myGameArea.keys[e.keyCode] = false;
        })
        window.addEventListener('mousedown', function (e) {
            myGameArea.mouseX = e.pageX-myGameArea.canvas.offsetLeft;
            myGameArea.mouseY = e.pageY-myGameArea.canvas.offsetTop;

        })
        window.addEventListener('mouseup', function (e) {
            myGameArea.mouseX = false;
            myGameArea.mouseY = false;
        })
        window.addEventListener('mousemove', function (e) {
            myGameArea.mouseHoverX=e.pageX-myGameArea.canvas.offsetLeft;
            myGameArea.mouseHoverY=e.pageY-myGameArea.canvas.offsetTop;
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
    constructor(width, height, x, y,textureName) 
    {
        super(width, height, x, y);
        this.myleft = this.x;
        this.myright = this.x + (this.width);
        this.mytop = this.y;
        this.mybottom = this.y + (this.height);
        this.texture=document.getElementById(textureName);
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
        if (!((this.mybottom < myGameArea.mouseHoverY) || (this.mytop > myGameArea.mouseHoverY) || (this.myright < myGameArea.mouseHoverX) || (this.myleft > myGameArea.mouseHoverX)))
        {
        this.ctx = myGameArea.context;
        myGameArea.context.drawImage(this.texture,this.x,this.y);
        //this.ctx.fillStyle = this.color;
        //this.ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
}

class HeaderUI extends Component
{
    constructor(width, height, x, y,linesToDisplay)
    {
        super(width, height, x, y);
        this.linesToDisplay=linesToDisplay;
        this.line=0;
    }

    draw()
    {
        this.ctx = myGameArea.context;
        this.ctx.fillStyle = "black";
        this.ctx.fillRect(this.x, this.y, this.width, this.height);
        myGameArea.context.font = "19px Arial";
        myGameArea.context.fillStyle = "yellow";
        myGameArea.context.fillText("Objective:",0, 30);
        myGameArea.context.fillText("Score:",600, 20);
        myGameArea.context.fillText("Global Score:",550, 45);
        myGameArea.context.fillStyle = "red";
        myGameArea.context.fillText(globalScore,675, 45);
    }

    displayObjective()
    {
        myGameArea.context.fillStyle = "yellow";
        myGameArea.context.fillText(this.linesToDisplay[this.line],100, 30);
    }

    displayScore(value)
    {
        myGameArea.context.fillStyle = "green";
        myGameArea.context.fillText(value,675, 20);
    }

    incrementLine()
    {
        this.line++;
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
            obstacles.push(new Component(mapData[1][i].width,mapData[1][i].height,mapData[1][i].x,mapData[1][i].y));
        }

        for(let i=0;i<mapData[2].length;i++)
        {
            checkpoints.push(new Checkpoint(mapData[2][i].width,mapData[2][i].height,mapData[2][i].x,mapData[2][i].y,mapData[2][i].id));
        }

        super(mapData[0],obstacles,checkpoints,[],[]);
        this.pierceMap(mapData[3]);
        this.addDirections(this.roomMatrix,mapData[4],mapData[5],mapData[6]);
        this.addGeneratedObstacles(mapData[5],mapData[6]);
        this.offsetX=mapData[5];
        this.offsetY=mapData[6];
        this.collectibles=[];
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
        let elements=["obstacle1","obstacle2","obstacle3"];
        
        for(let i=1;i<this.roomMatrix.length-1;i++)
        {
            for(let j=1;j<this.roomMatrix[i].length;j++)
            {
                if(this.roomMatrix[i][j]==1)
                {
                    this.mapElements.push(new MapElement(48,48,offsetX+48*i,offsetY+48*j,elements[Math.floor(Math.random() * elements.length)]));
                    this.obstacles.push(new Component(46,46,offsetX+48*i,offsetY+48*j));
                }
            }
        }
    }

    getWalkable()
    {
        let walkingZones=[]
        for(let i=1;i<this.roomMatrix.length-1;i++)
        {
            for(let j=1;j<this.roomMatrix[i].length;j++)
            {
                if(this.roomMatrix[i][j]==0)
                {
                    let point=[]
                    point[0]=this.offsetX+48*i;
                    point[1]=this.offsetY+48*j;
                    walkingZones.push(point);
                }
            }
        }
        return walkingZones;
    }

    setCollectibles(collectibles)
    {
        this.collectibles=collectibles;
    }

    removeCollectible(item)
    {
        this.collectibles.splice(this.collectibles.indexOf(item),1);
    }

    draw(x,y)
    {
        myGameArea.context.drawImage(this.image,y,x);
        for(let i=0;i<this.mapElements.length;i++)
            this.mapElements[i].draw(x,y);
        for(let i=0;i<this.collectibles.length;i++)
            this.collectibles[i].draw(x,y);
        
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

    getCollectibles()
    {
        this.collectibles=this.map.collectibles;
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

    hasColidedWithCollectible()
    {
        for(let i=0;i<this.collectibles.length;i++)
        {
            if(this.hasColidedWithObject(this.collectibles[i]))
                return this.collectibles[i];
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
    }

    update()
    {
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
                this.direction=direction.changeDirection(this.direction);
                return true;
            }
        }
        return false;
    }

    update()
    {
       
        for(let i=0;i<this.speed;i++)
        {
            this.checkForDirection();
            if (this.direction==0) 
            {
                {
                        
                        if(this.getColidedPart()[0]!=1) 
                            this.x--;
                }
            }
            if (this.direction==1)
            {
                {
                    if(this.getColidedPart()[2]!=1)
                        this.x++;
                }
            }
            if (this.direction==2)
            {
                {
                
                    if(this.getColidedPart()[3]!=1)
                        this.y--;
                }
            }
            if (this.direction==3)
            {
                {
                    if(this.getColidedPart()[1]!=1)
                        this.y++;
                }
            }
        }
    }

    draw(x,y)
    {
        myGameArea.context.drawImage(this.texture,y+this.y,x+this.x);
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
    constructor(width,height,x,y,textureName,id,type,scoreValue)
    {
        super(width,height,x,y);
        this.texture=document.getElementById(textureName);
        this.id=id;
        this.type=type;
        this.scoreValue=scoreValue;
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
        this.pause=false;
        if(localStorage.getItem("Score")!=null)
        {
            globalScore=Number(localStorage.getItem("Score"));
        }
    }

    canPause()
    {
        if(this.keyPwasPressed())
            this.handlePause();
        if(this.pause)
        {
            this.displayPauseScreen();
            return true;
        }
        
    }

    keyPwasPressed()
    {
        if(this.keyP==true)
        {
            if (!(myGameArea.keys && myGameArea.keys[80]))
            {     
                
                this.keyP=false;
                return true;
            }
        }
        if (myGameArea.keys && myGameArea.keys[80])
            this.keyP=true;
        return false;
            
    }

    handlePause()
    {
            if(this.pause==false)
            {
                this.pause=true;
            }
            else
            {
                this.pause=false;
            }
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
                //console.log("button clicked");
                this.state++;
            }
            return 0;
        }
        if(this.state==2)//load ground floor map
        {
            if(localStorage.getItem("groundFloorMap")!=null)
            {
                this.data=localStorage.getItem("groundFloorMap");
                console.log("Map loaded from local storage");
            }
            else
            {
            
                if(requestHandler.state=="idle")
                {
                    requestHandler.sendRequest("resources/maps/json/groundFloorMap.json");
                    return 1;
                }
                if(requestHandler.state=="waiting")
                {
                if(requestHandler.checkForData())
                {
                        this.data=requestHandler.getData();
                        localStorage.setItem("groundFloorMap",this.data);
                        console.log("Map loaded from local server");
                }
                    else
                    {
                        return 1;
                    }
                }
            }
            this.loadGroundLevelGame(this.data);
            this.state++;
            return 0;
        }
        if(this.state==3)//play ground floor map
        {
            if(this.canPause())
                return 0;
            
            let checkpoint=0;
            checkpoint=this.displayGroundLevelMap();
            if(checkpoint=="c210")
                this.state++;

            return 0;
        }
        if(this.state==4)//load c210 map
        {
            if(localStorage.getItem("C210Map")!=null)
            {
                this.data=localStorage.getItem("C210Map");
                console.log("Map loaded from local storage");
            }
            else
            {
                if(requestHandler.state=="idle")
                {
                    requestHandler.sendRequest("resources/maps/json/c210.json");
                    return 1;
                }
                if(requestHandler.state=="waiting")
                {
                    if(requestHandler.checkForData())
                    {
                            this.data=requestHandler.getData();
                            localStorage.setItem("C210Map",this.data);
                            console.log("Map loaded from local server");
                    }
                    else
                    {
                        return 1;
                    }
                }
            }
            this.loadC210Map(this.data);
            this.state++;
            return 0;
        }
        if(this.state==5)//play c210 map
        {
            if(this.canPause())
                return 0;
            this.displayC210Map();
            return 0;
        }
        
    }

    loadPlayerDetails()
    {
        //console.log("loaded character details");
        this.image=document.getElementById("legitimatie");
        this.avatar=document.getElementById("avatarImg");
        this.myButton=new Button(172, 67, 296, 479,"signature");
    }

    displayCharacter()
    {
        //console.log("displaying character details");
        myGameArea.context.drawImage(this.image, 10, 10);
        myGameArea.context.drawImage(this.avatar, 50, 335);
        myGameArea.context.font = "30px Arial";
        myGameArea.context.fillStyle = "black";
        myGameArea.context.fillText("Hello World",360, 300);
        myGameArea.context.font = "bold 35px Arial";
        myGameArea.context.fillText(globalScore,310, 166);
        this.myButton.draw();
    }

    loadGroundLevelGame(data)
    {
        this.groundFloorMap=new MapFromJson(data);
        this.player=new Player(50,50,275,375,"player");
        this.player.changeMap(this.groundFloorMap)

        this.player.realX=1270;
        this.player.realY=700;

        
        //this.player.realX=450;
        //this.player.realY=1550;

        let lines=[];
        lines.push("Go to C210");
        this.gameUI=new HeaderUI(800,50,0,0,lines);
    }
    displayGroundLevelMap()
    {
        this.groundFloorMap.draw(0-(this.player.realX)+this.player.x,0-(this.player.realY)+this.player.y);
        this.groundFloorMap.checkpoints[0].draw(0-(this.player.realX)+this.player.x,0-(this.player.realY)+this.player.y);


        this.player.update();
        this.player.draw();

        this.gameUI.draw();
        this.gameUI.displayObjective();

        if(this.player.getCheckpointColision()!=0)
            if(this.player.getCheckpointColision()=="c210")
                return "c210";
    }

    loadC210Map(data)
    {
        this.collectibles=[];
        this.c210Map=new MapFromJson(data);

        this.player.changeMap(this.c210Map);
        this.player.realX=500;
        this.player.realY=598;
        this.player.map=this.c210Map;

        //288 336
        //288 288
        this.mobs=[];
        this.mobs.push(new Mob(50,50,310,350,"varlan",this.c210Map));
        this.mobs.push(new Mob(50,50,310,300,"vlad",this.c210Map));
        this.mobs[0].direction=3;
        this.mobs[1].direction=2;

        this.player.addMobs(this.mobs);


        //628 251
        let spawns=this.c210Map.getWalkable();
        let spawn=spawns[Math.floor((Math.random() * spawns.length) + 1)];
        this.collectibles.push(new Collectible(40,25,spawn[0],spawn[1],"arduino","arduino","story",30));
        this.c210Map.setCollectibles(this.collectibles);
        this.PlayerScore=0;

        this.gameUI.linesToDisplay.push("Find and collect the Arduino to begin");
        this.gameUI.linesToDisplay.push("Let the fun begin, collect minimum 50 points to win");
        this.gameUI.linesToDisplay.push("Now you can leave the room or collect more points");
        this.gameUI.incrementLine();
        
        this.round=1;
    }

    displayC210Map()
    {
        this.player.update();
        
        for(let i=0;i<this.mobs.length;i++)
            this.mobs[i].update();
        this.c210Map.draw(0-(this.player.realX)+this.player.x,0-(this.player.realY)+this.player.y);

        for(let i=0;i<this.mobs.length;i++)
            this.mobs[i].draw(0-(this.player.realX)+this.player.x,0-(this.player.realY)+this.player.y);
        

        this.player.getCollectibles();
        this.player.draw();



        this.gameUI.draw();
        this.gameUI.displayObjective();

        this.gameUI.displayScore(this.PlayerScore);
        
        if(this.player.hasColidedWithMob()!=-1)
        {
            alert("You died!");
            this.gameUI.line=0;
            this.state=4;
        }

        let collectedItem=this.player.hasColidedWithCollectible();
        if(collectedItem!=-1)
        {
            this.c210Map.removeCollectible(collectedItem);
            if(collectedItem.type=="story")
                if(collectedItem.id=="arduino")
                {
                    this.gameUI.incrementLine();
                    this.PlayerScore+=collectedItem.scoreValue;
                    this.collectibles=[];
                    let walkable=this.c210Map.getWalkable();
                    for(let i=0;i<walkable.length;i++)
                    {
                        this.collectibles.push(new Collectible(40,25,walkable[i][0],walkable[i][1],"raspberry","arduino"+i,"score",1));
                    }
                    this.c210Map.setCollectibles(this.collectibles);
                    this.mobs.push(new Mob(50,50,502,598,"gabi",this.c210Map));
                    this.mobs.push(new Mob(50,50,502,598,"victor",this.c210Map));
                    this.mobs[2].direction=0;
                    this.mobs[3].direction=0;
                    this.mobs[0].speed=2;
                    this.mobs[3].speed=2;



                }
            if(collectedItem.type=="score")
            {
                this.PlayerScore+=collectedItem.scoreValue;
            }
        }

        if(this.PlayerScore>=50)
        {

            if(this.c210Map.checkpoints.length==0)
            {
                this.c210Map.checkpoints.push(new Checkpoint(1619-1548,9,570,588,"c210Exit"));
                this.gameUI.incrementLine();
            }
            this.c210Map.checkpoints[0].draw(0-(this.player.realX)+this.player.x,0-(this.player.realY)+this.player.y);
            if(this.player.getCheckpointColision()!=0)
                if(this.player.getCheckpointColision()=="c210Exit")
                {
                    globalScore=globalScore+this.PlayerScore;
                    localStorage.setItem("Score",globalScore);
                    this.gameUI.line=0;
                    this.state=3;
                    this.player.realX=450;
                    this.player.realY=1550;
                    this.player.changeMap(this.groundFloorMap);
                }
        }
        
        if(this.PlayerScore>=100)
        {
            if(this.collectibles.length==0)
            {
                this.round++;
                this.mobs.push(new Mob(50,50,502,598,"mobFace",this.c210Map));
                this.mobs[this.mobs.length-1].direction=0;
                let walkable=this.c210Map.getWalkable();
                for(let i=0;i<walkable.length;i++)
                {
                    this.collectibles.push(new Collectible(40,25,walkable[i][0],walkable[i][1],"raspberry","arduino"+i,"score",this.round));
                }
                this.c210Map.setCollectibles(this.collectibles);
            }
        }
        
    }

    displayPauseScreen()
    {
        myGameArea.context.font = "50px Arial";
        myGameArea.context.fillStyle = "white";
        myGameArea.context.fillText("PAUSED",300, 300);
        myGameArea.context.font = "30px Arial";
        myGameArea.context.fillText("PRESS P TO RESUME",250, 400);
    }

}

var rsp="unchanged";
class RequestHandler
{

    constructor()
    {
        this.data="";
        this.state="idle";
        
    }

    sendRequest(url)
    {
        let xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            rsp=this.responseText;
            console.log("it is done");
            }
        };

    
        xmlhttp.open("GET", url, true);
        xmlhttp.send(); 
        this.state="waiting";
    }

    checkForData()
    {
        if(rsp=="unchanged")
            return false;
        this.state="completed";
        return true;
    }

    getData()
    {
        this.state="idle";
        this.data=rsp;
        rsp="unchanged";
        return this.data;
    }

    
}



var globalScore=0;
var myGameArea=new Game();
var logic=new gameLogic();
var requestHandler=new RequestHandler();

function startGame() {
    console.log("game started");
    myGameArea.start();
}
