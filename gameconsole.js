// game console  ( from javascriptgamer.com )
//
// requires: prototype.js (tested with v. 1.4.0)

// Console ///////////////////////////////////////

Console = Class.create();
Console.prototype = {

    initialize : function (startScreen, tickSpeed) {
        this.tickSpeed = tickSpeed || 1; // milliseconds between ticks
        this.screen = startScreen;
    },
    
    start : function() {
        _con = this;
        window.setInterval(function () { _con.tick() }, this.tickSpeed);
        document.onkeydown = function (e) { _con.keyDown(e) };
        document.onkeyup = function (e) { _con.keyUp(e) };
        document.onkeypress = function (e) { _con.keyPress(e) };
        this.screen.show();
    },

    keyDown : function(e) {
        this.screen.keyDown(e);
    },
    
    keyUp : function(e) {
        this.screen.keyUp(e);
    },

    keyPress : function(e) {
        this.screen.keyPress(e);
    },
    
    tick : function () {
        this.screen.tick();
    },
    
    swap : function (toScreen) {
        this.screen = toScreen;
        this.screen.show();
    },

    scheduleSwap : function (next, speed) {
        _old = this.screen;
        _con = this;
        window.setTimeout(
            function () {
                if (_con.screen == _old) {
                    _old.hide();
                    _con.swap(next);
                }
            }, speed || SWAP_SPEED);
    }

}

// Screen ////////////////////////////////////////

Screen = Class.create();
Screen.prototype = {
    initialize : function (id) {
        this.id = id;
    },
    
    keyDown : function (e) {
    },
    
    keyUp : function(e) {
    },
    
    keyPress : function(e) {
    },
    
    tick : function () {
    },

    show : function () {
        $(this.id).style.display = 'block';
    },
    
    hide : function () {
        $(this.id).style.display = 'none';
    }
}


// Sprite ////////////////////////////////////////

var Sprite = Class.create();
Sprite.prototype = {
    initialize : function(id) {
        this.id = id;
        this.node = $(id);
    },
    
    getX : function() {
        return this.node.offsetLeft;
    },
    
    setX : function(x) {
        this.node.setStyle({'left' : x + 'px'});
    },


    getY : function () {
        return this.node.offsetTop;
    },
    
    setY : function(y) {
        this.node.setStyle({'top' : y + 'px'});
    },    
    

    moveBy: function(dx, dy) {
        this.setX(this.getX()+dx);
        this.setY(this.getY()+dy);
    },

    getW : function() {
        return this.node.offsetWidth;
    },
    
    getH : function() {
        return this.node.offsetHeight;
    },
};


