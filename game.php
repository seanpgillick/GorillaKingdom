<?php
session_start();
require 'connect.php';
$username_session = $_SESSION['username'];
$query = "SELECT * FROM `player` WHERE username='$username_session'";
$result = mysqli_query($connection, $query);

if(empty($_SESSION['bets'])){

    $bets_session = $_SESSION['bet_reward'] = 0; 
}

else{
$bets_session = "UPDATE player SET balance='$bets+balance';

}
 echo "<form action='' method='POST'>
   <progress id ='exp_bar' value='".$_SESSION['bet']++."' max='100'></progress>
   <input class='btn' type='submit'  value='Increase bet' /> 
 </form>";

 echo $_SESSION['Val_Points']; /* Show current variable */
$Update_SQL = "UPDATE player SET Points='$bets_session' WHERE username='$username_session'";

?>