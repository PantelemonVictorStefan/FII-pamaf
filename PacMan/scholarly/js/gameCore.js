function startGame() {
    myGameArea.start();
	myGamePiece = new component(30, 30, "red", 10, 120);
    myObstacle = new component(10, 200, "green", 300, 120); 
}

var myGameArea = {
    //canvas : document.createElement("canvas"),
    //canvas : document.getElementById("id3"),
    start : function() {
        cnv= document.getElementsByTagName("canvas")[0],
        cnv.width = 480;
        cnv.height = 270;
        this.context= cnv.getContext("2d");
       //document.body.insertBefore(cnv, document.body.childNodes[0]);
        this.interval = setInterval(updateGameArea, 20);
         window.addEventListener('keydown', function (e) {
            myGameArea.keys = (myGameArea.keys || []);
            myGameArea.keys[e.keyCode] = true;
        })
        window.addEventListener('keyup', function (e) {
            myGameArea.keys[e.keyCode] = false;
        })
    },
    clear : function() {
        this.context.clearRect(0, 0, cnv.width, cnv.height);
    },
    stop : function() {
        clearInterval(this.interval);
    }

    
}

function component(width, height, color, x, y) 
{
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.speedX = 0;
    this.speedY = 0;
    this.update = function()
    {
    ctx = myGameArea.context;
    ctx.fillStyle = color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    this.newPos = function() {
        this.x += this.speedX;
        this.y += this.speedY;
    }

    this.crashWith = function(otherobj) {
        var myleft = this.x;
        var myright = this.x + (this.width);
        var mytop = this.y;
        var mybottom = this.y + (this.height);
        var otherleft = otherobj.x;
        var otherright = otherobj.x + (otherobj.width);
        var othertop = otherobj.y;
        var otherbottom = otherobj.y + (otherobj.height);
        var crash = true;
        if ((mybottom < othertop) ||
               (mytop > otherbottom) ||
               (myright < otherleft) ||
               (myleft > otherright)) {
           crash = false;
        }
        return crash;
    }

}
function updatePlayer()
{
    //myGamePiece.x += 1;
    myGamePiece.speedX = 0;
    myGamePiece.speedY = 0;
    if (myGameArea.keys && myGameArea.keys[65]) {myGamePiece.speedX = -1; }
    if (myGameArea.keys && myGameArea.keys[68]) {myGamePiece.speedX = 1; }
    if (myGameArea.keys && myGameArea.keys[87]) {myGamePiece.speedY = -1; }
    if (myGameArea.keys && myGameArea.keys[83]) {myGamePiece.speedY = 1; }
    myGamePiece.newPos();
    myGamePiece.update();
    if (myGamePiece.crashWith(myObstacle)) {
        myGameArea.stop();
        }
}
function updateGameArea() {
    myGameArea.clear();
    myObstacle.update();
    updatePlayer();

    
    
}


function moveup() {
    myGamePiece.speedY -= 1;
}

function movedown() {
    myGamePiece.speedY += 1;
}

function moveleft() {
    myGamePiece.speedX -= 1;
}

function moveright() {
    myGamePiece.speedX += 1;
}