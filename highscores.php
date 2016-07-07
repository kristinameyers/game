<?php 
//////////////////////////////////////////////////
//
// a primitive high score manager in php
// (c) copyright 2007 javascriptgamer.com
//
// usage:
//
//    maintains a textfile containing $FILE_SIZE scores
//    returns an XML file with the top $LIST_SIZE scores
//    requires write access to $SCORE_FILE
//
//    Sanitizes incoming and outgoing data, but 
//    does NOT attempt to prevent cheating. 
//
//////////////////////////////////////////////////

$SCORE_FILE = "highscores.txt";
$FILE_SIZE = 100; // keep up to this many scores
$LIST_SIZE = 10;  // how many scores to return 

$OLD = "old";
$NEW = "new"; // marker for the new score in the list


/// read /////////////////////////////////////////
$scores = array();
$fp = fopen($SCORE_FILE, "r+"); 
$fp || die("couldn't open $SCORE_FILE");

// get an exclusive lock for writing
flock($fp, LOCK_EX);

// read the entire high score list
// each line contains: ip, level, score, name
// separated by spaces (name can contain extra spaces)
while (!feof($fp)) {
  list($ip, $level, $score, $name) = split(" ", rtrim(fgets($fp)), 4);
  // skip blank lines (including last newline)
  if (! $ip) continue;
  $level = 0 + $level;
  $score = 0 + $score;
  $scores[] = array($score, $level, $name, $ip, $OLD);
}

/// post /////////////////////////////////////////

// if new score is being posted
if ($_SERVER['REQUEST_METHOD'] == "POST") {

  // convert the level and score to numbers:
  $level = 0 + $_POST['level'];
  $score = 0 + $_POST['score'];
  
  // remove excess whitespace from the name 
  // (especially newlines, which would corrupt our file!)
  $name = implode(" ", preg_split("/\s+/", $_POST['name']));
  
  // now append the new score to the list
  $scores[] = array($score, $level, $name, $_SERVER['REMOTE_ADDR'], $NEW);


  // sort the merged list
  function with_high_scores_first($a, $b) {
    return -gmp_cmp($a[0], $b[0]);
  }
  usort($scores, "with_high_scores_first");
 
  // and write the list back to the file:
  fseek($fp, 0);	
  $count = 0;
  foreach ($scores as $index => $data) {
    if (++$count > $GLOBALS['FILE_SIZE']) break;
    list($score, $level, $name, $ip, $age) = $data;
    fwrite($fp, "$ip $level $score $name\n");
  }
}

// unlock and close the file
flock($fp, LOCK_UN);
fclose($fp);


// show //////////////////////////////////////////

// now output the score list as xml

header("content-type: text/xml"); 

echo("<scores>\n"):

$count = 0; 
foreach ($scores as $index => $data) {
  if (++$count > $GLOBALS['LIST_SIZE']) break;
  list($score, $level, $name, $ip, $age) = $data;
  // escape HTML characters in names:
  // (we don't have to escape the other fields because
  // we ensured they were numbers before writing)
  $name = htmlentities($name, ENT_QUOTES);
  echo("<score place='$count' score='$score' level='$level' name='$name' age='$age'/>\n");
}
echo("</scores>\n");
?>
