// Call for our function to execute when page is loaded
document.addEventListener('DOMContentLoaded', SetupCanvas);

let running = false;
let gameOver = false;
let gameStarted = false;

let score = 0;
let dashboardHeight = 40;
let AnimationId;

let oSnake;
let oVitamin;

let oMessageBox;
let oTimeBox;
let oScoreBox;

var today = new Date();

// Used to monitor whether paddles and ball are
// moving and in what direction
let DIRECTION = {
    STOPPED: 0,
    UP: 1,
    DOWN: 2,
    LEFT: 3,
    RIGHT: 4
};

function SetupCanvas(){

    // Reference to the canvas element
    canvas = document.querySelector("canvas");

    // Context provides functions used for drawing and 
    // working with Canvas
    ctx = canvas.getContext('2d');

    canvas.width = innerWidth * 0.50;
    canvas.height = innerHeight * 0.70;

    document.addEventListener('keydown', MovePlayerPaddle);

    gameOver = false;
    running = false;

    oSnake = new Snake(canvas.width/2, canvas.height/2, 'green');
    oSnake.grow(1);
    oSnake.draw();

    oVitamin = new Vitamin(150,180);
    oVitamin.draw();

    oScoreBox = new MessageBox(5, 5, 150, 30, 'black', 'yellow', "20px Courier", "Score: 0");
    oTimeBox = new MessageBox(canvas.width-158, 5, 152, 30, 'black', 'yellow', "20px Courier", getTime());

    oSnake.grow(5);
    oSnake.draw();

    paint();


}
class Snake {


    constructor(x, y, color){

        this.color = color;
        
        this.x = x;
        this.y = y;

        this.prevX = x-20;
        this.prevY = y;

        // defines movement direction of paddles
        this.move = DIRECTION.STOPPED;

        // defines how quickly tiles can be moved
        this.velocity = 20;
        this.snappedTiles = [];

       // save head's positon for next tile
       let tilePosX = this.prevX;
       let tilePosY = this.prevY;

        // console.log("Snake.constructor.1");
        // console.log(this.snappedTiles)
    }
    draw(){

        ctx.save();

        // draw head
        ctx.fillStyle = "yellow";
        ctx.fillRect(this.x, this.y, 20, 20);

        // draw ojo
        ctx.beginPath();
        ctx.arc(this.x+12, this.y+5, 2, 0, Math.PI*2, false);
        ctx.fillStyle = 'black';
        ctx.fill();
        ctx.strokeStyle = "black"
        ctx.stroke();

        // console.log("contruct.draw.1");
        // console.log(this.snappedTiles)

        // draw individual tiles into body
        for (let index = 0; index < this.snappedTiles.length; index++) {
            const currentTile = this.snappedTiles[index];
            currentTile.draw();
        }
        ctx.restore();

        // console.log("contructdraw.2");
        // console.log(this.snappedTiles)
    }
    update(){

        // console.log("SetPreviousPos.enter");

        // save previous position
        this.prevX = this.x;
        this.prevY = this.y;

        // here it is where my next tile should be
        switch (this.move) {
            case DIRECTION.DOWN:
                this.y += this.velocity;
                break;
            case DIRECTION.UP:
                this.y -= this.velocity;
                break;        
            case DIRECTION.RIGHT:
                this.x += this.velocity;
                break;     
            case DIRECTION.LEFT:
                this.x -= this.velocity;
                break;
        }
        // console.log("update.updatePrevious.1");
        // console.log(this.snappedTiles)
        
        // console.log("Snake Postions -> x: " + this.x + " y: " + this.y);
        // console.log("Snake Prev Postions -> x: " + this.prevX + " y: " + this.prevY);


        // save head's positon for next tile
        let tilePosX = this.prevX;
        let tilePosY = this.prevY;

        // draw individual tiles into body
        for (let index = 0; index < this.snappedTiles.length; index++) {

            // console.log("Set tile new Postions to -> x: " + tilePosX + " y: " + tilePosY);
            
            const currentTile = this.snappedTiles[index];
            currentTile.update(tilePosX, tilePosY);

            // set the positon for the next tile
            // console.log("Save tile prev Pos for next tile's new Pos -> x: " + currentTile.prevX + " y: " + currentTile.prevY);
            tilePosX = currentTile.prevX;
            tilePosY = currentTile.prevY;

        }
        // console.log("update.updatePrevious.2");
        // console.log(this.snappedTiles)
    }
    grow(numberOfTiles){

        let tilePosX = 0;
        let tilePosY = 0;   

        // if only head, follow it
        // console.log(this.snappedTiles);

        if (this.snappedTiles.length == 0){
            tilePosX = this.prevX;
            tilePosY = this.prevY; 
            // console.log("follow head at: " + tilePosX + ", " + tilePosY);   
        } else {
            // if not, follow tail
            let tile = this.snappedTiles[this.snappedTiles.length-1];
            if (tile != undefined){
                tilePosX = tile.prevX;
                tilePosY = tile.prevY;      
                // console.log("follow tile at: " + tilePosX + ", " + tilePosY);   
            }
        }

        // console.log("grow h(x.y): " + this.x + ", " + this.y);
        // console.log("grow Prev(Posx.Posy): " + tilePosX + ", " + tilePosY);

        // adding default tiles to initial body
        for (let index = 0; index < numberOfTiles; index++) {
            this.snappedTiles.push(new Tile(tilePosX, tilePosY, this.velocity, "pink", "@", tilePosX-20, tilePosY))
            tilePosX -= 20; // TODO: Check if whether of not the head should always grow to the right???
            //tilePosY -= tilePosY;    // Y does not change for the initial setup       
        }

    }
}
class Tile {

    constructor(x, y, velocity, color, letter, previousX, previousY){

        this.color = color;

        // position on canvas
        this.x = x;
        this.y = y;

        this.prevX = previousX;
        this.prevY = previousY;

        this.width = 20;
        this.height = 20;

        this.velocity = velocity;

        // Defines movement direction of snake
        this.move = DIRECTION.STOPPED;

        this.letter = letter;

        this.snapped = false;
    }
    draw(){

        ctx.save();
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.fill();

        ctx.fillStyle = 'rgba(0,0,255)';
        ctx.font = "10pt sans-serif";
        ctx.strokeText(this.letter, this.x+3, this.y+15);
        ctx.restore();
    }
    update(posX, posY){

        // console.log("Tile.update.enter-> " + this.prevX  + ", " + this.prevY + " / " + (this.x) + ", " + (this.y) + " / " + (posX) + ", " + (posY));

        // save my current postion & velocity
        this.prevX = this.x;
        this.prevY = this.y;

        // set my new postion
        this.x = posX;
        this.y = posY;
    }
}
class MessageBox{

    constructor(x, y, wWith, wHeight, bgColor, foreColor, font, message){

        this.x = x;
        this.y = y;

        this.wWith = wWith;
        this.wHeight = wHeight;

        this.bgColor = bgColor;
        this.foreColor = foreColor;
        this.font = font;

        this.message = message;

        let messagePosX = x+50;
        let messagePosY = y+100;

    }
    draw(){

        ctx.save();

        // creating rectangle
        ctx.beginPath();
        ctx.rect(this.x, this.y, this.wWith, this.wHeight);
 
        ctx.fillStyle = this.bgColor;
        ctx.fill();

        ctx.strokeStyle = 'green'
        ctx.stroke();

        // console.log("MessageBox: -> x: " + this.x + " y: " + this.y + " Width: " + this.wWith + " Height: " + this.wHeight);

        ctx.fillStyle = this.foreColor;
        ctx.font = this.font
        ctx.fillText(this.message, this.x + (this.wWith*0.18), this.y + (this.wHeight*0.65));

        ctx.restore();

    }
    update(newMessage){

        if (newMessage != undefined){
            this.message = newMessage;
        } 
    }
}
class Vitamin{

    constructor(x, y){

        this.x = x;
        this.y = y;

    }
    draw(){

        // console.log("creating new vitamin!");
        ctx.save();
        ctx.beginPath();   
        ctx.arc(this.x, this.y, 7, 0, Math.PI*2, false);
        ctx.fillStyle = 'red';
        ctx.fill();
        ctx.strokeStyle = "black";
        ctx.stroke();  
        //ctx.closePath();
        ctx.restore();

    }
    update(){

    }
}
function gameLoop(){

    // console.log("Game is On!!");
    if(!gameOver) {

        gameStarted = true;
        // AnimationId = requestAnimationFrame(gameLoop);
        requestAnimationFrame(laggedRequestAnimationFrame)

        // TODO: Use when want to keep it moving automatically
        update();
        paint();

    } else {

        // Finish the game
        cancelAnimationFrame(AnimationId)
        console.log("gameOver: " + gameOver);
          
        oMessageBox = new MessageBox((canvas.width/2)-100, (canvas.height/2)-40, 200, 80, 'black', 'yellow', "20px Courier", "Game Over!!!");
        oMessageBox.draw("GameOver");
        
    }
}
function paint(){

    // Clear the canvas
    ctx.clearRect(0,0,canvas.width,canvas.height);

    // Draw Canvas background
    ctx.fillStyle = 'rgb(0, 0, 0, 0.3)';
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // creating dashbaord
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, 0,  canvas.width-2, dashboardHeight);
    ctx.fillStyle = 'white';
    ctx.strokeStyle = 'green'
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    oSnake.draw();
    oVitamin.draw();
    oTimeBox.draw(getTime().toString());
    oScoreBox.draw("Score: " + score);

    // draw apple
    // ctx.drawImage( './asset/sprite_0.png', 1, 1, 10,10,100,100,10,10);

}
function update(){

    // console.log("update.enter")

    oSnake.update();
    oScoreBox.update()
    oTimeBox.update(getTime());


    // if player tries to move off the board prevent that (LE: No need for this game)
    if(oSnake.y <= dashboardHeight-20 || oSnake.y >= canvas.height){
        gameOver = true;
    } else if(oSnake.x<=0 || oSnake.x >= (canvas.width-20)){
        gameOver = true;
    }
}
function MovePlayerPaddle(key){

    // console.log("running: " + running + " - game started : " + gameStarted);

    if(running === false){
        running = true;
        gameStarted == true;
        // window.requestAnimationFrame(gameLoop);
        // window.onload = setInterval(gameLoop);
        requestAnimationFrame(laggedRequestAnimationFrame)
    }
    
    switch (true) {
        
        // Handle scape as game over
        case (key.keyCode === 27):      
            gameOver = true;
            break;

        // Handle space bar for PAUSE
        case (key.keyCode === 32):
            running = true;
            break;

        // Handle up arrow and w input
        case (key.keyCode === 38 || key.keyCode === 87) && oSnake.move != DIRECTION.DOWN: 
            oSnake.move = DIRECTION.UP;
            //update();
            break;

        // Handle down arrow and s input
        case (key.keyCode === 40 || key.keyCode === 83) && oSnake.move != DIRECTION.UP:
            oSnake.move = DIRECTION.DOWN;
            //update();
            break;
        
        // Handle left arrow and a input
        case (key.keyCode === 37 || key.keyCode === 65) && oSnake.move != DIRECTION.RIGHT:
            oSnake.move = DIRECTION.LEFT;
            //update();
            break;

        // Handle right arrow and d input
        case (key.keyCode === 39 || key.keyCode === 68)  && oSnake.move != DIRECTION.LEFT:
            oSnake.move = DIRECTION.RIGHT;
            //update();
            break;

        default:
            break;
    }
    console.log("key.code: " + key.keyCode)
}
function getTime(){

    let clock = today.getHours().toString()   + ":" + 
                today.getMinutes().toString() + ":" + 
                today.getSeconds().toString();
    
                return clock;
}

var fps = 10
// Article reference: http://www.javascriptkit.com/javatutors/requestanimationframe.shtml
function laggedRequestAnimationFrame(timestamp){
    setTimeout(function(){ //throttle requestAnimationFrame to 20fps
        AnimationId = requestAnimationFrame(gameLoop);
    }, 1000/fps)
}
