<script>
var jQuery = $.noConflict();
jQuery( window ).load(function() {
    jQuery('.overlay').show();
	jQuery('#model_allfields').slideDown();
    });
function divclose() {
	jQuery('.overlay').slideUp(500);
	jQuery('#model_allfields').slideUp(500);
}
</script>

<link rel="stylesheet" href="<?php echo ru; ?>game/brickslayer.css"/>
<div class="mid_contant regst game">
	<h1 class="regst">iftGift Game</h1>
	<div id="console">
  <!-- main screen of the game -->
  <div id="game" class="screen">
	<div id="paddle" class="sprite"></div>
    <div id="ball" class="sprite"></div>
    <div id="bricks"></div>

<!--	<div style="  background: none repeat scroll 0 0 #ccc;    border-top: 1px solid #999;    height: 20px;    margin: 0;    position: relative;    top: 282px;
    width: 100%;">-->
    <div id="lake"></div>
    <div class="wall" id="leftWall"></div>
    <div class="wall" id="rightWall"></div>
    <div class="wall" id="ceiling"></div>
    <div class="wall" id="floor"></div>
	
	<div id="scorecard"><span class="i">i</span><span class="f">f</span><span class="t">t</span>Points:</div><div id="score">0</div>
	<div id="levelarea">level:</div>
    <div id="level">1</div>
	<div id="liveremain">Lives Remaining:</div>
	<div class="spare" id="spare1"></div>
    <div class="spare" id="spare2"></div>
    <div class="spare" id="spare3"></div>
    
<!--</div>-->
	
	
	
  </div>
 <div class="overlay" style="display:none"></div>
	
	<div class="modal modal_d" id="model_allfields" style="display:none">
		<a style="cursor:pointer"  onclick="divclose();"><img src="<?php echo ru_resource; ?>images/close_icon.png" alt="Closed Icon" /></a>
			<h4> IftGift Slayer</h4>
			<p class="jest_tray">The objective of the game is to break rows of multi-colored gift boxes by bouncing the gift box between the s'Jester's tray and the gift boxes above. The game is won when all of the multicolored gift boxes are broken.</p>
			
			<p>Press <span>ENTER to START</span> the game.</p>
			<p>Use the <span>ARROW KEYS</span> to launch ball to move the <span>LEFT</span> and <span>RIGHT.</span></p>
			<p>Use the <span>UP ARROW</span> to <span>LAUNCH</span> the golden gift box upward.</p>
			<p>Press <span>P to PAUSE.</span></p>
			<a class="orange orange_b" onClick="divclose();">Back to the Game</a>
	</div> 
  <!-- title screen -->
 <div id="title" class="overlay screen">
   <!-- <img src="sprites/brickslayerlogo.png" alt="brickslayer" />
    <p>use <strong>arrow keys</strong> to move paddle</p>
    <p>press <strong>up arrow</strong> to launch ball</p>
    <p>press <strong>p</strong> to pause game</p>
    <p class="pressenter">press <strong>enter</strong> to start</p>-->
  </div>

  <!-- pause screen -->
  <div id="pause" class="overlay screen">
    <img src="sprites/paused.png" alt="paused"/>
    <p>press <strong>p</strong> again to unpause</p>
  </div>

  <!-- game over screen -->
  <div id="gameover" class="overlay screen">
    <img src="sprites/gameover.png" alt="game over"/>
  </div>
  
  <!-- level clear screen -->
  <div id="clear" class="overlay screen">
    <img src="sprites/levelclear.png" alt="level clear!"/>
  </div>
  <!-- high score screen -->
  <div id="scores" class="overlay screen">
   <!-- <img src="sprites/highscores.png" alt="high scores" />-->
    <table id="scoretable" width="100%">
    </table>
    <script type="text/javascript">
    /* <![CDATA[ */
		for (i=1; i<=5; i++) {
			$('scoretable').innerHTML += (
			   '<tr id="high_row_' + i +  '" class="old">' +
			   '<td class="name" id="high_name_' + i + '"</td>'+
			   '<td class="score" id="high_score_' + i + '"</td>'+
			   '</tr>');
		}
    /* ]]> */
    </script>
    <p class="pressenter">Press <span>ENTER</span> to start</p>
  </div>
  
  <!-- enter your name screen -->
  <div id="congrats" class="overlay screen">
  <!-- <img src="sprites/congrats.png" alt="congratulations!" />
  	<p>You made the High Score List! Enter Your Name!</p>
    <label>name
      <input type="text" id="player_name" name="player_name" />
      <input type="hidden" id="player_score" name="player_score" />
      <input type="hidden" id="player_level" name="player_level" />
    </label>
    <button onclick="post_score()">go</button>-->
  </div>


</div>

</div>
<script type="text/javascript" src="<?php echo ru; ?>game/prototype-1.5.1.js"></script>
<script type="text/javascript" src="<?php echo ru; ?>game/gameconsole.js"></script>
<script type="text/javascript" src="<?php echo ru; ?>game/brickslayer.js"></script>
<script type="text/javascript" src="<?php echo ru; ?>game/soundmanager2.js"></script>
<script type="text/javascript">
soundManager.url = '<?php echo ru; ?>game/soundmanager2.swf'; // path to movie
soundManager.onload = function () { loadSounds() }; 
soundManager.debugMode = false;
</script>
<script language="javascript">
  initGame(); 
</script>