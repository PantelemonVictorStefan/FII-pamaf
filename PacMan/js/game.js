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
    constructor(textureName,obstacles,checkpoints,mapElements)
    {
        this.image=document.getElementById(textureName);
        this.obstacles=obstacles;
        this.checkpoints=checkpoints;
        this.mapElements=mapElements;

    }

    draw(x,y)
    {
        myGameArea.context.drawImage(this.image,y,x);
        for(let i=0;i<this.mapElements.length;i++)
            this.mapElements[i].draw(x,y);
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
    }

    changeMap(map)
    {
        this.map=map;
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

/*class Mob extends Component
{
    constructor(width, height, x, y,textureName,map)
    {
        super(width, height, x, y);
        
    }
}*/

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
        this.image=document.getElementById("myImg");
        this.avatar=document.getElementById("avatarImg");
        this.myButton=new Button(30, 30, 400, 400,"red");
    }
    displayCharacter()
    {
        //console.log("displaying character details");
        myGameArea.context.drawImage(this.image, 10, 10);
        myGameArea.context.drawImage(this.avatar, 25, 135);
        myGameArea.context.font = "30px Arial";
        myGameArea.context.fillStyle = "black";
        myGameArea.context.fillText("Hello World",120, 35);
        this.myButton.draw();
        
        
    }
    loadGroundLevelGame()
    {
        let obstacles=[];
        /*obstacles[0]=new Component(16,871-24,24,56);
        obstacles[1]=new Component(487-56,16,24,56);
        obstacles[2]=new Component(535-488,8,28,488);
        obstacles[3]=new Component(1479-536,16,24,536);
        obstacles[4]=new Component(16,231-24,24,440);
        obstacles[5]=new Component(16,231-24,24,536);
        obstacles[5]=new Component(16,231-24,24,664);*/

        
        obstacles[0]=new Component(731-84,24,84,84);
        obstacles[1]=new Component(803-732,12,90,732);
        obstacles[2]=new Component(2219-804,24,84,804);
        obstacles[3]=new Component(24,1355-84,84,84);
        obstacles[4]=new Component(24,395-84,84,660);
        obstacles[5]=new Component(24,395-84,84,804);
        obstacles[6]=new Component(24,395-84,84,996);
        obstacles[7]=new Component(24,827-324,324,1668);
        obstacles[8]=new Component(539-84,24,372,84);
        obstacles[9]=new Component(611-540,12,378,540);
        obstacles[10]=new Component(683-612,24,372,612);
        obstacles[11]=new Component(1547-996,24,372,996);
        obstacles[12]=new Component(1619-1548,9,379,1548);
        obstacles[13]=new Component(1691-1620,24,372,1620);


        let checkpoints=[];
        checkpoints[0]=new Checkpoint(1619-1548,9,380,1548,"c210");

        this.groundFloorMap=new Map("map",obstacles,checkpoints,[]);
        this.player=new Player(50,50,275,375,"player");

        this.player.changeMap(this.groundFloorMap)

        this.player.realX=1270;
        this.player.realY=700;

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

        let offsetX=144;
        let offsetY=144;

        /*let gaps=
        [
        [1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        [1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        [1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        [1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        [1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        [1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,0,0,0,0,0,0,0],
        [1,1,1,1,1,1,1,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0],
        [1,1,1,1,1,1,1,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0]
        ];*/

        let gaps=
        [
        [1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        [1,0,0,1,0,0,1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,1,1,1,0,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,1],
        [1,0,0,0,1,0,1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,1,0,1,0,1,0,0,1,0,1,0,1,1,1,1,1,1,1,1,1,1],
        [1,0,1,1,1,0,1,0,0,1,0,1,1,1,0,1,0,0,0,0,0,0,0],
        [1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,0],
        [1,1,1,1,1,1,1,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0]
        ];

        for(let i=0;i<8;i++)
        {
            for(let j=0;j<23;j++)
            {
                if(Math.floor(Math.random()*4)==3)
                {
                    if((i>0)&&(i<7))
                        if((j>0)&&(j<23))
                        {
                            if(((gaps[i][j-1]!=0)||(gaps[i-1][j-1]!=0)||(gaps[i-1][j]!=0))&&((gaps[i-1][j+1]!=0)||(gaps[i][j+1]!=0)||(gaps[i-1][j]!=0))&&((gaps[i][j+1]!=0)||(gaps[i+1][j+1]!=0)||(gaps[i+1][j]!=0))&&((gaps[i+1][j]!=0)||(gaps[i+1][j-1]!=0)||(gaps[i][j-1]!=0)))
                                gaps[i][j]=0;
                        }
                }
            }
            console.log(gaps[i]);
        }

        for(let i=0;i<8;i++)
        {
            for(let j=0;j<23;j++)
            {
                if(gaps[i][j]==1)
                {
                    mapElements.push(new MapElement(48,48,offsetX+48*i,offsetY+48*j,"obstacle"));
                    obstacles.push(new Component(46,46,offsetX+48*i,offsetY+48*j));
                }
            }
        }

        this.c210Map=new Map("c210",obstacles,checkpoints,mapElements);
        this.player.changeMap(this.c210Map);
        this.player.realX=500;
        this.player.realY=600;
        this.player.map=this.c210Map;
    }

    displayC210Map()
    {
        this.c210Map.draw(0-(this.player.realX)+this.player.x,0-(this.player.realY)+this.player.y);


        this.player.update();
        this.player.draw();
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