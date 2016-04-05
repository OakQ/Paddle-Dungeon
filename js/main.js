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
var arrows;

var playerLayer;
var arrowLayer;
var floorLayer;

var arrowOrigin;
var arrowEnd;
var arrowTurn;
var arrowForward;
var lastArrow;

var totalMoves;
var moves;

var destX;
var destY;

var space;
var wall;
var laddle;
var spooky;

var place;
var down;
var up;
var left;
var right;
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
            space.events.onInputOver.add(drawArrow, this);
        }
    }
    laddle = playerLayer.create(67, 90, 'paddleAtlas', 'laddle_01');
    laddle.animations.add('express', Phaser.Animation.generateFrameNames('laddle_', 1, 15, '', 2), 4, true); //create the animation of player
    laddle.animations.play('express'); 
    destX = laddle.world.x;
    destY = laddle.world.y;

    spookies = game.add.group();    

    for (var x = 1; x < 11; x++){
        for (var y = 1; y < 11; y++){
            place = Math.floor(Math.random() * 25);
            if(place < 2 && x != 1 && y != 1){ //2/25 chance of placing down a ghost
                spooky = spookies.create(x * 64+6, y * 64, 'paddleAtlas', 'ghost_1'); //place it right on a tile
                spooky.animations.add('rattleLeft', Phaser.Animation.generateFrameNames('ghost_left_', 1, 2, '', 1), 2, true);
                spooky.animations.play('rattleLeft');
            }
        }
    }
    health = 50;
    down = game.input.keyboard.addKey(Phaser.Keyboard.S); //use WASD instead of arrow keys because we are not casuals
    up = game.input.keyboard.addKey(Phaser.Keyboard.W);
    left = game.input.keyboard.addKey(Phaser.Keyboard.A);
    right = game.input.keyboard.addKey(Phaser.Keyboard.D);
    score = 0;
    scoreText = game.add.text(32, 32, 'Health: 50', { font: "20px Arial", fill: "#000000", align: "center" }); //set score to 0 and set text
}


function update () {
    //call on the different move functions when we hit a button. onDown makes it so it only works once per press
    //game.input.onDown.add(moveDown, this);
    down.onDown.add(moveDown);
    up.onDown.add(moveUp);
    left.onDown.add(moveLeft);
    right.onDown.add(moveRight);

    hit(); //checks for collsions
}

function moveTo(){
    
}

var laddleTween;
var block;
function drawArrow(){
    if (Math.abs(game.input.mousePointer.y - laddle.world.y) <= 224 && Math.abs(game.input.mousePointer.y - laddle.world.y) >= 32){
        arrowOrigin = arrowLayer.create(laddle.world.x+29, laddle.world.y+6, 'paddleAtlas', 'arrow_origin');
        arrowOrigin.anchor.setTo(0, 0.5);
        arrowOrigin.angle = 90;
    }
}

function moveDown(){
    block = false; //we always start block with false. Decides if theree's a wall in our way
    /*for (var w = 0; w < walls.length; w ++){ //go through each wall
        if (walls.getChildAt(w).world.x - player.world.x <= 24 && walls.getChildAt(w).world.x - player.world.x >= -24 && walls.getChildAt(w).world.y - (player.world.y + 64) >= -12 && walls.getChildAt(w).world.y - (player.world.y + 64) <= 12){
            //check to see if there's a wall in the direction our player is going within a range (for accuracy)
            block = true; //if there's a wall in the way, we set block to true
        }
    }*/
    if (yourTurn && !gameOver){
        move++;
        if (moves <= totalMoves){
            destX += 64;
            if (moves == 1){
                arrowOrigin = arrowLayer.create(laddle.world.x+29, laddle.world.y+6, 'paddleAtlas', 'arrow_origin');
                arrowOrigin.anchor.setTo(0, 0.5);
                arrowOrigin.angle = 90;

                arrowEnd = arrowLayer.create(0, 32, 'paddleAtlas', 'arrow_end');
                arrowEnd.anchor.setTo(0, 0.5);
                arrowEnd.angle = 90;
                arrowOrigin.setChild(arrowEnd);
            }
            /*else{
                //arrowEnd.destroy();
                arrowOrigin = arrowLayer.create(laddle.world.x+29, laddle.world.y+6, 'paddleAtlas', 'arrow_origin');
                arrowOrigin.anchor.setTo(0, 0.5);
                arrowOrigin.angle = 90;
                
                arrowForward = arrowLayer.create(arrowOrigin.world.x, arrowOrigin.world.y+32, 'paddleAtlas', 'arrow_forward');
                arrowForward.anchor.setTo(0, 0.5);
                arrowForward.angle = 90;

                arrowEnd = arrowLayer.create(arrowForward.world.x, arrowForward.world.y+64, 'paddleAtlas', 'arrow_end');
                arrowEnd.anchor.setTo(0, 0.5);
                arrowEnd.angle = 90;
            }*/
        }
    }
    /*if(yourTurn && !gameOver && !block){ //only works if it is the player's turn, the game isn't over, and there isn't a block in the way
        laddleTween = game.add.tween(laddle).to( { x: laddle.world.x, y: laddle.world.y + 64 }, 1000, "Linear", true); //move the player relative to its location slowly
        yourTurn = false; //end our turn
        score -= 50; //drop our score every move
        scoreText.text = 'Score: ' + score;
        laddleTween.onComplete.add(enemyTurn); //play the enemyTurn
    }*/
}

function moveUp(){
    block = false;
    /*for (var w = 0; w < walls.length; w ++){
        console.log(w);
        console.log(walls.getChildAt(w).world.y - (player.world.y - 64));
        console.log(walls.getChildAt(w).world.x - player.world.x);
        if (walls.getChildAt(w).world.x - player.world.x <= 24 && walls.getChildAt(w).world.x - player.world.x >= -24  && walls.getChildAt(w).world.y - (player.world.y - 64) >= -12 && walls.getChildAt(w).world.y - (player.world.y - 64) <= 12){
            block = true;
            console.log("Blocked");
        }
    }  */
    if(yourTurn && !gameOver && !block){
        laddleTween = game.add.tween(laddle).to( { x: laddle.world.x, y: laddle.world.y - 64 }, 1000, "Linear", true);
        yourTurn = false;
        score -= 50;
        scoreText.text = 'Score: ' + score;
        laddleTween.onComplete.add(enemyTurn);
    }
}

function moveLeft(){
    block = false;
    /*for (var w = 0; w < walls.length; w ++){
        console.log(w);
        console.log(walls.getChildAt(w).world.y - player.world.y);
        console.log(walls.getChildAt(w).world.x - (player.world.x - 64));
        if (walls.getChildAt(w).world.y - player.world.y <= 12 && walls.getChildAt(w).world.y - player.world.y >= -12 && walls.getChildAt(w).world.x - (player.world.x - 64) <= 24 && walls.getChildAt(w).world.x - (player.world.x - 64) >= -24){
            block = true;
            console.log("Blocked");
        }
    } */ 
    if(yourTurn && !gameOver && !block){
        laddleTween = game.add.tween(laddle).to( { x: laddle.world.x - 64, y: laddle.world.y }, 1000, "Linear", true);
        yourTurn = false;
        score -= 50;
        scoreText.text = 'Score: ' + score;
        laddleTween.onComplete.add(enemyTurn);
    }
}

function moveRight(){
    block = false;
    /*for (var w = 0; w < walls.length; w ++){
        console.log(w);
        console.log(walls.getChildAt(w).world.y - player.world.y);
        console.log(walls.getChildAt(w).world.x - (player.world.x + 64));
        if (walls.getChildAt(w).world.y - player.world.y <= 12 && walls.getChildAt(w).world.y - player.world.y >= -12 && walls.getChildAt(w).world.x - (player.world.x + 64) >= -24 && walls.getChildAt(w).world.x - (player.world.x + 64) <= 24){
            block = true;
            console.log("Blocked");
        }
    } */
    if(yourTurn && !gameOver && !block){
        laddleTween = game.add.tween(laddle).to( { x: laddle.world.x + 64, y: laddle.world.y }, 1000, "Linear", true);
        yourTurn = false;
        score -= 50;
        scoreText.text = 'Score: ' + score;
        laddleTween.onComplete.add(enemyTurn);
    }    
}

var move;
var enemyTween;
function enemyTurn(){ //the enemy moves randomly for its turn
    for (var i = 0; i < spookies.countLiving(); i++){ //go through and move each ghost
        spooky = spookies.getChildAt(i); //using each ghost
        move = Math.floor(Math.random() * 4);
        if (move == 0) //move ghosts according to rng
            enemyTween = game.add.tween(spooky).to( { x: spooky.world.x, y: spooky.world.y + 64 }, 1000, "Linear", true);
        if (move == 1)
            enemyTween = game.add.tween(spooky).to( { x: spooky.world.x, y: spooky.world.y - 64 }, 1000, "Linear", true);
        if (move == 2)
            enemyTween = game.add.tween(spooky).to( { x: spooky.world.x + 64, y: spooky.world.y }, 1000, "Linear", true);
        if (move == 3)
            enemyTween = game.add.tween(spooky).to( { x: spooky.world.x - 64, y: spooky.world.y }, 1000, "Linear", true);
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