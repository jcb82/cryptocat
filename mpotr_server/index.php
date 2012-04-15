<?php
/**
Not for real use anywhere for any reason! Requires that
the data directory (set below) is fully writable by whatever
is executing this script.
 
TODO:
	- input validation
	- chat
*/
	$dataDir = "data"; // no trailing slash

	session_start();
	include 'helpers.php';

	// store any payload sent to nicks	
	if(isset($_POST['payload'])) {
		$payload = json_decode($_POST['payload'], true);

		// TODO: validate payload

		// send to all or specific nicks?
		if(isset($payload["*"])) {
			$data = $payload["*"];
			$participants = getAllParticipants();
			
			foreach($participants as $key=>$value) {
				if($value != $_SESSION['nick'])
					addDataForNick($_SESSION['nick'], $data, $value);
			}

		} else {
			foreach($payload as $key=>$value) {
				addDataForNick($_SESSION['nick'], $value, $key);
			}
		}
	}

	// revieve data sent by other nicks
	if(isset($_POST['recieve'])) {
		$nick = $_SESSION['nick'];
		$count = $_POST['recieve'];

		if(!is_numeric($count) || $count < 0) {
			$count = getParticipantCount() - 1;	
		}
	
		$messageCount = getMessageCount($_SESSION['nick']);
	
		//echo "waiting with count $count, messages now: $messageCount";
		
		while($messageCount < $count) {
			usleep(100000);
		}

		echo getAllData($_SESSION['nick']);
		// get number of messages for nick
		// reconstruct full nick
	}

	// registrer a nick (overwrites)
	if(isset($_POST['register'])) {
		// TODO: validate nick
		$_SESSION['nick'] = $_POST['register'];
		createFile($_SESSION['nick']);
		echo $_SESSION['nick'];
	}
	
	// full reset for currently registered nick
	if(isset($_POST['unregister'])) {
		deleteFile($_SESSION['nick']);
		echo "unregistered";
		session_unset();
	}

	// get the number of participants
	if(isset($_POST['count'])) {
		echo getParticipantCount();
	}

	// delete all files (will require all users to reregister)
	if(isset($_POST['nuke'])) {
		deleteAllFiles();
		echo "nuke";
	}
