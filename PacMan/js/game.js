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
            this.displayMap();

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
        this.groundFloorMap=new Map("map");
        this.player=new Player(50,50,375,275,"player")
    }
    displayMap()
    {
        this.groundFloorMap.draw(0-this.player.realY,0-this.player.realX);
        this.player.update();
        this.player.draw();
    }
}


class Map
{
    constructor(textureName)
    {
        this.image=document.getElementById(textureName);
    }

    draw(x,y)
    {
        myGameArea.context.drawImage(this.image,x,y);
    }
}

class Player extends Component
{
    constructor(width, height, x, y,textureName) 
    {
        super(width, height, x, y) ;
        this.texture=document.getElementById(textureName);
        this.realX=x;
        this.realY=y;
    }

    draw()
    {
        myGameArea.context.drawImage(this.texture,this.x,this.y);
        //console.log(this.realX,this.realY);
    }

    update()
    {
    if (myGameArea.keys && myGameArea.keys[87]) {this.realX--; }
    if (myGameArea.keys && myGameArea.keys[83]) {this.realX++; }
    if (myGameArea.keys && myGameArea.keys[65]) {this.realY--;}
    if (myGameArea.keys && myGameArea.keys[68]) {this.realY++; }
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