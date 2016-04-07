var game = new Phaser.Game(640, 640, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update });

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

var playerLayer;
var arrowLayer;
var floorLayer;

var arrowOne;
var arrowTwo;
var arrowTurn;

var enter;

var stairs;
var laddle;
var spooky;

var place;

var yourTurn;
var score;
var gameOver;
var spaces = [];
var spookies = [];

var rows;
var cols;
var level;
function create() {
    music = game.add.audio('music');
    music.loop = true;
    music.play();
    
    rows = 10;
    cols = 10;
    level = 1;
    gameOver = false; //the game can't end before it starts
    yourTurn = true; //start with the player's turn
    floorLayer = game.add.group();
    arrowLayer = game.add.group();
    playerLayer = game.add.group();
    var Space = function(x, y){
        Phaser.Sprite.call(this, game, x * 64, y * 64, 'paddleAtlas', 'space');
        //Phaser.Sprite.events.onInputDown.add(drawArrow, this);
        this.occupied = false;
        this.ID = x + (y * rows);
    };
    Space.prototype = Object.create(Phaser.Sprite.prototype);
    Space.prototype.constructor = Space;
    
    for (var x = 0; x < rows; x++){
        for (var y = 0; y < cols; y++){
            spaces[x + (y * rows)] = new Space(x, y);
            spaces[x + (y * rows)].inputEnabled = true;
            spaces[x + (y * rows)].input.useHandCursor = true;
            spaces[x + (y * rows)].events.onInputDown.add(drawArrow, {space : spaces[x + (y * rows)]});
            game.add.existing(spaces[x + (y * rows)]);
            floorLayer.add(spaces[x + (y * rows)]);
        }
    }
    var Laddle = function(x, y){
        Phaser.Sprite.call(this, game, x * 64 + 32, y * 64 + 32, 'paddleAtlas', 'laddle_01');
        changeOccupied(x, y);
        this.health = 50;
        this.healthText = game.add.text(-10, -30, this.health, { font: "20px Arial", fill: "#00ff00", align: "center" }); //set score to 0 and set tex
        this.addChild(this.healthText);
    };
    Laddle.prototype = Object.create(Phaser.Sprite.prototype);
    Laddle.prototype.constructor = Laddle;
    
    laddle = new Laddle(0, 0);
    laddle.animations.add('express', Phaser.Animation.generateFrameNames('laddle_', 1, 15, '', 2), 4, true); //create the animation of player
    laddle.animations.play('express');
    laddle.anchor.setTo(0.5, 0.5);
    playerLayer.add(laddle);
    
    stairs = game.add.sprite(rows * 64 -62, cols * 64 -62, 'paddleAtlas', 'stairs');
    //stairs.anchor.setTo(0.5, 0.5);
    playerLayer.add(stairs);
    
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
    
    spawnSpooks();
    
    enter = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
    
}

function spawnSpooks(){
    var x = 0;
    var y = 0;
    var index;
    var Spooky = function(x, y){
        Phaser.Sprite.call(this, game, x * 64 + 32, y * 64 + 32, 'paddleAtlas', 'ghost_left_1'); //place it right on a tile
        this.health = 20;
        this.healthText = game.add.text(-16, -48, this.health, { font: "20px Arial", fill: "#ffffff", align: "center" }); //set score to 0 and set tex
        this.addChild(this.healthText);
        changeOccupied(x, y);
    };
    Spooky.prototype = Object.create(Phaser.Sprite.prototype);
    Spooky.prototype.constructor = Spooky;
    
    while (spookies.length > 0){
        x = (spookies[0].world.x - 32)/64;
        y = (spookies[0].world.y - 32)/64;
        currentSpace = spaces[(y+1) * rows - (rows - x)];
        currentSpace.occupied = false;
        
        spookies[0].destroy();
        spookies.splice(0, 1);
        
    }
    
    for (var s = 0; s < level+2; s++){
        x = Math.floor(Math.random() * rows);
        y = Math.floor(Math.random() * cols);
        if (x == 9 && y == 9){
            x -= 1;
            y -= 1;
        }
        currentSpace = spaces[(y+1) * rows - (rows - x)];
        if (!(currentSpace.occupied)){
            spookies[s] = new Spooky(x, y);                
            spookies[s].animations.add('rattleLeft', Phaser.Animation.generateFrameNames('ghost_left_', 1, 2, '', 1), 2, true);
            spookies[s].animations.play('rattleLeft');
            spookies[s].anchor.setTo(0.5, 0.5);
    
            playerLayer.add(spookies[s]);
        }
        else{
            s--;
        }
    }
    yourTurn = true;
}

function update () {
    //call on the different move functions when we hit a button. onDown makes it so it only works once per press
    //game.input.onDown.add(moveDown, this);
    enter.onDown.add(moveTo);
    
}

function reachedStairs(){
    if(checkOverlap(laddle, stairs)){
        level++;
        laddleTween = game.add.tween(laddle).to( { x: laddle.world.x - 576, y: laddle.world.x - 576}, 250, "Linear", true);
        arrowLayer.x += -576;
        arrowLayer.y += -576;
        //arrowOne.visible = true;
        //arrowTwo.visible = true;
        changeOccupied(9, 9);
        changeOccupied(0, 0);
        //laddle.health = 50;
        
        laddleTween.onComplete.add(spawnSpooks);
        
    }
    else{
        laddleTween = game.add.tween(laddle).to( { x: laddle.world.x, y: laddle.world.y}, 250, "Linear", true);
        laddleTween.onComplete.add(enemyTurn, {sp : 0});
    }
}

var block;
var distX;
var distY;
var dirX;
var dirY;

function changeOccupied(x, y){
    spaces[(y+1) * rows - (rows - x)].occupied = !(spaces[(y+1) * rows - (rows - x)].occupied);
}

function drawArrow(){
    
    console.log(this.space.ID);
    console.log(this.space.occupied);
    if (yourTurn && !(this.space.occupied)){
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
            if (arrowTurn.scale.x == 1 && arrowTurn.scale.y == 1){
                moveToX = 64;
                moveToY = 64;
            }
            else if (arrowTurn.scale.x == 1 && arrowTurn.scale.y == -1){
                moveToX = 64;
                moveToY = -64;
            }
            else if (arrowTurn.scale.x == -1 && arrowTurn.scale.y == -1){
                moveToX = -64;
                moveToY = -64;
            }
            else if (arrowTurn.scale.x == -1 && arrowTurn.scale.y == 1){
                moveToX = -64;
                moveToY = 64;
            }
            arrowTurn.visible = false;
        }
        changeOccupied(Math.round((laddle.world.x - 32)/64), Math.round((laddle.world.y - 32)/64));
        changeOccupied(Math.round((laddle.world.x + moveToX - 32)/64), Math.round((laddle.world.y + moveToY - 32)/64));
        laddleTween = game.add.tween(laddle).to( { x: Math.round(laddle.world.x + moveToX), y: Math.round(laddle.world.y + moveToY)}, 750, "Linear", true);
        arrowLayer.x += moveToX;
        arrowLayer.y += moveToY;
        
        laddleTween.onComplete.add(spookCheck);        
    }
}

function spookCheck(){
    var sCount = 0;
    for (var i = 0; i < spookies.length; i++){
        distX = Math.round(spookies[i].world.x - laddle.world.x);
        distY = Math.round(spookies[i].world.y - laddle.world.y);
        if ((Math.abs(distX) <= 64 && Math.abs(distY) == 0) || (Math.abs(distX) == 0 && Math.abs(distY) <= 64)){
            spookies[i].inputEnabled = true;
            spookies[i].input.useHandCursor = true;
            spookies[i].events.onInputDown.add(attackSpooky, {spook : spookies[i]});
            sCount++;
        }
    }
    if (sCount == 0){
        yourTurn = false;
        reachedStairs();
    }
}

function attackSpooky(){
    this.spook.health -= 10;
    this.spook.healthText.setText(this.spook.health);
    if (this.spook.health <= 0){
        
        changeOccupied(Math.round((this.spook.world.x-32)/64), Math.round((this.spook.world.y-32)/64));
        console.log('x: ' + Math.round((this.spook.world.x-32)/64));
        console.log('y: ' + Math.round((this.spook.world.y-32)/64));
        var index = spookies.indexOf(this.spook);
        spookies.splice(index, 1);
        this.spook.destroy();
        laddle.health += 20;
        laddle.healthText.setText(laddle.health);
    }
    console.log('Spook: ' + this.spook.health);
    yourTurn = false;
    laddleTween = game.add.tween(laddle).to( { x: laddle.world.x, y: laddle.world.y}, 1, "Linear", true);
    laddleTween.onComplete.add(enemyTurn, {sp : 0});
}

var enemyTween;
var currentSpace;
function enemyTurn(){ //the enemy moves randomly for its turn
    if (spookies.length > 0){
        spooky = spookies[this.sp]; //using each ghost
        spookies[this.sp].inputEnabled = false;
        distX = Math.round(spooky.world.x - laddle.world.x);
        distY = Math.round(spooky.world.y - laddle.world.y);
        var r = Math.round((spooky.world.x - 32)/64);
        var c = Math.round((spooky.world.y - 32)/64);
        currentSpace = (c+1) * rows - (rows - r);

        if ((Math.abs(distX) <= 64 && Math.abs(distY) == 0) || (Math.abs(distX) == 0 && Math.abs(distY) <= 64)){
            laddle.health -= 10;
            laddle.healthText.setText(laddle.health);
            console.log('Laddle: ' + laddle.health);
            enemyTween = game.add.tween(spooky).to( { x: spooky.world.x, y: spooky.world.y}, 750, "Linear", true);
        }
        else if(Math.abs(distX) >= 192 ){
            if (distX >= 192 && !(spaces[currentSpace-1].occupied) && !(spaces[currentSpace-2].occupied)){
                enemyTween = game.add.tween(spooky).to( { x: Math.round(spooky.world.x - 128), y: spooky.world.y }, 750, "Linear", true);
                changeOccupied(r, c);
                changeOccupied(r - 2, c);
            }
            else if (distX <= -192 && !(spaces[currentSpace+1].occupied) && !(spaces[currentSpace+2].occupied)){
                enemyTween = game.add.tween(spooky).to( { x: Math.round(spooky.world.x + 128), y: spooky.world.y }, 750, "Linear", true);
                changeOccupied(r, c);
                changeOccupied(r + 2, c);   
            }
            else
                enemyTween = game.add.tween(spooky).to( { x: spooky.world.x, y: spooky.world.y}, 750, "Linear", true);
        }
        else if(Math.abs(distY) >= 192){
            if (distY >= 192 && !(spaces[currentSpace-10].occupied) && !(spaces[currentSpace-20].occupied)){
                enemyTween = game.add.tween(spooky).to( { x: spooky.world.x, y: Math.round(spooky.world.y - 128)}, 750, "Linear", true);
                changeOccupied(r, c);
                changeOccupied(r, c - 2);
            }
            else if (distY <= -192 && !(spaces[currentSpace+10].occupied) && !(spaces[currentSpace+10].occupied)){
                enemyTween = game.add.tween(spooky).to( { x: spooky.world.x, y: Math.round(spooky.world.y + 128)}, 750, "Linear", true);
                changeOccupied(r, c);
                changeOccupied(r, c + 2);
            }
            else
                enemyTween = game.add.tween(spooky).to( { x: spooky.world.x, y: spooky.world.y}, 750, "Linear", true);
        }
        else if(Math.abs(distX) >= 128){
            if (distX >= 128 && !(spaces[currentSpace-1].occupied)){
                enemyTween = game.add.tween(spooky).to( { x: Math.round(spooky.world.x - 64), y: spooky.world.y }, 750, "Linear", true);
                changeOccupied(r, c);
                changeOccupied(r - 1, c);
            }
            else if (distX <= -128 && !(spaces[currentSpace+1].occupied)){
                enemyTween = game.add.tween(spooky).to( { x: Math.round(spooky.world.x + 64), y: spooky.world.y }, 750, "Linear", true);
                changeOccupied(r, c);
                changeOccupied(r + 1, c);
            }
            else
                enemyTween = game.add.tween(spooky).to( { x: spooky.world.x, y: spooky.world.y}, 750, "Linear", true);
        }
        else if(Math.abs(distY) >= 128){
            if (distY >= 128 && !(spaces[currentSpace-10].occupied)){
                enemyTween = game.add.tween(spooky).to( { x: spooky.world.x, y: Math.round(spooky.world.y - 64)}, 750, "Linear", true);
                changeOccupied(r, c);
                changeOccupied(r, c - 1);
            }
            else if (distY <= -128 && !(spaces[currentSpace+10].occupied)){
                enemyTween = game.add.tween(spooky).to( { x: spooky.world.x, y: Math.round(spooky.world.y + 64)}, 750, "Linear", true);
                changeOccupied(r, c);
                changeOccupied(r, c + 1);
            }
            else
                enemyTween = game.add.tween(spooky).to( { x: spooky.world.x, y: spooky.world.y}, 750, "Linear", true);
        }
        else if(Math.abs(distX) >= 64 && Math.abs(distY) >= 64){
            if (distX >= 64 && !(spaces[currentSpace-1].occupied)){
                enemyTween = game.add.tween(spooky).to( { x: Math.round(spooky.world.x - 64), y: spooky.world.y}, 750, "Linear", true);
                changeOccupied(r, c);
                changeOccupied(r - 1, c);
            }
            else if (distX <= -64 && !(spaces[currentSpace+1].occupied)){
                enemyTween = game.add.tween(spooky).to( { x: Math.round(spooky.world.x + 64), y: spooky.world.y}, 750, "Linear", true);
                changeOccupied(r, c);
                changeOccupied(r + 1, c);
            }
            else if (distY >= 64 && !(spaces[currentSpace-10].occupied)){
                enemyTween = game.add.tween(spooky).to( { x: spooky.world.x, y: Math.round(spooky.world.y - 64)}, 750, "Linear", true);
                changeOccupied(r, c);
                changeOccupied(r, c - 1);
            }
            else if (distY <= -64 && !(spaces[currentSpace+10].occupied)){
                enemyTween = game.add.tween(spooky).to( { x: spooky.world.x, y: Math.round(spooky.world.y + 64)}, 750, "Linear", true);
                changeOccupied(r, c);
                changeOccupied(r, c + 1);
            }
            else
                enemyTween = game.add.tween(spooky).to( { x: spooky.world.x, y: spooky.world.y}, 750, "Linear", true);
        }
        else
            enemyTween = game.add.tween(spooky).to( { x: spooky.world.x, y: spooky.world.y}, 750, "Linear", true);

        if (this.sp < spookies.length - 1)
            enemyTween.onComplete.add(enemyTurn, {sp : this.sp+1});
        else{
            enemyTween.onComplete.add(playersTurn); //player can't move until ghosts are done
            this.sp = 0;
        }
    }
    else
        playersTurn();
}

function playersTurn(){
    yourTurn = true; //player's turn
}

var col;
var scream;
var rand; 
//checks for overlapping collisions  
    /*for(var i = 0; i < spookies.length; i++){
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
    }*/

function checkOverlap(spriteA, spriteB) {

    var boundsA = spriteA.getBounds();
    var boundsB = spriteB.getBounds();

    return Phaser.Rectangle.intersects(boundsA, boundsB);

}

function checkGameOver(){
    if(health <= 0){ //if no chests remain
        scoreText.text = "THE PADDLE CLAN IS VICTORIOUS! Score: " + score; //display win text
        gameOver = true; //end the game
    }
}