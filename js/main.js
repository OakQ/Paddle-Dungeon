var game = new Phaser.Game(768, 768, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update });

function preload() {
    game.load.atlas('paddleAtlas', 'assets/Sprites/paddleAtlas.png', 'assets/Sprites/paddleAtlas.json');
    game.load.audio('hit_1', 'assets/Audio/Hit_1.wav');
    game.load.audio('hit_2', 'assets/Audio/Hit_2.wav');
    game.load.audio('hit_3', 'assets/Audio/Hit_3.wav');
    game.load.audio('hit_4', 'assets/Audio/Hit_4.wav');
    game.load.audio('hit_5', 'assets/Audio/Hit_5.wav');
    game.load.audio('coins', 'assets/Audio/key_pickup.mp3');
    game.load.audio('scream', 'assets/Audio/scream_horror1.mp3');
    game.load.audio('music', 'assets/Audio/William_Hellfire_-_21_-_Poses_-_William_Hellfire.mp3');
}

var health;
var spaces;
var walls;
var spookies;

var playerLayer;
var arrowLayer;
var floorLayer;

var arrowOne;
var arrowTwo;
var arrowTurn;

var totalMoves;
var moves;

var enter;

var space;
var wall;
var laddle;
var spooky;

var place;

var yourTurn;
var text;
var scoreText;
var score;
var gameOver;
function create() {
    music = game.add.audio('music');
    music.loop = true;
    music.play();
    
    totalMoves = 2;
    moves = 0;
    gameOver = false; //the game can't end before it starts
    yourTurn = true; //start with the player's turn
    floorLayer = game.add.group();
    arrowLayer = game.add.group();
    playerLayer = game.add.group();
    for (var x = 0; x < 12; x++){
        for (var y = 0; y < 12; y++){
            space = floorLayer.create(x * 64, y * 64, 'paddleAtlas', 'space');
            space.inputEnabled = true;
            space.input.useHandCursor = true;
            space.events.onInputDown.add(drawArrow, this);
        }
    }
    laddle = playerLayer.create(5 * 32, 5 * 32, 'paddleAtlas', 'laddle_01');
    laddle.animations.add('express', Phaser.Animation.generateFrameNames('laddle_', 1, 15, '', 2), 4, true); //create the animation of player
    laddle.animations.play('express');
    laddle.anchor.setTo(0.5, 0.5);
    destX = laddle.world.x;
    destY = laddle.world.y;
    
    arrowOne = arrowLayer.create(laddle.world.x, laddle.world.y, 'paddleAtlas', 'arrow_one');
    arrowOne.anchor.setTo(0, 0.5);
    arrowOne.angle = 90;
    arrowOne.visible = false;
    
    arrowTwo = arrowLayer.create(laddle.world.x, laddle.world.y, 'paddleAtlas', 'arrow_two');
    arrowTwo.anchor.setTo(0.5, 0);
    arrowTwo.angle = 0;
    arrowTwo.visible = false;
    
    arrowTurn = arrowLayer.create(laddle.world.x, laddle.world.y, 'paddleAtlas', 'arrow_turn');
    arrowTurn.anchor.setTo(0, 0.16);
    arrowTurn.angle = 0;
    arrowTurn.visible = false;
    
    spookies = game.add.group();    

    for (var x = 1; x < 11; x++){
        for (var y = 1; y < 11; y++){
            place = Math.floor(Math.random() * 25);
            if(place < 2 && x != 1 && y != 1){ //2/25 chance of placing down a ghost
                spooky = spookies.create(x * 64 + 32, y * 64 + 32, 'paddleAtlas', 'ghost_left_1'); //place it right on a tile
                spooky.animations.add('rattleLeft', Phaser.Animation.generateFrameNames('ghost_left_', 1, 2, '', 1), 2, true);
                spooky.animations.play('rattleLeft');
                spooky.anchor.setTo(0.5, 0.5);
            }
        }
    }
    health = 50;
    enter = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
    score = 0;
    scoreText = game.add.text(32, 32, 'Health: 50', { font: "20px Arial", fill: "#000000", align: "center" }); //set score to 0 and set text
}


function update () {
    //call on the different move functions when we hit a button. onDown makes it so it only works once per press
    //game.input.onDown.add(moveDown, this);
    enter.onDown.add(moveTo);
    //hit(); //checks for collsions
}

var laddleTween;
var block;
var distX;
var distY;
var dirX;
var dirY;
function drawArrow(){
    if (yourTurn){
        distX = Math.abs(game.input.mousePointer.x - laddle.world.x);
        distY = Math.abs(game.input.mousePointer.y - laddle.world.y);
        dirX = game.input.mousePointer.x - laddle.world.x;
        dirY = game.input.mousePointer.y - laddle.world.y;
        if ((distX >= 32 && distX <= 96 && Math.abs(dirY) <= 32) || (distY >= 32 && distY <= 96 && Math.abs(dirX) <= 32)){
            arrowOne.visible = true;
            arrowTwo.visible = false;
            arrowTurn.visible = false;
            if (dirY >= 32 && dirY <= 96){
                arrowOne.angle = 90;            
            }
            else if (dirY <= -32 && dirY >= -96){
                arrowOne.angle = -90;
            }
            else if (dirX >= 32 && dirX <= 96){
                arrowOne.angle = 0;
            }
            else if (dirX <= -32 && dirX >= -96){
                arrowOne.angle = -180;
            }
        }
        else if ((distX > 96 && distX <= 160 && Math.abs(dirY) <= 32) || (distY > 96 && distY <= 160 && Math.abs(dirX) <= 32)){ 
            arrowOne.visible = false;
            arrowTwo.visible = true;
            arrowTurn.visible = false;
            if (dirY > 96 && dirY <= 160){
                arrowTwo.angle = 0;            
            }
            else if (dirY < -96 && dirY >= -160){
                arrowTwo.angle = -180;
            }
            else if (dirX > 96 && dirX <= 160){
                arrowTwo.angle = -90;
            }
            else if (dirX < 96 && dirX >= -160){
                arrowTwo.angle = 90;
            }
        }
        else if ((distX >= 32 && distX <= 96 && Math.abs(dirY) <= 96) || (distY >= 32 && distY <= 96 && Math.abs(dirX) <= 96)){ 
            arrowOne.visible = false;
            arrowTwo.visible = false;
            arrowTurn.visible = true;
            if (dirY >= 32 && dirY <= 96 && dirX >= 32 && dirX <= 96){
                arrowTurn.scale.x = 1;
                arrowTurn.scale.y = 1;            
            }
            else if (dirY <= -32 && dirY >= -96 && dirX >= 32 && dirX <= 96){
                arrowTurn.scale.x = 1;
                arrowTurn.scale.y = -1;
            }
            else if (dirY <= -32 && dirY >= -96 && dirX <= -32 && dirX >= -96){
                arrowTurn.scale.x = -1;
                arrowTurn.scale.y = -1;
            }
            else if (dirY >= 32 && dirY <= 96 && dirX <= -32 && dirX >= -96){
                arrowTurn.scale.x = -1;
                arrowTurn.scale.y = 1;
            }
        }
        else{
            arrowOne.visible = false;
            arrowTwo.visible = false;
            arrowTurn.visible = false;
        }
    }
}

var laddleTween;
var moveToX;
var moveToY;
function moveTo(){
    if (arrowOne.visible || arrowTwo.visible || arrowTurn.visible) {
        if (arrowOne.visible) {
            if (arrowOne.angle == 0){
                moveToX = 64;
                moveToY = 0; //check
            }
            else if (arrowOne.angle == 90){
                moveToX = 0;
                moveToY = 64; //check
            }
            else if (arrowOne.angle == -180){
                moveToX = -64;
                moveToY = 0;
            }
            else if (arrowOne.angle == -90){
                moveToX = 0;
                moveToY = -64; //check
            }            
            arrowOne.visible = false;
        }
        else if (arrowTwo.visible) {
            if (arrowTwo.angle == 0){
                moveToX = 0;
                moveToY = 128; //check
            }
            else if (arrowTwo.angle == 90){
                moveToX = -128;
                moveToY = 0; //check
            }
            else if (arrowTwo.angle == -180){
                moveToX = 0;
                moveToY = -128;
            }
            else if (arrowTwo.angle == -90){
                moveToX = 128;
                moveToY = 0; //check
            }
            arrowTwo.visible = false;
        }
        else if (arrowTurn.visible) {
            console.log(arrowTurn.scale.x);
            console.log(arrowTurn.scale.y);
            if (arrowTurn.scale.x == 1 && arrowTurn.scale.y == 1){
                moveToX = 64;
                moveToY = 64; //check
            }
            else if (arrowTurn.scale.x == 1 && arrowTurn.scale.y == -1){
                moveToX = 64;
                moveToY = -64; //check
            }
            else if (arrowTurn.scale.x == -1 && arrowTurn.scale.y == -1){
                moveToX = -64;
                moveToY = -64; //check
            }
            else if (arrowTurn.scale.x == -1 && arrowTurn.scale.y == 1){
                moveToX = -64;
                moveToY = 64; //check
            }
            arrowTurn.visible = false;
        }
        laddleTween = game.add.tween(laddle).to( { x: laddle.world.x + moveToX, y: laddle.world.y + moveToY}, 1000, "Linear", true);
        arrowLayer.x += moveToX;
        arrowLayer.y += moveToY;
        yourTurn = false;
        laddleTween.onComplete.add(enemyTurn);
    }
}


var move;
var enemyTween;
function enemyTurn(){ //the enemy moves randomly for its turn
    for (var i = 0; i < spookies.countLiving(); i++){ //go through and move each ghost
        spooky = spookies.getChildAt(i); //using each ghost
        
        distX = Math.round(spooky.world.x - laddle.world.x);
        distY = Math.round(spooky.world.y - laddle.world.y);
        console.log(distX);
        console.log(distY);
        if(Math.abs(distX) >= 192){
            if (distX >= 192)
                enemyTween = game.add.tween(spooky).to( { x: spooky.world.x - 128, y: spooky.world.y }, 1000, "Linear", true);
            else if (distX <= -192)
                enemyTween = game.add.tween(spooky).to( { x: spooky.world.x + 128, y: spooky.world.y }, 1000, "Linear", true);
        }
        else if(Math.abs(distY) >= 192){
            if (distY >= 192)
                enemyTween = game.add.tween(spooky).to( { x: spooky.world.x, y: spooky.world.y - 128}, 1000, "Linear", true);
            else if (distY <= -192)
                enemyTween = game.add.tween(spooky).to( { x: spooky.world.x, y: spooky.world.y + 128}, 1000, "Linear", true);
        }
        if(Math.abs(distX) >= 128){
            if (distX >= 128)
                enemyTween = game.add.tween(spooky).to( { x: spooky.world.x - 64, y: spooky.world.y }, 1000, "Linear", true);
            else if (distX <= -128)
                enemyTween = game.add.tween(spooky).to( { x: spooky.world.x + 64, y: spooky.world.y }, 1000, "Linear", true);
        }
        else if(Math.abs(distY) >= 128){
            if (distY >= 128)
                enemyTween = game.add.tween(spooky).to( { x: spooky.world.x, y: spooky.world.y - 64}, 1000, "Linear", true);
            else if (distY <= -128)
                enemyTween = game.add.tween(spooky).to( { x: spooky.world.x, y: spooky.world.y + 64}, 1000, "Linear", true);
        }
        else if(Math.abs(distX) >= 64 && Math.abs(distY) >= 64){
            if (distX >= 64)
                enemyTween = game.add.tween(spooky).to( { x: spooky.world.x - 64, y: spooky.world.y}, 1000, "Linear", true);
            else if (distX <= -64)
                enemyTween = game.add.tween(spooky).to( { x: spooky.world.x + 64, y: spooky.world.y}, 1000, "Linear", true);
        }
    }
    enemyTween.onComplete.add(playersTurn); //player can't move until ghosts are done
}

function playersTurn(){
    yourTurn = true; //player's turn
}

var col;
var scream;
var rand; 
function hit(){ //checks for overlapping collisions  
    for(var i = 0; i < spookies.length; i++){
        if(checkOverlap(laddle, spookies.getChildAt(i)) && spookies.getChildAt(i).alive){
            score -= 200; //lose point for getting spooked
            scoreText.text = 'Score: ' + score;
            spookies.getChildAt(i).kill(); //kill the spooky
            rand = Math.floor(Math.random() * 5) + 1;//number from 1 to 5
            col = game.add.audio('hit_' + rand); //choose repsective hit sound
            col.play(); //play sound
            scream = game.add.audio('scream');
            scream.allowMultiple = true; //extra spooky
            scream.play(); //i m so spooped rite nao
        }
    }
}

function checkOverlap(spriteA, spriteB) { //check for overlaps between player and objects
        
    var boundsA = spriteA.getBounds(); //get the bounds of their collider
    var boundsB = spriteB.getBounds();

    return Phaser.Rectangle.intersects(boundsA, boundsB); //see if they intersect

}

function checkGameOver(){
    if(health <= 0){ //if no chests remain
        scoreText.text = "THE PADDLE CLAN IS VICTORIOUS! Score: " + score; //display win text
        gameOver = true; //end the game
    }
}