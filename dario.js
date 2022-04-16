
let jumpSound;
let gameChar_x;
let gameChar_y;
let floorPos_y;
let scrollPos;
let gameChar_world_x;

let isLeft;
let isRight;
let isFalling;
let isPlummeting;

let trees_x;
let collectable;
let clouds;
let mountains;
let canyon;

let game_score;
let flagpole;
let lives

let enemy_art
let enemies;

function preload()
{
    soundFormats('mp3','wav');
    
    
    jumpSound = loadSound('assets/jump.wav');
    jumpSound.setVolume(0.1);
    
    fallSound = loadSound('assets/mixkit-player-losing-or-failing-2042.wav');
    fallSound.setVolume(0.1);
    
    coinSound = loadSound('assets/coin_found.wav');
    coinSound.setVolume(0.1);
    
    flagSound = loadSound('assets/lvl_complete.wav');
    flagSound.setVolume(0.15);
    
    enemySound = loadSound('assets/jg-032316-sfx-video-game-fail-sound-2.mp3');
    enemySound.setVolume(0.8);
    
}


function setup()
{
	createCanvas(1024, 576);
    floorPos_y = height * 3/4;
	
    lives = 3
    
    flagpole = {isReached: false, x_pos: 3000};

    startGame()

    

}

function draw()
{
	background(100, 155, 255); // fill the sky blue

	noStroke();
	fill(0,155,0);
	rect(0, floorPos_y, width, height/4); // draw some green ground
    
    push();
    translate(scrollPos, 0);
    
	// Draw clouds.
    drawClouds()
	// Draw mountains.
    drawMountains()
	// Draw trees.
    drawTrees()

    
	////////////////////////////////////////////////// Draw canyons.
    for(let i = 0; i < canyon.length; i++)
        {
            drawCanyon(canyon[i])
            checkCanyon(canyon[i])
        }
        
	//////////////////////////////////////////////////// Draw collectable
    for(let i = 0; i < collectable.length; i++) 
        {   
            if(collectable[i].isFound == false)
            {    
                drawCollectable(collectable[i])
                checkCollectable(collectable[i])
            }
        }
    
    if(flagpole.isReached == false)
    {
        checkFlagpole()
    }
    
    renderFlagpole()
    checkPlayerDie()
    
    
    
    //////////////////////////////////////////////////// Drawing enemies
    
    for(let i = 0; i < enemies.length; i++)
    {
        enemies[i].draw();
        let isContact = enemies[i].checkContact(gameChar_world_x, gameChar_y);
        
        if(isContact)
        {
            if(lives > 0)
            {
                startGame();
                break
            }
        }
    }

    
    
    
    
    pop();
    
	//////////////////////////////////////////////////// Draw game character.
	
	drawGameChar();
    textSize(14);
    textAlign(LEFT);
    fill(255);
    noStroke()
    text("score: " + game_score, 25, 25);
    
    for(let i = 0; i < lives; i++)
    {
        text("lives:" + lives, 25, 45);
    }
        

    if(lives < 1)
        {
            textSize(32)
            textAlign(CENTER)
            return(text("Game Over. Press space to continue", width/2, height/2))
            
            
        }

    if(flagpole.isReached)
        {
            textSize(32)
            textAlign(CENTER)
            return(text("Level complete. Press space to continue.", width/2, height/2))
            
        }
    
    textSize(14);
    textAlign(LEFT);

    
	//////////////////////////////////////////////////// Logic to make the game character move or the background scroll.
	if(isLeft)
	{
		if(gameChar_x > width * 0.3)
		{
			gameChar_x -= 4;
		}
		else
		{
			scrollPos += 4;
		}
	}

	if(isRight)
	{
		if(gameChar_x < width * 0.7)
		{
			gameChar_x  += 4;
		}
		else
		{
			scrollPos -= 4; 
		}
	}

	//////////////////////////////////////////////////// Logic to make the game character rise and fall.
    

    if (gameChar_y != floorPos_y)    // char falls down
        {
            gameChar_y += 2 ;
            isFalling = true;
        }
    else
        {
            isFalling  = false;
        }

    if (isPlummeting)
        {
            gameChar_y += 6
        }
    
    
   
	// Update real position of gameChar for collision detection.
	gameChar_world_x = gameChar_x - scrollPos;
}




function keyPressed(){
    if (keyCode == 37)          //Left arrow
            {
                isLeft = true;
            }
    else if (keyCode == 39)     //Right arrow
            {
                isRight = true;
            }
    else if (keyCode == 32 && gameChar_y == floorPos_y)
            {
                gameChar_y -= 100; 
                isFalling = true;
                jumpSound.play();
            }


}

function keyReleased()
{
     if (keyCode == 37)          //Left arrow move right
        {
            isLeft = false;
        }
    else if (keyCode == 39)     //Right arrow move right
        {
            isRight = false;
        }
    else if (keyCode == 32)     // space jump
        {
            isFalling = false;
        }
    

}


function drawGameChar()
{
	
    if(isLeft && isFalling)
	{
		
        stroke(0);
        fill(0)
        rect(gameChar_x - 10, gameChar_y - 18, 10, 10);      //L leg

        fill(255,0,0);
        rect(gameChar_x - 7.5, gameChar_y - 48, 15, 40);   //Torso 

        fill(200, 100, 100);
        ellipse(gameChar_x, gameChar_y - 58, 35);           //Head

        fill(0)
        rect(gameChar_x + 4, gameChar_y - 15, 10, 10);           // R leg
        rect(gameChar_x - 12, gameChar_y - 48, 7, 11);      //L arm

	}
	else if(isRight && isFalling)
	{
        stroke(0);
        fill(0)
        rect(gameChar_x - 10, gameChar_y - 15, 10, 10);      //L leg

        fill(255,0,0);
        rect(gameChar_x - 7.5, gameChar_y - 48, 15, 40);   //Torso 

        fill(200, 100, 100);
        ellipse(gameChar_x, gameChar_y - 58, 35);           //Head

        fill(0)
        rect(gameChar_x + 4, gameChar_y - 18, 10, 10);           // R leg
        rect(gameChar_x + 6, gameChar_y - 48, 7, 11);       //R arm

	}
    
	else if(isLeft)
	{
        stroke(0);
        fill(0)
        rect(gameChar_x, gameChar_y - 8, 10, 10);       // R leg

        fill(255,0,0);
        rect(gameChar_x - 7.5, gameChar_y - 45, 15, 40);   //Torso 

        fill(200, 100, 100);
        ellipse(gameChar_x, gameChar_y - 55, 35);           //Head

        fill(0)
        rect(gameChar_x - 14, gameChar_y - 8, 10, 10);      //L leg
        rect(gameChar_x - 12, gameChar_y - 30, 7, 11);      //L arm

	}
    
	else if(isRight)
	{
        stroke(0);   
        fill(0)
        rect(gameChar_x - 10, gameChar_y - 8, 10, 10);      //L leg

        fill(255,0,0);
        rect(gameChar_x - 7.5, gameChar_y - 45, 15, 40);   //Torso 

        fill(200, 100, 100);
        ellipse(gameChar_x, gameChar_y - 55, 35);           //Head

        fill(0)
        rect(gameChar_x + 4, gameChar_y - 8, 10, 10);           // R leg
        rect(gameChar_x + 6, gameChar_y - 30, 7, 11);       //R arm
	}
    
	else if(isFalling || isPlummeting)
	{
        stroke(0);
        fill(255,0,0);
        rect(gameChar_x - 12.5, gameChar_y - 48, 25, 40);

        fill(200, 100, 100);
        ellipse(gameChar_x, gameChar_y - 58, 35);

        fill(0)
        rect(gameChar_x - 15, gameChar_y - 15, 10, 10);   //L leg
        rect(gameChar_x + 5, gameChar_y - 18, 10, 10);   // R leg
        rect(gameChar_x - 15, gameChar_y - 47, 7, 11);  //L arm
        rect(gameChar_x + 9, gameChar_y - 47, 7, 11);   //R arm

	}
    
	else
	{
        stroke(0)
        fill(255,0,0);
        rect(gameChar_x - 12.5, gameChar_y - 45, 25, 40);

        fill(200, 100, 100);
        ellipse(gameChar_x, gameChar_y - 55, 35);

        fill(0)
        rect(gameChar_x - 15, gameChar_y - 8, 10, 10);   //L leg

        fill(0)
        rect(gameChar_x + 5, gameChar_y - 8, 10, 10);   // R leg

        fill(0)
        rect(gameChar_x - 12, gameChar_y - 30, 7, 11);  //L arm

        fill(0)
        rect(gameChar_x + 6, gameChar_y - 30, 7, 11);   //R arm

	}
}


function drawClouds()
{
     for(let i = 0; i < clouds.length; i++)
        {
            noStroke()
            fill(255)
            rect(clouds[i].x_pos - 40, clouds[i].y_pos - 2.5, 60, 40);
            ellipse(clouds[i].x_pos, clouds[i].y_pos, 80, 60);              // midddle cloud
            ellipse(clouds[i].x_pos - 40, clouds[i].y_pos + 10, 60, 55);    // left cloud
            ellipse(clouds[i].x_pos + 20, clouds[i].y_pos + 10, 70, 55);    // right cloud

            clouds[i].x_pos += 0.2;
       }
}
   

function drawMountains()
{
     for(let i = 0; i < mountain.length; i++)
        {
            fill(125);
            triangle(mountain[i].x_pos - 25,mountain[i].y_pos, mountain[i].x_pos + 75 ,mountain[i].y_pos, mountain[i].x_pos + 25,mountain[i].y_pos - 102);      // smaller back mountain
            fill(150);
            triangle(mountain[i].x_pos, mountain[i].y_pos, mountain[i].x_pos + 140, mountain[i].y_pos, mountain[i].x_pos + 70, mountain[i].y_pos - 132);        // front mountain  
        }
    
}


function drawTrees()
{
     for (let i=0; i < trees_x.length; i++)
        {
            noStroke() 
            fill(128, 57, 32);
            rect(trees_x[i], floorPos_y - 35, 20, 35);      // trunk of the tree     

            fill(128, 169, 32);
            triangle(trees_x[i] -55, treePos_y, trees_x[i] +70, treePos_y, trees_x[i] + 10, treePos_y - 70);                //branches
            triangle(trees_x[i] -30, treePos_y -50, trees_x[i] +45, treePos_y -50, trees_x[i] +10, treePos_y -110);
            triangle(trees_x[i] -15, treePos_y -90, trees_x[i] +30, treePos_y -90, trees_x[i] +10, treePos_y -140);
        }
    
}


function drawCanyon(t_canyon)
{
        noStroke(0)
        fill(100, 155, 255);              //extra sky above canyon
        rect(t_canyon.x_pos ,floorPos_y, t_canyon.width ,floorPos_y + t_canyon.y_pos);
        fill(139,69,19);
        rect(t_canyon.x_pos, t_canyon.y_pos, t_canyon.width, height - t_canyon.y_pos);
}


function checkCanyon(t_canyon)
{
        if (t_canyon.x_pos + 12 < gameChar_world_x && gameChar_world_x < t_canyon.x_pos + t_canyon.width - 12 && gameChar_y >= floorPos_y)
            {
                isPlummeting = true;
            };
}


function drawCollectable(t_collectable)
{
        stroke(1);
        fill(255,215,0)
        ellipse(t_collectable.x_pos, t_collectable.y_pos, 10, t_collectable.size);           //UNALTERED ANCHOR POINT
        fill(0)
        textSize(14);
        textAlign(CENTER)
        text('$', t_collectable.x_pos , t_collectable.y_pos + 4);

}


function checkCollectable(t_collectable)
{
        if(dist(gameChar_world_x, gameChar_y, t_collectable.x_pos, t_collectable.y_pos) < 50)
                {
                    t_collectable.isFound = true
                    coinSound.play()
                    game_score += 1
                };
}

function renderFlagpole()
{
    push()
    strokeWeight(5);
    stroke(180);
    line(flagpole.x_pos, floorPos_y, flagpole.x_pos, floorPos_y - 250);
    
    fill(200,0,0);
    
    if(flagpole.isReached)
    {
        rect(flagpole.x_pos, floorPos_y - 250, 50, 50)
    }
    else
    {
        rect(flagpole.x_pos, floorPos_y - 50, 50, 50)
    }
    
    
    pop();
}

function checkFlagpole()
{
    let d = abs(gameChar_world_x - flagpole.x_pos);
    if(d < 15)
    {
        flagpole.isReached = true
        flagSound.play();
    }
}

function checkPlayerDie()
{
    if(gameChar_y > height + 100)
        {
            lives -= 1
            fallSound.play()
            
            
            if(lives > 0)
                {
                    startGame()
                }
            
        }
}

function startGame()
{
   gameChar_x = width/2;
	gameChar_y = floorPos_y;
    treePos_y = floorPos_y - 35;
    
    trees_x = [100, 200, 500, 1100, 1450, 1930, 2300, 2650, 3100, 3300, 3900, 4200, 4400, 4660, 5090];
    
    collectable = 
    [
        {x_pos: 200, y_pos: floorPos_y - 140, size: 30, isFound: false},
        {x_pos: 500, y_pos: floorPos_y - 140, size: 30, isFound: false},
        {x_pos: 1050, y_pos: floorPos_y - 140, size: 30, isFound: false},  
        {x_pos: 1350, y_pos: floorPos_y - 140, size: 30, isFound: false}, 
        {x_pos: 1450, y_pos: floorPos_y - 140, size: 30, isFound: false},  
        {x_pos: 1950, y_pos: floorPos_y - 140, size: 30, isFound: false},  
        {x_pos: 2350, y_pos: floorPos_y - 140, size: 30, isFound: false},
        {x_pos: 2450, y_pos: floorPos_y - 140, size: 30, isFound: false},
        {x_pos: 2550, y_pos: floorPos_y - 140, size: 30, isFound: false},
        {x_pos: 2870, y_pos: floorPos_y - 140, size: 30, isFound: false},
        {x_pos: 3300, y_pos: floorPos_y - 140, size: 30, isFound: false},
        {x_pos: 3650, y_pos: floorPos_y - 140, size: 30, isFound: false},
        {x_pos: 3870, y_pos: floorPos_y - 140, size: 30, isFound: false},
        {x_pos: 4250, y_pos: floorPos_y - 140, size: 30, isFound: false},
        {x_pos: 4350, y_pos: floorPos_y - 140, size: 30, isFound: false},
        {x_pos: 4550, y_pos: floorPos_y - 140, size: 30, isFound: false}
    ];
    
    clouds = 
    [
        {x_pos: 250, y_pos: 120},        
        {x_pos: 550, y_pos: 150},        
        {x_pos: 855, y_pos: 100},
        {x_pos: 1600, y_pos: 80},
        {x_pos: 2150, y_pos: 100},
        {x_pos: 2650, y_pos: 120},
        {x_pos: 2870, y_pos: 90},
        {x_pos: 3450, y_pos: 110},
        {x_pos: 3650, y_pos: 90},
        {x_pos: 3930, y_pos: 80},
        {x_pos: 4350, y_pos: 120},
        {x_pos: 4590, y_pos: 130},
        {x_pos: 4930, y_pos: 100},
    ];
    
    mountain = 
    [
        {x_pos: 400, y_pos: floorPos_y},
        {x_pos: 1005, y_pos: floorPos_y},
        {x_pos: 110, y_pos: floorPos_y},
        {x_pos: 1710, y_pos: floorPos_y},
        {x_pos: 2310, y_pos: floorPos_y},
        {x_pos: 2950, y_pos: floorPos_y},
        {x_pos: 3230, y_pos: floorPos_y},
        {x_pos: 3630, y_pos: floorPos_y},
        {x_pos: 4130, y_pos: floorPos_y},
        {x_pos: 4630, y_pos: floorPos_y},
        {x_pos: 5130, y_pos: floorPos_y}
    ];

    canyon =
    [
        {x_pos: 580, y_pos: floorPos_y + 100, width: 100},
        {x_pos: 850, y_pos: floorPos_y + 100, width: 100},
        {x_pos: 1500, y_pos: floorPos_y + 100, width: 100},
        {x_pos: 2150, y_pos: floorPos_y + 100, width: 100},
        {x_pos: 2800, y_pos: floorPos_y + 100, width: 100},
        {x_pos: 3400, y_pos: floorPos_y + 100, width: 100},
        {x_pos: 3970, y_pos: floorPos_y + 100, width: 100},
        {x_pos: 4800, y_pos: floorPos_y + 100, width: 100} 
    ];
    
    flagpole = {isReached: false, x_pos: 5000};

	scrollPos = 0;

	gameChar_world_x = gameChar_x - scrollPos;


	isLeft = false;
	isRight = false;
	isFalling = false;
	isPlummeting = false;
    
    game_score = 0 
        
    enemies = [];
    enemies.push(new Enemy(680, floorPos_y - 10, 170));
    enemies.push(new Enemy(950, floorPos_y - 10, 550));
    enemies.push(new Enemy(2250, floorPos_y - 10, 550));
    enemies.push(new Enemy(2900, floorPos_y - 10, 500));
    enemies.push(new Enemy(4170, floorPos_y - 10, 630));
    
    
}
    //////////////////////////////////////////////////// function constructing an enemy
function Enemy(x, y, range)
{
    this.x = x
    this.y = y
    this.range = range
    
    this.currentX = x;
    this.inc = 1;
    
    this.update = function()
    {
        this.currentX += this.inc;
        
        if(this.currentX >= this.x + this.range)
        {
            this.inc = -1
        }
        
        else if(this.currentX < this.x)
        {
            this.inc = 1;
        }
    }
    
    this.draw = function()
    {
        this.update();

        fill(255, 0, 0)
        ellipse(this.currentX, this.y, 20)
    }
    
    this.checkContact = function(gc_x, gc_y)
    {
        let d = dist(gc_x, gc_y, this.currentX, this.y);
        if(d < 20)
        {
            enemySound.play()
            lives -= 1
            return true    
        }
        
        return false
    }
}


