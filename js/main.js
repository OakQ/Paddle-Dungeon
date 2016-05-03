var game = new Phaser.Game(640, 640, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update });

function preload() {
    //loads the atlas with all the sprites
    game.load.atlas('paddleAtlas', 'assets/Sprites/paddleAtlas.png', 'assets/Sprites/paddleAtlas.json');
<<<<<<< HEAD
    game.load.atlas('seedFightAtlas', 'assets/Sprites/seedFightAtlas.png', 'assets/Sprites/seedFightAtlas.json');
    game.load.atlas('seedMoveAtlas', 'assets/Sprites/seedMoveAtlas.png', 'assets/Sprites/seedMoveAtlas.json');
=======
    game.load.atlas('seedDanceAtlas', 'assets/Sprites/seedDanceAtlas.png', 'assets/Sprites/seedDanceAtlas.json');
    game.load.atlas('seedFightAtlas', 'assets/Sprites/seedFightAtlas.png', 'assets/Sprites/seedFightAtlas.json');
>>>>>>> origin/gh-pages
    game.load.atlas('hamsterAtlas', 'assets/Sprites/hamsterAtlas.png', 'assets/Sprites/hamsterAtlas.json');
    game.load.audio('hit_1', 'assets/Audio/Hit_1.wav');
    game.load.audio('hit_2', 'assets/Audio/Hit_2.wav');
    game.load.audio('hit_3', 'assets/Audio/Hit_3.wav');
    game.load.audio('hit_4', 'assets/Audio/Hit_4.wav');
    game.load.audio('hit_5', 'assets/Audio/Hit_5.wav');
    game.load.audio('coins', 'assets/Audio/key_pickup.mp3');
    game.load.audio('scream', 'assets/Audio/scream_horror1.mp3');
    game.load.audio('music', 'assets/Audio/Hamtaro.mp3');
}
//layers
var playerLayer;
var arrowLayer;
var floorLayer;
//arrows
var arrowOne;
var arrowTwo;
var arrowTurn;
//buttons
var enter;
//ojects
var stairs;
var seedle;
var enemy;

var yourTurn; //the player's turn (boolean)
var score; //current Score
var gameOverText;
var spaces = []; //array of all grid spaces
var enemies = []; //array of all living enemies

var rows; //number of rows in the grid
var cols; //number of columns
var level; //current level

var distX;
var distY;
var dirX;
var dirY;

var seedleTween;
var moveToX;
var moveToY;

var enemyTween;
var currentSpace;

function create() {
    music = game.add.audio('music');
    music.loop = true;
    music.play();
    
    rows = 10;
    cols = 10;
    level = 1;
    yourTurn = true; //start with the player's turn
    
    //create our layer groups
    floorLayer = game.add.group(); 
    arrowLayer = game.add.group();
    playerLayer = game.add.group();
    
    gameOverText = game.add.text(game.world.centerX, game.world.centerY, "SEEDLE HAS BEEN EATEN! GAME OVER", { font: "30px Arial", fill: "#ffffff", align: "center" });
    gameOverText.stroke = '#000000';
    gameOverText.strokeThickness = 8;
    gameOverText.fill = '#ffffff';
    gameOverText.anchor.setTo(0.5, 0.5);
    gameOverText.visible = false;
    
    //Space object. Inherits from Phaser.Sprite. Takes the grid position as parameters
    var Space = function(x, y){
        Phaser.Sprite.call(this, game, x * 64, y * 64, 'paddleAtlas', 'space'); //create the sprite and inherit Sprite class
        this.occupied = false; //whether this space is occupied or not
        this.ID = x + (y * rows); //id of the space (for debugging)
    };
    Space.prototype = Object.create(Phaser.Sprite.prototype); //necessary to to use the Space Object
    Space.prototype.constructor = Space;
    
    //create all the spaces to fill the game area
    for (var x = 0; x < rows; x++){ //nested loop for the rows and cols
        for (var y = 0; y < cols; y++){
            //index = x + (y * rows)
            spaces[x + (y * rows)] = new Space(x, y); //create a new Space at that X, Y coordinate and adds it into spaces
            spaces[x + (y * rows)].inputEnabled = true; //enable input on that space
            spaces[x + (y * rows)].input.useHandCursor = true; //changes the cursor
            spaces[x + (y * rows)].events.onInputDown.add(drawArrow, {space : spaces[x + (y * rows)]}); //when clicked on, calls the drawArrow function with that particular space as the parameter
            game.add.existing(spaces[x + (y * rows)]); //add the space to the game
            floorLayer.add(spaces[x + (y * rows)]); //add the space to the proper layer
        }
    }
    //Seedle Object
    var Seedle = function(x, y){
<<<<<<< HEAD
        Phaser.Sprite.call(this, game, x * 64+32, y * 64+32, 'seedMoveAtlas', 'seed_dance_01'); //inherits Sprite
=======
        Phaser.Sprite.call(this, game, x * 64+32, y * 64+32, 'seedDanceAtlas', 'seed_dance_01'); //inherits Sprite
>>>>>>> origin/gh-pages
        changeOccupied(x, y); //changeOccupied changes the occupied boolean of a defined space, given by the X, Y grid position
        this.health = 50; //Seedle has 50 health
        this.name = "Seedle";
        this.statText = game.add.text(0, -32, this.name + ": " + this.health, { font: "20px Arial", fill: "#ffffff", align: "center" }); //display health with text       
        this.statText.stroke = '#000000';       
        this.statText.strokeThickness = 8;
        this.statText.fill = '#ffffff';
        this.statText.anchor.setTo(0.5, 0.5);        
        this.addChild(this.statText); //make the text a child of seedle so that ti follows him      
    };
    Seedle.prototype = Object.create(Phaser.Sprite.prototype);
    Seedle.prototype.constructor = Seedle;
<<<<<<< HEAD
    
    seedle = new Seedle(0, 0); //create seedle at the top left corner grid space
    seedle.animations.add('dance', Phaser.Animation.generateFrameNames('seed_dance_', 1, 15, '', 2), 4, true); //create the animation of seedle
    seedle.animations.add('back', Phaser.Animation.generateFrameNames('seed_back_', 1, 10, '', 2), 4, false); 
    seedle.animations.add('left', Phaser.Animation.generateFrameNames('seed_left_', 1, 10, '', 2), 4, false);
    seedle.animations.add('right', Phaser.Animation.generateFrameNames('seed_right_', 1, 10, '', 2), 4, false);
    seedle.animations.add('forward', Phaser.Animation.generateFrameNames('seed_forward_', 1, 10, '', 2), 4, false);
    //seedle.animations.add('dance', Phaser.Animation.generateFrameNames('seed_dance_', 1, 15, '', 2), 4, true); 
=======
    console.log("enter");
    seedle = new Seedle(0, 0); //create seedle at the top left corner grid space
    seedle.animations.add('dance', Phaser.Animation.generateFrameNames('seed_dance_', 1, 15, '', 2), 4, true); //create the animation of seedle
>>>>>>> origin/gh-pages
    seedle.animations.play('dance');
    seedle.anchor.setTo(0.5, 0.5); //center the anchor
    playerLayer.add(seedle); //add seedle to the proper layer
    
    
    
    stairs = game.add.sprite(rows * 64 -62, cols * 64 -62, 'paddleAtlas', 'stairs'); //create stairs
    playerLayer.add(stairs); //add to player Layer
    
    //Arrows
    arrowOne = arrowLayer.create(seedle.world.x, seedle.world.y, 'paddleAtlas', 'arrow_one'); //arrow for moving a single space
    arrowOne.anchor.setTo(0, 0.5); //set anchor to the center of the beginning of the arrow
    arrowOne.angle = 90; //set angle to 90
    arrowOne.visible = false; //invisible
    
    arrowTwo = arrowLayer.create(seedle.world.x, seedle.world.y, 'paddleAtlas', 'arrow_two'); //arrow for moving 2 spaces
    arrowTwo.anchor.setTo(0.5, 0);//points a different direction than arrowOne in the Atlas, hence the reversed x, y
    arrowTwo.angle = 0;
    arrowTwo.visible = false;
    
    arrowTurn = arrowLayer.create(seedle.world.x, seedle.world.y, 'paddleAtlas', 'arrow_turn'); //arrow for moving diagonally
    arrowTurn.anchor.setTo(0, 0.16);
    arrowTurn.angle = 0;
    arrowTurn.visible = false;
    
    spawnEnemies(); //create new enemies
    
    enter = game.input.keyboard.addKey(Phaser.Keyboard.ENTER); //create enter button
}

function spawnEnemies(){ //creates a number of enemies and adds them into the world
    var x = 0;
    var y = 0;
    var index;
    
    //Fast Enemy -> increased mobility
    //can move up to 4 spaces in one turn
    //offset by having weaker attack -> note: don't have to actually implement if you don't want to, just an afterthought
    var speedyEnemy = function(x, y){
        Phaser.Sprite.call(this, game, x * 64 + 32, y * 64 + 32, 'hamsterAtlas', 'green_forward_1'); //inherits Sprite
<<<<<<< HEAD
        this.health = 20; //set health to 20
        this.name = "Speedy";
        this.statText = game.add.text(0, -32, this.name + ": " + this.health, { font: "20px Arial", fill: "#ffffff", align: "center" }); //display health with text
        this.statText.stroke = '#000000';
        this.statText.strokeThickness = 8;
        this.statText.fill = '#43d637';
        this.statText.anchor.setTo(0.5, 0.5);
        
        this.addChild(this.statText); //add text to enemy
        changeOccupied(x, y); //change occupy variable of that space to be occupied
        
        //extra vars
        this.movement = 3;
        this.damageMultiplier = 0.75;//see note above
        this.regen = 0;
    };
    speedyEnemy.prototype = Object.create(Phaser.Sprite.prototype);
    speedyEnemy.prototype.constructor = speedyEnemy;
    
    //Heavy Enemy -> increased damage
    //does twice as much damage, but moves slower to offest
    var heavyEnemy = function(x, y){
        Phaser.Sprite.call(this, game, x * 64 + 32, y * 64 + 32, 'hamsterAtlas', 'red_forward_1'); //inherits Sprite
        this.health = 20; //set health to 20
        this.name = "Heavy";
        this.statText = game.add.text(0, -32, this.name + ": " + this.health, { font: "20px Arial", fill: "#ffffff", align: "center" }); //display health with text
        this.statText.stroke = '#000000';
        this.statText.strokeThickness = 8;
        this.statText.fill = '#ff0000';
        this.statText.anchor.setTo(0.5, 0.5);
        
        this.addChild(this.statText); //add text to enemy
        changeOccupied(x, y); //change occupy variable of that space to be occupied
        
        //extra vars
        this.movement = 1;
        this.damageMultiplier = 2.0;
        this.regen = 0;
    };
    heavyEnemy.prototype = Object.create(Phaser.Sprite.prototype);
    heavyEnemy.prototype.constructor = heavyEnemy;
    
    //Meaty Enemy -> lots of health
    //impaired speed to offset massive amounts of health
    var meatyEnemy = function(x, y){
        Phaser.Sprite.call(this, game, x * 64 + 32, y * 64 + 32, 'hamsterAtlas', 'orange_forward_1'); //inherits Sprite
        this.health = 100; //set health to 100
        this.name = "Meaty";
        this.statText = game.add.text(0, -32, this.name + ": " + this.health, { font: "20px Arial", fill: "#ffffff", align: "center" }); //display health with text
        this.statText.stroke = '#000000';
        this.statText.strokeThickness = 8;
        this.statText.fill = '#d68e05';
        this.statText.anchor.setTo(0.5, 0.5);
        
        this.addChild(this.statText); //add text to enemy
        changeOccupied(x, y); //change occupy variable of that space to be occupied
        
        this.movement = 1;
        this.damageMultiplier = 1.0;
        this.regen = 0;
    };
    meatyEnemy.prototype = Object.create(Phaser.Sprite.prototype);
    meatyEnemy.prototype.constructor = meatyEnemy;
    
    //Bomb Enemy -> explodes when makes contact with player
    //when the boomEnemy is one tile away from the player, it detonates
    //on detonation, the boomEnemy deals damage to the player but kills itself
    var boomEnemy = function(x, y){
        Phaser.Sprite.call(this, game, x * 64 + 32, y * 64 + 32, 'hamsterAtlas', 'gray_forward_1'); //inherits Sprite
        this.health = 20; //set health to 20
        this.name = "Boomer";
        this.statText = game.add.text(0, -32, this.name + ": " + this.health, { font: "20px Arial", fill: "#ffffff", align: "center" }); //display health with text
        this.statText.stroke = '#000000';
        this.statText.strokeThickness = 8;
        this.statText.fill = '#8b8a8a';
=======
        this.health = 20; //set health to 20
        this.name = "Speedy";
        this.statText = game.add.text(0, -32, this.name + ": " + this.health, { font: "20px Arial", fill: "#ffffff", align: "center" }); //display health with text
        this.statText.stroke = '#000000';
        this.statText.strokeThickness = 8;
        this.statText.fill = '#43d637';
>>>>>>> origin/gh-pages
        this.statText.anchor.setTo(0.5, 0.5);
        
        this.addChild(this.statText); //add text to enemy
        changeOccupied(x, y); //change occupy variable of that space to be occupied
        
        //extra vars
<<<<<<< HEAD
        this.movement = 2;
        this.damageMultiplier = 3;
        this.regen = 0;
    };
=======
        this.movement = 3;
        this.damageMultiplier = 0.75;//see note above
        this.regen = 0;
    };
    speedyEnemy.prototype = Object.create(Phaser.Sprite.prototype);
    speedyEnemy.prototype.constructor = speedyEnemy;
    
    //Heavy Enemy -> increased damage
    //does twice as much damage, but moves slower to offest
    var heavyEnemy = function(x, y){
        Phaser.Sprite.call(this, game, x * 64 + 32, y * 64 + 32, 'hamsterAtlas', 'red_forward_1'); //inherits Sprite
        this.health = 20; //set health to 20
        this.name = "Heavy";
        this.statText = game.add.text(0, -32, this.name + ": " + this.health, { font: "20px Arial", fill: "#ffffff", align: "center" }); //display health with text
        this.statText.stroke = '#000000';
        this.statText.strokeThickness = 8;
        this.statText.fill = '#ff0000';
        this.statText.anchor.setTo(0.5, 0.5);
        
        this.addChild(this.statText); //add text to enemy
        changeOccupied(x, y); //change occupy variable of that space to be occupied
        
        //extra vars
        this.movement = 1;
        this.damageMultiplier = 2.0;
        this.regen = 0;
    };
    heavyEnemy.prototype = Object.create(Phaser.Sprite.prototype);
    heavyEnemy.prototype.constructor = heavyEnemy;
    
    //Meaty Enemy -> lots of health
    //impaired speed to offset massive amounts of health
    var meatyEnemy = function(x, y){
        Phaser.Sprite.call(this, game, x * 64 + 32, y * 64 + 32, 'hamsterAtlas', 'orange_forward_1'); //inherits Sprite
        this.health = 100; //set health to 100
        this.name = "Meaty";
        this.statText = game.add.text(0, -32, this.name + ": " + this.health, { font: "20px Arial", fill: "#ffffff", align: "center" }); //display health with text
        this.statText.stroke = '#000000';
        this.statText.strokeThickness = 8;
        this.statText.fill = '#d68e05';
        this.statText.anchor.setTo(0.5, 0.5);
        
        this.addChild(this.statText); //add text to enemy
        changeOccupied(x, y); //change occupy variable of that space to be occupied
        
        this.movement = 1;
        this.damageMultiplier = 1.0;
        this.regen = 0;
    };
    meatyEnemy.prototype = Object.create(Phaser.Sprite.prototype);
    meatyEnemy.prototype.constructor = meatyEnemy;
    
    //Bomb Enemy -> explodes when makes contact with player
    //when the boomEnemy is one tile away from the player, it detonates
    //on detonation, the boomEnemy deals damage to the player but kills itself
    var boomEnemy = function(x, y){
        Phaser.Sprite.call(this, game, x * 64 + 32, y * 64 + 32, 'hamsterAtlas', 'gray_forward_1'); //inherits Sprite
        this.health = 20; //set health to 20
        this.name = "Boomer";
        this.statText = game.add.text(0, -32, this.name + ": " + this.health, { font: "20px Arial", fill: "#ffffff", align: "center" }); //display health with text
        this.statText.stroke = '#000000';
        this.statText.strokeThickness = 8;
        this.statText.fill = '#8b8a8a';
        this.statText.anchor.setTo(0.5, 0.5);
        
        this.addChild(this.statText); //add text to enemy
        changeOccupied(x, y); //change occupy variable of that space to be occupied
        
        //extra vars
        this.movement = 2;
        this.damageMultiplier = 3;
        this.regen = 0;
    };
>>>>>>> origin/gh-pages
    boomEnemy.prototype = Object.create(Phaser.Sprite.prototype);
    boomEnemy.prototype.constructor = boomEnemy;
    
    //Healing Enemy -> heals on each enemy (or player) turn
    //caps at a lower health than others since it has regeneration capabilities
    var healEnemy = function(x, y){
        Phaser.Sprite.call(this, game, x * 64 + 32, y * 64 + 32, 'hamsterAtlas', 'blue_forward_1'); //inherits Sprite
        this.health = 15; //set health to 20
        this.name = "Dr. Hamster, MD";
        this.statText = game.add.text(0, -32, this.name + ": " + this.health, { font: "20px Arial", fill: "#ffffff", align: "center" }); //display health with text
        this.statText.stroke = '#000000';
        this.statText.strokeThickness = 8;
        this.statText.fill = '#0895ff';
        this.statText.anchor.setTo(0.5, 0.5);
        
        this.addChild(this.statText); //add text to enemy
        changeOccupied(x, y); //change occupy variable of that space to be occupied
        
        //extra vars
        this.regen = 5;
        this.movement = 2;
        this.damageMultiplier = 1;
    };
    healEnemy.prototype = Object.create(Phaser.Sprite.prototype);
    healEnemy.prototype.constructor = healEnemy;
    
    //God Enemy -> There is no escape
    //extremely tough, extremely fast, and 100% scary as hell
    var godEnemy = function(x, y){
        Phaser.Sprite.call(this, game, x * 64 + 32, y * 64 + 32, 'hamsterAtlas', 'boss_forward_1'); //inherits Sprite
        this.health = 150; //set health to 150
        this.name = "Boss Hamster";
        this.statText = game.add.text(0, -32, this.name + ": " + this.health, { font: "20px Arial", fill: "#ffffff", align: "center" }); //display health with text
        this.statText.stroke = '#000000';
        this.statText.strokeThickness = 8;
        this.statText.fill = '#ffffff';
        this.statText.anchor.setTo(0.5, 0.5);
        
        this.addChild(this.statText); //add text to enemy
        changeOccupied(x, y); //change occupy variable of that space to be occupied
        
        //extra vars
        this.damageMultiplier = 2.5;
        this.movement = 3;
        this.regen = 100;
    };
    godEnemy.prototype = Object.create(Phaser.Sprite.prototype);
    godEnemy.prototype.constructor = godEnemy;
    
    
    //Destroy living enemies (used to move between levels)
    var enemyType;
    while (enemies.length > 0){ //go through the array of enemies
        x = (enemies[0].world.x - 32)/64; //calculate the x and y grid coordinates
        y = (enemies[0].world.y - 32)/64;
        currentSpace = spaces[(y+1) * rows - (rows - x)]; //get the space that enemy is on
        currentSpace.occupied = false; //change the occupied to false
        
        enemies[0].destroy(); //destroy the enemy game object
        enemies.splice(0, 1); //remove it from the array
        
    }
    
    //Create new enemies (at the start of a level)
    for (var s = 0; s < level+2; s++){ //level 1: 3 enemies, level 2: 4, level 5: 7, etc
        x = Math.floor(Math.random() * rows); //choose random grid coordinates
        y = Math.floor(Math.random() * cols);
        if (x == 9 && y == 9){ //anywhere except the stairs
            x -= 1;
            y -= 1;
        }
        currentSpace = spaces[(y+1) * rows - (rows - x)]; //get that space
        if (!(currentSpace.occupied)){ //if the space has nothing on it, create a new enemy
            enemyType = Math.floor(Math.random() * 6);
            switch(enemyType){
                case 0:
                    enemies[s] = new speedyEnemy(x, y);                
                    enemies[s].animations.add('forward', Phaser.Animation.generateFrameNames('green_forward_', 1, 3, '', 1), 3, false);
                    enemies[s].animations.add('left', Phaser.Animation.generateFrameNames('green_left_', 1, 3, '', 1), 3, false);
                    enemies[s].animations.add('right', Phaser.Animation.generateFrameNames('green_right_', 1, 3, '', 1), 3, false);
                    enemies[s].animations.add('back', Phaser.Animation.generateFrameNames('green_back_', 1, 3, '', 1), 3, false);
                    break;
                    
                case 1:
                    enemies[s] = new heavyEnemy(x, y);                
                    enemies[s].animations.add('forward', Phaser.Animation.generateFrameNames('red_forward_', 1, 3, '', 1), 3, false);
                    enemies[s].animations.add('left', Phaser.Animation.generateFrameNames('red_left_', 1, 3, '', 1), 3, false);
                    enemies[s].animations.add('right', Phaser.Animation.generateFrameNames('red_right_', 1, 3, '', 1), 3, false);
                    enemies[s].animations.add('back', Phaser.Animation.generateFrameNames('red_back_', 1, 3, '', 1), 3, false);
                    break;
                case 2:
                    enemies[s] = new meatyEnemy(x, y);                
                    enemies[s].animations.add('forward', Phaser.Animation.generateFrameNames('orange_forward_', 1, 3, '', 1), 3, false);
                    enemies[s].animations.add('left', Phaser.Animation.generateFrameNames('orange_left_', 1, 3, '', 1), 3, false);
                    enemies[s].animations.add('right', Phaser.Animation.generateFrameNames('orange_right_', 1, 3, '', 1), 3, false);
                    enemies[s].animations.add('back', Phaser.Animation.generateFrameNames('orange_back_', 1, 3, '', 1), 3, false);
                    break;
                    
                case 3:
                    enemies[s] = new boomEnemy(x, y);                
                    enemies[s].animations.add('forward', Phaser.Animation.generateFrameNames('gray_forward_', 1, 3, '', 1), 3, false);
                    enemies[s].animations.add('left', Phaser.Animation.generateFrameNames('gray_left_', 1, 3, '', 1), 3, false);
                    enemies[s].animations.add('right', Phaser.Animation.generateFrameNames('gray_right_', 1, 3, '', 1), 3, false);
                    enemies[s].animations.add('back', Phaser.Animation.generateFrameNames('gray_back_', 1, 3, '', 1), 3, false);
                    break;
                    
                case 4:
                    enemies[s] = new healEnemy(x, y);                
                    enemies[s].animations.add('forward', Phaser.Animation.generateFrameNames('blue_forward_', 1, 3, '', 1), 3, false);
                    enemies[s].animations.add('left', Phaser.Animation.generateFrameNames('blue_left_', 1, 3, '', 1), 3, false);
                    enemies[s].animations.add('right', Phaser.Animation.generateFrameNames('blue_right_', 1, 3, '', 1), 3, false);
                    enemies[s].animations.add('back', Phaser.Animation.generateFrameNames('blue_back_', 1, 3, '', 1), 3, false);
                    break;
                    
                case 5:
                    enemies[s] = new godEnemy(x, y);                
                    enemies[s].animations.add('forward', Phaser.Animation.generateFrameNames('boss_forward_', 1, 3, '', 1), 3, false);
                    enemies[s].animations.add('left', Phaser.Animation.generateFrameNames('boss_left_', 1, 3, '', 1), 3, false);
                    enemies[s].animations.add('right', Phaser.Animation.generateFrameNames('boss_right_', 1, 3, '', 1), 3, false);
                    enemies[s].animations.add('back', Phaser.Animation.generateFrameNames('boss_back_', 1, 3, '', 1), 3, false);
                    break;
            }
            
            enemies[s].anchor.setTo(0.5, 0.5);
    
            playerLayer.add(enemies[s]); // add enemy to the layer
        }
        else //if the space is occupied, decrement s so we can choose again
            s--;
    }
    yourTurn = true; //start the player's turn
}

function update () {
    checkGameOver();
    enter.onDown.add(moveTo); //when you hit Enter, the player will move
}

function checkGameOver(){
    if(seedle.health <= 0){ //if seedle's health is lost
        gameOverText.visible = true;
        seedle.destroy();
        yourTurn = false;
    }
}

//if the player reaches the stairs, they move on to the next level
function reachedStairs(){
    if(checkOverlap(seedle, stairs)){ //player must overlap the stairs
        level++; //increase level
        seedleTween = game.add.tween(seedle).to( { x: seedle.world.x - 576, y: seedle.world.x - 576}, 250, "Linear", true); //move player back to 0, 0
        arrowLayer.x += -576; //move arrows back to 0,0 with the player
        arrowLayer.y += -576;
        changeOccupied(9, 9); //change the occupied of the stairs space and the beginning space
        changeOccupied(0, 0);
        
        seedleTween.onComplete.add(spawnEnemies); // when seedle has moved back, clear enemies and spawn new ones
        
    }
    else{
        seedleTween = game.add.tween(seedle).to( { x: seedle.world.x, y: seedle.world.y}, 250, "Linear", true); //if the player hasn't reached the stairs, do an empty tween and start the enemy's turn
        seedleTween.onComplete.add(enemyTurn, {sp : 0}); //sp will be the index that the enemies array uses. We start at the beginning
    }
}

//reverses the occupied boolean of a space given grid coordinates
function changeOccupied(x, y){ 
    spaces[(y+1) * rows - (rows - x)].occupied = !(spaces[(y+1) * rows - (rows - x)].occupied);
}

//draws the arrow when you click on a valid space
function drawArrow(){
    
    if (yourTurn && !(this.space.occupied)){ //arow will only draw during the player's turn and only if that space is unoccupied
        dirX = Math.round(game.input.mousePointer.x - seedle.world.x); //calculate distance between mousepointer and the player
        dirY = Math.round(game.input.mousePointer.y - seedle.world.y);
        console.log(dirX + " " + dirY);
        //draw oneArrow if the player clicks one space away from the player in any direction.
        if ((Math.abs(dirX) >= 32 && Math.abs(dirX) <= 96 && Math.abs(dirY) <= 32) || (Math.abs(dirY) >= 32 && Math.abs(dirY) <= 96 && Math.abs(dirX) <= 32)){
            console.log("1");
            arrowOne.visible = true; // make arrowOne visible and hide the others
            arrowTwo.visible = false;
            arrowTurn.visible = false;
            //check for direction of click
            if (dirY >= 32 && dirY <= 96){ //down
                arrowOne.angle = 90; //rotate arrow so it points in the right direction          
            }
            else if (dirY <= -32 && dirY >= -96){ //up
                arrowOne.angle = -90;
            }
            else if (dirX >= 32 && dirX <= 96){ //right
                arrowOne.angle = 0;
            }
            else if (dirX <= -32 && dirX >= -96){ //left
                arrowOne.angle = -180;
            }
        }
        //draw twoArrow if the player clicks two spaces away in a straight line from the player in any direction.
        else if ((Math.abs(dirX) > 96 && Math.abs(dirX) <= 160 && Math.abs(dirY) <= 32) || (Math.abs(dirY) > 96 && Math.abs(dirY) <= 160 && Math.abs(dirX) <= 32)){
            console.log("2");
            arrowOne.visible = false; //set arrowTwo to be visible and hide the others
            arrowTwo.visible = true;
            arrowTurn.visible = false;
            if (dirY > 96 && dirY <= 160){ //down
                arrowTwo.angle = 0;            
            }
            else if (dirY < -96 && dirY >= -160){ //up
                arrowTwo.angle = -180;
            }
            else if (dirX > 96 && dirX <= 160){ //right
                arrowTwo.angle = -90;
            }
            else if (dirX < 96 && dirX >= -160){ //left
                arrowTwo.angle = 90;
            }
        }
        //draw turnArrow if the player clicks diagonally from the player in any direction.
        else if ((Math.abs(dirX) >= 32 && Math.abs(dirX) <= 96 && Math.abs(dirY) <= 96) || (Math.abs(dirY) >= 32 && Math.abs(dirY) <= 96 && Math.abs(dirX) <= 96)){
            console.log("turn");
            arrowOne.visible = false; //set arrowTurn to be visible and hide the others
            arrowTwo.visible = false;
            arrowTurn.visible = true;
            if (dirY >= 32 && dirY <= 96 && dirX >= 32 && dirX <= 96){ //down, right
                arrowTurn.scale.x = 1; //change the scale so it rotates properly
                arrowTurn.scale.y = 1;            
            }
            else if (dirY <= -32 && dirY >= -96 && dirX >= 32 && dirX <= 96){ //up, right
                arrowTurn.scale.x = 1;
                arrowTurn.scale.y = -1;
            }
            else if (dirY <= -32 && dirY >= -96 && dirX <= -32 && dirX >= -96){ //up, left
                arrowTurn.scale.x = -1;
                arrowTurn.scale.y = -1;
            }
            else if (dirY >= 32 && dirY <= 96 && dirX <= -32 && dirX >= -96){ //down, right
                arrowTurn.scale.x = -1;
                arrowTurn.scale.y = 1;
            }
        }
        // if the player did not click on a valid space, make all arrows invisible
        else{
            console.log("invalid");
            arrowOne.visible = false;
            arrowTwo.visible = false;
            arrowTurn.visible = false;
        }
    }
}

//moves the player to wherever the arrow is pointing
function moveTo(){
    
    if (arrowOne.visible || arrowTwo.visible || arrowTurn.visible) { //one of the arrows must be visible
        if (arrowOne.visible) { //if it's arrow one
            if (arrowOne.angle == 0){ //check the angle to determine which direction
                moveToX = 64; // how many pixels away seedle is gonna move
<<<<<<< HEAD
                moveToY = 0;
                seedle.animations.play('right');
=======
                moveToY = 0; 
>>>>>>> origin/gh-pages
            }
            else if (arrowOne.angle == 90){
                moveToX = 0;
                moveToY = 64; 
                seedle.animations.play('forward');
            }
            else if (arrowOne.angle == -180){
                moveToX = -64;
                moveToY = 0;
                seedle.animations.play('left');
            }
            else if (arrowOne.angle == -90){
                moveToX = 0;
                moveToY = -64; 
                seedle.animations.play('back');
            }            
            arrowOne.visible = false; //turn off the arrow
        }
        else if (arrowTwo.visible) {
            if (arrowTwo.angle == 0){
                moveToX = 0;
                moveToY = 128; //move 2 spaces
                seedle.animations.play('forward');
            }
            else if (arrowTwo.angle == 90){
                moveToX = -128;
                moveToY = 0; 
                seedle.animations.play('left');
            }
            else if (arrowTwo.angle == -180){
                moveToX = 0;
                moveToY = -128;
                seedle.animations.play('back');
            }
            else if (arrowTwo.angle == -90){
                moveToX = 128;
                moveToY = 0; 
                seedle.animations.play('right');
            }
            arrowTwo.visible = false; 
        }
        else if (arrowTurn.visible) {
            if (arrowTurn.scale.x == 1 && arrowTurn.scale.y == 1){ // check the scales
                moveToX = 64; //move one space on X and Y
                moveToY = 64;
                seedle.animations.play('right');
            }
            else if (arrowTurn.scale.x == 1 && arrowTurn.scale.y == -1){
                moveToX = 64;
                moveToY = -64;
                seedle.animations.play('right');
            }
            else if (arrowTurn.scale.x == -1 && arrowTurn.scale.y == -1){
                moveToX = -64;
                moveToY = -64;
                seedle.animations.play('left');
            }
            else if (arrowTurn.scale.x == -1 && arrowTurn.scale.y == 1){
                moveToX = -64;
                moveToY = 64;
                seedle.animations.play('left');
            }
            arrowTurn.visible = false;
        }
        
        changeOccupied(Math.round((seedle.world.x - 32)/64), Math.round((seedle.world.y - 32)/64)); //change the occupied of the current space BEFORE we move
        changeOccupied(Math.round((seedle.world.x + moveToX - 32)/64), Math.round((seedle.world.y + moveToY - 32)/64)); //change the occupied of the space we're headed to BEFORE we move
        seedleTween = game.add.tween(seedle).to( { x: Math.round(seedle.world.x + moveToX), y: Math.round(seedle.world.y + moveToY)}, 750, "Linear", true); //tween the player using MoveToX and Y
        arrowLayer.x += moveToX; //move the arrowLayer to follow the player
        arrowLayer.y += moveToY;       
        seedleTween.onComplete.add(enemyCheck); //when the player finishes moving, check to see if any enemies are nearby
    }
}

//checks to see if any enemies are next to the player
function enemyCheck(){
<<<<<<< HEAD
    seedle.animations.play('dance');
=======
>>>>>>> origin/gh-pages
    var sCount = 0; //number of enemies next to the player
    for (var i = 0; i < enemies.length; i++){ //go through the array of enemies
        distX = Math.round(enemies[i].world.x - seedle.world.x); //calculate the distance between an enemy and the player
        distY = Math.round(enemies[i].world.y - seedle.world.y);
        //if the enemy is in the next space
        if ((Math.abs(distX) <= 64 && Math.abs(distY) == 0) || (Math.abs(distX) == 0 && Math.abs(distY) <= 64)){
            enemies[i].inputEnabled = true; //enable input on that enemy
            enemies[i].input.useHandCursor = true; 
            enemies[i].events.onInputDown.add(attackEnemy, {hitEnemy : enemies[i]}); //if the player clicks on that enemy, send that enemy into attackEnemy and call it
            sCount++; //increment if we found an enemy
        }
    }
    if (sCount == 0){ //if no enemies next to the player
        yourTurn = false; //end player's turn
        reachedStairs(); //check to see if player reached the stairs
    }
}

//player clicked to attack an enemy
function attackEnemy(){
    this.hitEnemy.health -= 10; //decrement health
    this.hitEnemy.statText.setText(this.hitEnemy.name + ": " + this.hitEnemy.health); //update text of the enemy
    if (this.hitEnemy.health <= 0){ //if the enemy's health is less than 0        
        changeOccupied(Math.round((this.hitEnemy.world.x-32)/64), Math.round((this.hitEnemy.world.y-32)/64)); //change the occupied of the enemy's space
        var index = enemies.indexOf(this.hitEnemy); //get the index of that enemy in the enemy array
        enemies.splice(index, 1); //remove from the array
        this.hitEnemy.destroy(); //kill the enemy
        seedle.health += 20; //add health to the player
        seedle.statText.setText(seedle.name + ": " + seedle.health); //update text
    }
    yourTurn = false; //end the player's turn
    seedleTween = game.add.tween(seedle).to( { x: seedle.world.x, y: seedle.world.y}, 1, "Linear", true); //empty tween
    seedleTween.onComplete.add(enemyTurn, {sp : 0}); //call enemy turn with sp = 0 (sp is the index of the enemies array)
}

//enemies wil try to move closer to the player depending on how far away they are
function enemyTurn(){
    if (enemies.length > 0){ // go through each enemy
        enemy = enemies[this.sp]; //grab that particular enemy
        enemies[this.sp].inputEnabled = false; //disable input if it isn't already
        distX = Math.round(enemy.world.x - seedle.world.x); //calulate distance from enemy to player
        distY = Math.round(enemy.world.y - seedle.world.y);
        var r = Math.round((enemy.world.x - 32)/64); //calculate the grid coordinates
        var c = Math.round((enemy.world.y - 32)/64);
        currentSpace = (c+1) * rows - (rows - r); //current space will match the ID of the space the enemy is on
        
        if (enemy.health < 15){
            enemy.health += enemy.regen;
            enemy.statText.setText(enemy.name + ": " + enemy.health);
            console.log("regen");
        }
        
        //check to see if the enemy is next to the player
        if ((Math.abs(distX) <= 64 && Math.abs(distY) == 0) || (Math.abs(distX) == 0 && Math.abs(distY) <= 64)){
            seedle.health -= 10 * enemy.damageMultiplier; // attack the player and decrement health
            seedle.statText.setText(seedle.name + ": " + seedle.health);

            enemyTween = game.add.tween(enemy).to( { x: enemy.world.x, y: enemy.world.y}, 750, "Linear", true); //empty tween
            if (enemy.name == "Boomer"){
                changeOccupied(Math.round((enemy.world.x-32)/64), Math.round((enemy.world.y-32)/64)); //change the occupied of the enemy's space
                var index = enemies.indexOf(enemy); //get the index of that enemy in the enemy array
                enemies.splice(index, 1); //remove from the array
                enemy.destroy(); //kill the enemy
            }
        }
        
        else if(Math.abs(distX) >= 256 && enemy.movement == 3){
            //if enemy is to the right of the player and the next three spaces are unoccupied
            if (distX >= 256 && !(spaces[currentSpace-1].occupied) && !(spaces[currentSpace-2].occupied) && !(spaces[currentSpace-3].occupied)){ //3 left
                enemyTween = game.add.tween(enemy).to( { x: Math.round(enemy.world.x - 192), y: enemy.world.y }, 750, "Linear", true); // move 3 spaces to the left
                changeOccupied(r, c); //change occupied of the space the enemy was on
                changeOccupied(r - 3, c); //change occupied of the space the enemy is going to
                enemy.animations.play('left');
            }
            //if enemy is to the right of the player and the next two spaces are unoccupied
            else if (distX <= -256 && !(spaces[currentSpace+1].occupied) && !(spaces[currentSpace+2].occupied) && !(spaces[currentSpace+3].occupied)){ //3 Right
                enemyTween = game.add.tween(enemy).to( { x: Math.round(enemy.world.x + 192), y: enemy.world.y }, 750, "Linear", true);
                changeOccupied(r, c);
                changeOccupied(r + 3, c);
                enemy.animations.play('right');
            }
            //emptyTween
            else
                enemyTween = game.add.tween(enemy).to( { x: enemy.world.x, y: enemy.world.y}, 750, "Linear", true);
<<<<<<< HEAD
        }
        //if enemy is more than 2 spaces away on the Y axis
        else if(Math.abs(distY) >= 256  && enemy.movement == 3){
            if (distY >= 256 && !(spaces[currentSpace-10].occupied) && !(spaces[currentSpace-20].occupied) && !(spaces[currentSpace-30].occupied)){ //3 Up
                enemyTween = game.add.tween(enemy).to( { x: enemy.world.x, y: Math.round(enemy.world.y - 192)}, 750, "Linear", true);
                changeOccupied(r, c);
                changeOccupied(r, c - 3);
                enemy.animations.play('back');
            }
            else if (distY <= -256 && !(spaces[currentSpace+10].occupied) && !(spaces[currentSpace+20].occupied) && !(spaces[currentSpace+30].occupied)){ //2 Down
                enemyTween = game.add.tween(enemy).to( { x: enemy.world.x, y: Math.round(enemy.world.y + 192)}, 750, "Linear", true);
                changeOccupied(r, c);
                changeOccupied(r, c + 3);
                enemy.animations.play('forward');
            }
            else //empty tween
                enemyTween = game.add.tween(enemy).to( { x: enemy.world.x, y: enemy.world.y}, 750, "Linear", true);
        }
=======
        }
        //if enemy is more than 2 spaces away on the Y axis
        else if(Math.abs(distY) >= 256  && enemy.movement == 3){
            if (distY >= 256 && !(spaces[currentSpace-10].occupied) && !(spaces[currentSpace-20].occupied) && !(spaces[currentSpace-30].occupied)){ //3 Up
                enemyTween = game.add.tween(enemy).to( { x: enemy.world.x, y: Math.round(enemy.world.y - 192)}, 750, "Linear", true);
                changeOccupied(r, c);
                changeOccupied(r, c - 3);
                enemy.animations.play('back');
            }
            else if (distY <= -256 && !(spaces[currentSpace+10].occupied) && !(spaces[currentSpace+20].occupied) && !(spaces[currentSpace+30].occupied)){ //2 Down
                enemyTween = game.add.tween(enemy).to( { x: enemy.world.x, y: Math.round(enemy.world.y + 192)}, 750, "Linear", true);
                changeOccupied(r, c);
                changeOccupied(r, c + 3);
                enemy.animations.play('forward');
            }
            else //empty tween
                enemyTween = game.add.tween(enemy).to( { x: enemy.world.x, y: enemy.world.y}, 750, "Linear", true);
        }
>>>>>>> origin/gh-pages
        
        //if enemy is more than 2 spaces away on the X axis
        else if(Math.abs(distX) >= 192 && enemy.movement >= 2){
            //if enemy is to the right of the player and the next two spaces are unoccupied
            if (distX >= 192 && !(spaces[currentSpace-1].occupied) && !(spaces[currentSpace-2].occupied)){ //2 Left
                enemyTween = game.add.tween(enemy).to( { x: Math.round(enemy.world.x - 128), y: enemy.world.y }, 750, "Linear", true); // move 2 spaces to the left
                changeOccupied(r, c); //change occupied of the space the enemy was on
                changeOccupied(r - 2, c); //change occupied of the space the enemy is going to
                enemy.animations.play('left');
            }
            //if enemy is to the right of the player and the next two spaces are unoccupied
            else if (distX <= -192 && !(spaces[currentSpace+1].occupied) && !(spaces[currentSpace+2].occupied)){ //2 Right
                enemyTween = game.add.tween(enemy).to( { x: Math.round(enemy.world.x + 128), y: enemy.world.y }, 750, "Linear", true);
                changeOccupied(r, c);
                changeOccupied(r + 2, c);
                enemy.animations.play('right');
            }
            //emptyTween
            else
                enemyTween = game.add.tween(enemy).to( { x: enemy.world.x, y: enemy.world.y}, 750, "Linear", true);
        }
        //if enemy is more than 2 spaces away on the Y axis
        else if(Math.abs(distY) >= 192 && enemy.movement >= 2){
            if (distY >= 192 && !(spaces[currentSpace-10].occupied) && !(spaces[currentSpace-20].occupied)){ //2 Up
                enemyTween = game.add.tween(enemy).to( { x: enemy.world.x, y: Math.round(enemy.world.y - 128)}, 750, "Linear", true);
                changeOccupied(r, c);
                changeOccupied(r, c - 2);
                enemy.animations.play('back');
            }
            else if (distY <= -192 && !(spaces[currentSpace+10].occupied) && !(spaces[currentSpace+10].occupied)){ //2 Down
                enemyTween = game.add.tween(enemy).to( { x: enemy.world.x, y: Math.round(enemy.world.y + 128)}, 750, "Linear", true);
                changeOccupied(r, c);
                changeOccupied(r, c + 2);
                enemy.animations.play('forward');
            }
            else //empty tween
                enemyTween = game.add.tween(enemy).to( { x: enemy.world.x, y: enemy.world.y}, 750, "Linear", true);
        }
        
        //if enemy is 1 space away on the X axis
        else if(Math.abs(distX) >= 128 && enemy.movement >= 1){
            if (distX >= 128 && !(spaces[currentSpace-1].occupied)){ //1 left
                enemyTween = game.add.tween(enemy).to( { x: Math.round(enemy.world.x - 64), y: enemy.world.y }, 750, "Linear", true);
                changeOccupied(r, c);
                changeOccupied(r - 1, c);
                enemy.animations.play('left');
            }
            else if (distX <= -128 && !(spaces[currentSpace+1].occupied)){//1 right
                enemyTween = game.add.tween(enemy).to( { x: Math.round(enemy.world.x + 64), y: enemy.world.y }, 750, "Linear", true);
                changeOccupied(r, c);
                changeOccupied(r + 1, c);
                enemy.animations.play('right');
            }
            else
                enemyTween = game.add.tween(enemy).to( { x: enemy.world.x, y: enemy.world.y}, 750, "Linear", true);
        }
        //if enemy is 1 space away on the Y axis
        else if(Math.abs(distY) >= 128 && enemy.movement >= 1){
            if (distY >= 128 && !(spaces[currentSpace-10].occupied)){//1 up
                enemyTween = game.add.tween(enemy).to( { x: enemy.world.x, y: Math.round(enemy.world.y - 64)}, 750, "Linear", true);
                changeOccupied(r, c);
                changeOccupied(r, c - 1);
                enemy.animations.play('back');
            }
            else if (distY <= -128 && !(spaces[currentSpace+10].occupied)){//1 down
                enemyTween = game.add.tween(enemy).to( { x: enemy.world.x, y: Math.round(enemy.world.y + 64)}, 750, "Linear", true);
                changeOccupied(r, c);
                changeOccupied(r, c + 1);
                enemy.animations.play('forward');
            }
            else
                enemyTween = game.add.tween(enemy).to( { x: enemy.world.x, y: enemy.world.y}, 750, "Linear", true);
        }
        //if enemy is 1 space away on the X and Y axis
        else if(Math.abs(distX) >= 64 && Math.abs(distY) >= 64  && enemy.movement >= 2){
            if (distX >= 64 && !(spaces[currentSpace-1].occupied)){ //1 left
                enemyTween = game.add.tween(enemy).to( { x: Math.round(enemy.world.x - 64), y: enemy.world.y}, 750, "Linear", true);
                changeOccupied(r, c);
                changeOccupied(r - 1, c);
                enemy.animations.play('left');
            }
            else if (distX <= -64 && !(spaces[currentSpace+1].occupied)){ //1 right
                enemyTween = game.add.tween(enemy).to( { x: Math.round(enemy.world.x + 64), y: enemy.world.y}, 750, "Linear", true);
                changeOccupied(r, c);
                changeOccupied(r + 1, c);
                enemy.animations.play('right');
            }
            else if (distY >= 64 && !(spaces[currentSpace-10].occupied)){ //1 up
                enemyTween = game.add.tween(enemy).to( { x: enemy.world.x, y: Math.round(enemy.world.y - 64)}, 750, "Linear", true);
                changeOccupied(r, c);
                changeOccupied(r, c - 1);
                enemy.animations.play('back');
            }
            else if (distY <= -64 && !(spaces[currentSpace+10].occupied)){ //1 down
                enemyTween = game.add.tween(enemy).to( { x: enemy.world.x, y: Math.round(enemy.world.y + 64)}, 750, "Linear", true);
                changeOccupied(r, c);
                changeOccupied(r, c + 1);
                enemy.animations.play('forward');
            }
            else
                enemyTween = game.add.tween(enemy).to( { x: enemy.world.x, y: enemy.world.y}, 750, "Linear", true);
        }

        if (this.sp < enemies.length - 1) //if sp isn't the end yet, increment and call again so we can move the next enemy
            enemyTween.onComplete.add(enemyTurn, {sp : this.sp+1});
        else{
            enemyTween.onComplete.add(playersTurn); //player can't move until last enemy is done
            this.sp = 0; //reset sp
        }
    }
    else
        playersTurn(); //if no enemies exist, it's the player's turn again
}

function playersTurn(){
    yourTurn = true; //player's turn
    checkAtStart = true;
}

function checkOverlap(spriteA, spriteB) { //checks for overlap between sprites

    var boundsA = spriteA.getBounds();
    var boundsB = spriteB.getBounds();

    return Phaser.Rectangle.intersects(boundsA, boundsB);

}