// Call for our function to execute when page is loaded
document.addEventListener('DOMContentLoaded', SetupCanvas);

// Monitors whether game is currently in play
let running = false;
let gameOver = false;

let AnimationId;

// var cirSpeed = 1;
// var cirX =  1;
// var cirY =  1;

var oSnake;


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

    canvas.width = innerWidth;
    canvas.height = innerHeight;

    document.addEventListener('keydown', MovePlayerPaddle);

    // trigger Animation
    // AnimationId = requestAnimationFrame(gameLoop);
    gameOver = false;
    running = false;

        
    oSnake = new Snake(200, 200, 'green');
    oSnake.draw();
    
}
class Snake {

    constructor(x, y, color){

        this.color = color;

        // let _x = 0;
        // let _y = 0;

        this._x = x;
        this._y = y;

        
        this.previousX = x-30;
        this.previousY = y;

        // defines movement direction of paddles
        this.move = DIRECTION.STOPPED;

        // defines how quickly tiles can be moved
        this.velocity = 1;
        this.snappedTiles = [];

        // save head's positon for next tile
        let tilePosX = this.previousX;
        let tilePosY = this.previousY;

        console.log("constructor-x.y: " + this.x + "-" + this.y);
        console.log("constructor-Posx.Posy: " + tilePosX + "-" + tilePosY);

        // adding default tiles to initial body
        for (let index = 0; index < 3; index++) {
            this.snappedTiles.push(new Tile(tilePosX, tilePosY, this.velocity, "blue", "@", tilePosX-25, tilePosY))
            tilePosX -= 25;
            // tilePosY = tilePosY;    // Y does not change fo the initial setup       
        }
        console.log("Snake.constructor.1");
        console.log(this.snappedTiles)
    }
    get x() {
        return this._x;
    }
    set x(newValue) {
        this._x= newValue;
        this.SetPreviousPos();
    }
    get y() {
        return this._y;
    }
    set y(newValue) {
        this._y = newValue;
        this.SetPreviousPos();
    }
    draw(){

        // la cabeza
        // ctx.beginPath();
        // ctx.arc(this.x, this.y, 10, 0, Math.PI*2, false);
        // ctx.fillStyle = this.color;
        // ctx.fill();
        
        // // el ojo
        // ctx.beginPath();
        // ctx.arc(this.x+4, this.y-7, 2, 0, Math.PI*2, false);
        // ctx.fillStyle = 'black';
        // ctx.fill();

        // console.log(  "previous-X: " + this.previousX + "-" + this.x + " previous-Y: " + this.previousY + "-" + this.y);
        
        // Debug Only
        ctx.rect(this.x, this.y, 20, 20);
        ctx.fillStyle = 'yellow';
        ctx.stroke()
        
        console.log("draw.1");
        console.log(this.snappedTiles)

        //save head's positon for next tile
        let tilePosX = this.previousX;
        let tilePosY = this.previousY;

        //Draw individual tiles into cuerpo
        for (let index = 0; index < this.snappedTiles.length; index++) {

            const currentTile = this.snappedTiles[index];

            // tilePosX -= 23;
            // currentTile.update(tilePosX, tilePosY);
            // currentTile.x =  tilePosX
            // currentTile.y = tilePosY;
            currentTile.draw();

            // set the positon for the next tile
            // tilePosX = currentTile.previousX;
            // tilePosY = currentTile.previousY

        }
        console.log("draw.2");
        console.log(this.snappedTiles)
    }
    SetPreviousPos(){

        // console.log("SetPreviousPos.enter");

        // here it is where my next tile should be
        switch (this.move) {
            case DIRECTION.DOWN:
                // this.previousX = this._x-10;
                this.previousY = this._y-10;
                break;
            case DIRECTION.UP:
                //this.previousX = this._x-10;
                this.previousY = this._y+10;
                break;        
            case DIRECTION.RIGHT:
                this.previousX = this._x-10;
                //this.previousY = this._y-10;
                break;     
            case DIRECTION.LEFT:
                this.previousX = this._x+10;
                //this.previousY = this._y-10;
                break;
        }

        // this.previousX = this._x;
        // this.previousY = this._y;

        // save head's positon for next tile
        let tilePosX = this.previousX;
        let tilePosY = this.previousY;

        console.log("SetPrev->Posx.Posy: " + tilePosX + "-" + tilePosY);

        //Draw individual tiles into cuerpo
        for (let index = 0; index < this.snappedTiles.length; index++) {

            const currentTile = this.snappedTiles[index];

            //tilePosX -= 30;
            currentTile.update(tilePosX, tilePosY);
            // element.x =  tilePosX
            // element.y = tilePosY;
            
            currentTile.draw();

            // set the positon for the next tile
            tilePosX = currentTile.previousX;
            tilePosY = currentTile.previousY

        }
        console.log("SetPos.1");
        console.log(this.snappedTiles);
    }
}
class Tile {

    constructor(x, y, velocity, color, letter, previousX, previousY){

        this.color = color;

        // position on canvas
        this.x = x;
        this.y = y;

        this.previousX = previousX;
        this.previousY = previousY;

        this.width = 20;
        this.height = 20;

        this.velocity = velocity;

        // Defines movement direction of paddles
        this.move = DIRECTION.STOPPED;

        this.letter = letter;

        this.snapped = false;

    }
    draw(){

        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.fill();

        ctx.fillStyle = 'rgba(0,0,255)';
        ctx.font = "10pt sans-serif";

        ctx.strokeText(this.letter, this.x+3, this.y+15);

    }
    update(newPosX, newPosY){

        console.log("tile.update.enter: " + this.previousX  + "-" + this.previousY + "-" + newPosX + "-" + newPosY);

        // save my current postion
        this.previousX = this.x;
        this.previousY = this.y;
        // set my new postion
        this.x = newPosX;
        this.y = newPosY;

    }
}
function gameLoop(){

    // console.log("Game is On!!");
    if(gameOver==false) {

        AnimationId = requestAnimationFrame(gameLoop);
        update();
        paint();

    } else {

        // Finish the game
        cancelAnimationFrame(AnimationId)
        console.log("gameOver: " + gameOver);

        ctx.font = '30px Arial';
        ctx.textAlign = 'center';
        ctx.fillStyle = "red";
        ctx.fillText("Game Over!!!",canvas.width/2, canvas.height/2);
        
    }
}
function paint(){

    // Clear the canvas
    ctx.clearRect(0,0,canvas.width,canvas.height);

    // Draw Canvas background
    ctx.fillStyle = 'rgb(0, 0, 0, 0.3)';
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    oSnake.draw();

}
function update(){

    console.log("update.enter")
    // sideway cases
    if(oSnake.move === DIRECTION.RIGHT){
        oSnake.x += oSnake.velocity;
    } else if(oSnake.move === DIRECTION.LEFT){
        oSnake.x -= oSnake.velocity;
    }

    // sideway cases
    if(oSnake.move === DIRECTION.UP){
        oSnake.y -= oSnake.velocity;
    } else if(oSnake.move === DIRECTION.DOWN){
        oSnake.y += oSnake.velocity;
    }
    oSnake.SetPreviousPos();

    //If player tries to move off the board prevent that (LE: No need for this game)
    if(oSnake.y <= 0){
        gameOver=true;
    } else if(oSnake.y >= (canvas.height)){
        gameOver=true;
    }

    // cirX += cirSpeed;
    // cirY += cirSpeed;

    // // enemies off the screen?
    // if (cirX > canvas.height ){
    //     cirSpeed = cirSpeed * -1;
    // } else if (cirX < 0) {
    //     cirSpeed = cirSpeed * -1;
    // } 

    // oSnake.x = cirX;
    // oSnake.y = cirY;
}
function MovePlayerPaddle(key){

    if(running === false){
        running = true;
        window.requestAnimationFrame(gameLoop);
    }

    // Handle up arrow and w input
    if(key.keyCode === 38 || key.keyCode === 87) oSnake.move = DIRECTION.UP;
    // Handle down arrow and s input
    if(key.keyCode === 40 || key.keyCode === 83) oSnake.move = DIRECTION.DOWN;

    // Handle left arrow and a input
    if(key.keyCode === 37 || key.keyCode === 65) oSnake.move = DIRECTION.LEFT
    // Handle right arrow and d input
    if(key.keyCode === 39 || key.keyCode === 68) oSnake.move = DIRECTION.RIGHT;
    
    // Handle space bar for ???
    if(key.keyCode === 32) {

    }

    // handle scape as game over
    if(key.keyCode === 27) gameOver = true;

    console.log("key.code: " + key.keyCode)
}




function placeHolder(){

    // // Draw player
    // player = new Player((canvas.width/2), 'white');

    // for (let index = 0; index <1000; index+=1) {

            // creating circles
            // ctx.beginPath();
            // ctx.fillStyle = 'yellow';
            // ctx.arc(cirX+cirSpeed, cirY+cirSpeed, 40, 0, 2 * Math.PI);
            // ctx.stroke(); 
            //  console.log("x: " + cirX+cirSpeed + " y: " + cirY+cirSpeed);


            // ctx.font = "60px Verdana";    
            // // Create gradient
            // var gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
            // gradient.addColorStop("0"," magenta");
            // gradient.addColorStop("0.5", "blue");
            // gradient.addColorStop("1.0", "red");
            // // Fill with gradient
            // ctx.fillStyle = gradient;
            // var tX = innerWidth/2;
            // var tY = index+50;
            // ctx.fillText("Target Innovations", , 200);

            // creating rectangle
            // ctx.beginPath();
            // var rSpeed=0;
            // rSpeed += 10;
            // var rX =  canvas.width - rSpeed;
            // var rY =  canvas.height - rSpeed;
            // ctx.rect(rX, rY, 150, 100);
            // ctx.stroke()

    //}
}