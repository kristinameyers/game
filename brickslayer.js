/*
 *  brickslayer
 *
 *      a breakout style game in javascript
 *
 *      code and graphics by michal j wallace 
 *
 *      http://JavascriptGamer.com/
 *
 */
var paddle;
var gameconsole;
var game;
var bricks = [];
var ball;
var serveSpeed = -1;
var score = 0;
var ballsLeft;
var SPARES_START = 3;


function initGame() {
    paddle = new Paddle('paddle');
    gameconsole = new Console(TITLE_SCREEN);
    gameconsole.start();
    game = new Sprite(); game.id="game"; game.node=$("game");
    create_bricks();
    ball = new Ball("ball");
    game_reset();
}


var SOUND_PATH = '../sounds/';
function loadSounds() {
    soundManager.createSound('serve', SOUND_PATH + 'whish.mp3');
    soundManager.createSound('hit', SOUND_PATH + 'plopp.mp3');
    soundManager.createSound('break', SOUND_PATH + 'glass2.mp3');
    soundManager.createSound('bounce', SOUND_PATH + 'boing.mp3');
    soundManager.createSound('fall', SOUND_PATH + 'deepsplosh.mp3');
}



// Paddle ////////////////////////////////////////

var Paddle = Class.create();
Paddle.prototype = Object.extend(new Sprite(), {

    initialize: function(id) {
        this.id = id;
        this.node = $(id);
        this.speed = 5;
        this.friction = 0.5;
        this.velocity = 0;
    },
    
    center: function () {
        this.setX(game.getW()/2 - this.getW()/2);
        this.velocity = 0;
    },
   
    tick: function() {
        if (this.getX() + this.velocity <= 0)
            this.setX(0);
        else if (this.getX() + this.velocity + this.getW() >= game.getW()) 
            this.setX(game.getW() - this.getW()); 
        else 
            this.moveBy(this.velocity, 0); 
    }
});




var Brick = Class.create();
Brick.count = 0;
Brick.prototype = Object.extend(new Sprite(), {
            
    initialize : function (x, y, start_shade) {
        this.id = 'brick_' + Brick.count++;
        this.start_shade = start_shade;
        
        this.node = document.createElement('div');
        this.node.setAttribute("id", this.id);
        this.reset();
        this.setX(x);
        this.setY(y);
        $('bricks').appendChild(this.node);
    },
    
    reset : function() {
        this.solid = true;
        this.node.style.display = 'block';
        this.setShade(this.start_shade);
    },

    setShade : function(shade) {
        this.shade = shade;
        // setAttribute('class') doesn't work in IE!!
    // this.node.className = "sprite shade" + shade;
		if(this.id != 'brick_0' & this.id != 'brick_7' & this.id != 'brick_14'){
				this.node.className = "sprite shade" + shade;	
		}else 
			{
				this.node.className = "sprite shade7"; 
			}
    },
    onHit : function() {
        if (this.shade-1 <= 0) {
            this.node.style['display'] = 'none';
            this.solid = false;
            soundManager.play('break');
	   Brick.count -= 1;
            if (Brick.count <= 0) {
	       console.log('level clear');
	       level_init(current_level++);
                gameconsole.swap(LEVEL_CLEAR_SCREEN);
            }
        } else {
            this.setShade(this.shade-1);
            soundManager.play('hit');
        }
    },    
	/*test code by rana*/
	     onHit2 : function() {
        if (this.shade-4 <= 0) {
           this.node.style['display'] = 'none';
			//alert(" 20 bonus point :) ");
            this.solid = false;
            soundManager.play('break');
	   Brick.count -= 1;
            if (Brick.count <= 0) {
	       console.log('level clear');
	       level_init(current_level++);
                gameconsole.swap(LEVEL_CLEAR_SCREEN);
            }
        } else {
            this.setShade(this.shade-1);
            soundManager.play('hit');
        }
    }  
	/*test code by rana*/
});
function swap_scores(req) {
    show_scores(req);
    ENTER_NAME_SCREEN.hide();
    gameconsole.swap(SCORES_SCREEN);
}


DEBUG = false;
function create_bricks() {    
    if (DEBUG) {
        bricks.push(new Brick(240, 100, 1));
        bricks.push(new Brick(280, 100, 1));
    } else {
        for (x=0; x<4; x++) {
            // the order is important here, because we do
            // collision testing in the order of the array.
            // generally, we want to test the bottom bricks 
            // for collisions first.
            for (y=3; y>=0; y--) {
                bricks.push(new Brick(x * 70 + 8, y * 70 + 8, 4-y));
            }
        }
    }
}

function score_set(value) {
    score = value;
     $("score").innerHTML = '' + score;
}
function score_inc() {
    score_set(score+5);
}
function score_inc2() {
    score_set(score+20);
}
function loseLife() {
    soundManager.play('fall');
    if (ballsLeft == 0) {
        // game over
        gameconsole.swap(GAME_OVER_SCREEN);
        //posted_scores = false;
    } else {
        if (el = $("spare" + ballsLeft)) {
	    el.style.display = 'none';
	}
        ballsLeft--;
        ball.stickToPaddle();
    }
}

var GAME_SCREEN = Object.extend(new Screen('game'), {

    keyDown : function (e) {
        switch (e.keyCode) {
        case Event.KEY_LEFT:
            paddle.velocity = -paddle.speed;
            break;
        case Event.KEY_RIGHT:
            paddle.velocity = +paddle.speed;
            break;
        case Event.KEY_UP:
            if (ball.on_paddle) {
                ball.serve(paddle.velocity+0.25, serveSpeed);
            }
            break;
        case KEY_P:
            gameconsole.swap(PAUSE_SCREEN);
            break;
        default:
            console.log('key ' + e.keyCode + ' pressed');
            break;
        }
    },

    keyUp : function(e) {
        switch (e.keyCode) {
        case Event.KEY_LEFT:
            if (paddle.velocity < 0) paddle.velocity = 0;
            break;
        case Event.KEY_RIGHT:
            if (paddle.velocity > 0) paddle.velocity = 0;
            break;
        }
    },
    tick : function() {
        paddle.tick();
        // this could be an array of sprites
        ball.tick();
    }

});

var TITLE_SCREEN = Object.extend(new Screen('title'), {
    show : function () {
	Screen.prototype.show.call(this);
	gameconsole.scheduleSwap(SCORES_SCREEN);
    },
    
    keyUp : function(e) {
	if (e.keyCode == Event.KEY_RETURN) {
	    this.hide();
	    gameconsole.swap(GAME_SCREEN);
	}
    }
});

var KEY_P = "P".charCodeAt(0)

var PAUSE_SCREEN = Object.extend(new Screen('pause'), {
    keyDown : function(e) {
        if (e.keyCode == KEY_P) {
            this.hide();
            gameconsole.swap(GAME_SCREEN);
        }
    }
});

// milliseconds to show level clear / game over screen
var CLEARED_SPEED = 2000; 
var LEVEL_CLEAR_SCREEN = Object.extend(new Screen('clear'), {
    show : function () {
        Screen.prototype.show.call(this);
        window.setTimeout(function () { level_init(current_level+1); }, CLEARED_SPEED);
        gameconsole.scheduleSwap(GAME_SCREEN, CLEARED_SPEED);
    }
})

var ENTER_NAME_SCREEN = Object.extend(new Screen('congrats'), {
    show : function () {
        Screen.prototype.show.call(this);
        $('player_name').focus();
    }
});

var SWAP_SPEED = 3500; // milliseconds to show game over/title/high scores

var GAME_OVER_SCREEN = Object.extend(new Screen('gameover'), {
    show : function () {        
        Screen.prototype.show.call(this);
	gameconsole.scheduleSwap(TITLE_SCREEN);
        //$('player_score').value = score;
        //$('player_level').value = current_level;
        //if (score > low_high_score) {
        //gameconsole.scheduleSwap(ENTER_NAME_SCREEN);
    //} else {
        //gameconsole.scheduleSwap(SCORES_SCREEN);
    //}
        window.setTimeout(function () { game_reset(); }, SWAP_SPEED);
    }
});

var SCORES_SCREEN = Object.extend(new Screen('scores'), {
    show : function () {
        Screen.prototype.show.call(this);
        gameconsole.scheduleSwap(TITLE_SCREEN);
    },
    
    keyUp : TITLE_SCREEN.keyUp
});


// #### high scores ##############################

var SCORE_SCRIPT = 'highscores.php';


function get_scores() {
    new Ajax.Request(SCORE_SCRIPT, {
        method: 'get',
        onComplete: show_scores,
        onFailure: show_error
    });
}

var posted_scores     = false;
function post_score() {
    if (posted_scores) return; // prevent double post
    new Ajax.Request(SCORE_SCRIPT, {
        method: 'post',
        parameters: $H({
                        'name':  $F('player_name'),
                        'level': $F('player_level'),
                        'score': $F('player_score')
                    }).toQueryString(),
        onComplete: swap_scores,
        onFailure: show_error
    });
    posted_scores = true;
}


var low_high_score = 100;

function show_scores(req) {
    $('result').value = req.responseText;
    var scores = $A(req.responseXML.getElementsByTagName('score'));
    scores.each(function(node) {
        place = node.getAttribute('place');
        Element.update($('high_score_' + place), node.getAttribute('score'));
        Element.update($('high_name_' + place), node.getAttribute('name'));
        $('high_row_' + place).className = node.getAttribute('age'); // 'old' or 'new'
    });
    low_high_score = parseInt(scores[scores.length -1].getAttribute('score'));
}


function show_error(req){
    $('result').value = 'error';
}




var Ball = Class.create();
Ball.prototype = Object.extend(new Sprite(), {
    initialize : function(id) {
        this.id = id;
        this.node = $(this.id);
        this.dx = 0;
        this.dy = 0;
        this.on_paddle = true;
    },
    
    serve : function (dx, dy) {
        soundManager.play('serve');
        this.on_paddle = false;
        this.dy = dy;
        this.moveBy(0,-2);
        this.dx = dx;
    },

    stickToPaddle : function (){
        // set x first, in case the ball is hidden in the lake
        // (otherwise, it would flash briefly)
        this.setX(paddle.getX()+(paddle.getW()/1.3) - (this.getW()/2));
        //this.setY(paddle.getY()-this.getH());
		this.setY(paddle.getY()+(paddle.getW()/2.9) - (this.getW()/2));
        this.on_paddle = true; 
    },


    tick : function() {
        if (this.on_paddle) {
            this.stickToPaddle();
        } else {
            // we have to do reaction separately from detection, 
            // because we might smash two bricks at once, and if 
            // we multiplied by -1 for both, the two bounces would 
            // cancel each other out!
            if (bounce = this.smashBricks()) {
                this.bounce(bounce);
            }
            this.checkPaddle();
            this.checkWalls();
            if (this.hittingFloor()) {
                loseLife();
            } else {
                this.moveBy(this.dx, this.dy);
            }
        }
    }    
});



// @TODO: move these to collision.js
// #### Ball Physics #############################

var BOUNCE = -1;
var NO_BOUNCE = 1;


Ball.prototype.ticksToHLine = function (x1, x2, hline) {
    // there's a special case when dx = 0 (moving straight up)
    if (this.dx == 0) { 
        x = this.getX();
    } else {
        // in other cases, we need to use algebra to find
        // intersection of the line and the ball's path.
        //
        // start with the line of the ball's trajectory:
        //        y = (this.dy / this.dx) * (x-this.getX()) + this.getY()
        //
        // the two lines intersect where y == hline, so:
        //        hline = (this.dy / this.dx) * (x-this.getX()) + this.getY()
        // now solve for x:
        x = (hline - this.getY()) * (this.dx / this.dy) + this.getX();
    }

    // but we're dealing only with a line SEGMENT, so
    // we need to see if the point falls between the endpoints:
    if ((x < x1) || (x > x2)) return null;

    // if we're still here, we know the ball's path intersects
    // the line, but it only counts if the hit is in FRONT of the
    // ball, so we need to count the ticks until impact. 
    ticks = (hline - this.getY()) / this.dy;
    //alert(ticks);
    
    // negative ticks would put the line BEHIND the ball,
    // so we need to discard those results
    return (ticks >= 0) ? ticks : null;
}

Ball.prototype.ticksToVLine = function (vline, y1, y2){
    // the line for the ball's trajectory, where x = vline
    // again, there's a special case when moving straight 
    // up and down to avoid division by zero
    if (this.dx == 0) {
        // the other function can handle the corner just fine
        // and since there's no other possible 
        // way a ball moving straight up or down can
        // hit the side, we can just stop here.
        return null;
    } else {
        y = (this.dy / this.dx) * (vline-this.getX())  + this.getY()
        // the rest of the logic is similar to the horizontal check
        if ((y < y1) || (y > y2)) return null;
        ticks = (y - this.getY()) / this.dy;
        return (ticks>=0) ? ticks : null; 
    }
}

Ball.prototype.collide = function (rect) {
    
    ballLeft = this.getX();
    ballRight = ballLeft+this.getW();
    ballTop = this.getY();
    ballBottom = ballTop + this.getH();
    
    rectLeft = rect.getX();
    rectTop = rect.getY();
    rectRight = rectLeft+rect.getW();
    rectBottom = rectTop+rect.getH();    

    diameter = this.getW();
    radius = diameter /2;
    
    goingUp = this.dy < 0;
    goingLeft = this.dx <0;

    // the ball can not possibly hit both the top and bottom of the
    // rectangle at the same time. Further, if the ball is going down, it
    // can't possibly hit the bottom of the rectangle, and if it's going
    // up, it can't possibly hit the top. So we only have to check against
    // one horizontal line:
    
    yTicks = (goingUp) ? 
	this.ticksToHLine(rectLeft-diameter, rectRight+radius, rectBottom)
    // and note that when going down, the bottom of ball will hit first, 
    // so we need to subtract the ball's height
        :this.ticksToHLine(rectLeft-diameter, rectRight+radius,
			   rectTop-diameter);
    
    // the same principles apply for the left and right sides:
    xTicks = (goingLeft) ? 
	this.ticksToVLine(rectRight, rectTop-radius, rectBottom+radius)
        :this.ticksToVLine(rectLeft-diameter, rectTop-radius, 
			   rectBottom+radius);    

    //if (rect == paddle)
    //   $('debug').innerHTML = "(" + xTicks + ", " + yTicks + ")";
        
    hitX = (xTicks != null) && xTicks <= 1;
    hitY = (yTicks != null) && yTicks <= 1;
    
    // now. what if it would collide with BOTH?
    // in that case, it could hit both at the same time (direct hit on corner)
    // or it could hit one first, in which case we discard the other
    // (in real life, it could also glance off the corner, but our simplified
    // physics model ignores this possibility)
    
    if (! (hitX || hitY)) { return null };
    
    if (xTicks == yTicks) {
        // treat corners as hitting the top or bottom;
        hitX = false;
    } 
    return [(hitX ? BOUNCE : NO_BOUNCE),
            (hitY ? BOUNCE : NO_BOUNCE)];    
}

Ball.prototype.bounce = function (vector) {
    this.dx *= vector[0];
    this.dy *= vector[1];
}

// consolidate these! 

Ball.prototype.smashBricks = function () {
    var bounce = null; // impact vector        
    for (var i=0; i < bricks.length; i++) {
			if(0 == [i] % 7 )
				{
				  if (bricks[i].solid) {
							var vector = this.collide(bricks[i]);
							if (vector != null) {
								bricks[i].onHit2();
								score_inc2();
								return vector; // can only hit one thing at a time
							}
						}
				}
				else
				{
				 if (bricks[i].solid) {
							var vector = this.collide(bricks[i]);
							if (vector != null) {
								bricks[i].onHit();
								score_inc();
								return vector; // can only hit one thing at a time
							}
						}
					}
}
        
    return bounce;
}

Ball.prototype.checkWalls = function () {
    // walls:
    if ((this.getX() + this.dx <= 0) 
    || (this.getX() + this.dx + this.getW() >= game.getW())){ 
        this.dx *= -1; 
        soundManager.play('bounce');
    }
    // ceiling:    
    if (this.getY() + this.dy <= 0) { 
        this.dy *= -1; 
        soundManager.play('bounce');
    }
}

Ball.prototype.hittingFloor = function () {
    return this.getY() + this.dy + this.getH() >= game.getH();
}

Ball.prototype.checkPaddle = function () {
    vector = this.collide(paddle);
    if (vector) {
        soundManager.play('bounce');
        this.bounce(vector);
        this.dx += parseInt(paddle.velocity * paddle.friction);
    }
}

function level_init(level) {
    bricks.each(function (b) { b.reset() });
    Brick.count = bricks.length;
    current_level = level;
    paddle.center();
    ball.stickToPaddle();
    Element.update($('level'), current_level.toString());
}
function game_reset() {
    score_set(0);
    level_init(1);
    ballsLeft = SPARES_START;
    $('spare1', 'spare2', 'spare3').each(
	function (x){ x.style.display = 'block' });
}
