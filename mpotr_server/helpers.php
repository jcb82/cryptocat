<?php
	function getParticipantCount() {
		global $dataDir;
		$count = 0;
		if ($handle = opendir($dataDir)) {
			while (false !== ($entry = readdir($handle))) {
				if ($entry != "." && $entry != "..") 
					$count++;
			}
			closedir($handle);
		}
		return $count;
	}

	function getAllParticipants() {
		global $dataDir;
		$participants = array();
		if ($handle = opendir($dataDir)) {
			while (false !== ($entry = readdir($handle))) {
				if ($entry != "." && $entry != "..") 
					$participants[] = $entry;
			}
			closedir($handle);
		}
		return $participants;
	}

	function addDataForNick($from, $data, $nick) {
		global $dataDir;
		file_put_contents($dataDir.'/'.$nick, '"'.$from.'": "'.$data.'",\n', FILE_APPEND | LOCK_EX);
	}

	function getAllData($nick) {
		global $dataDir;

		$data = file_get_contents($dataDir.'/'.$nick);
		$data = substr($data, 0, strrpos($data, ','));
		$data = $data.'}';

		createFile($nick);		

		return $data;
	}

	function getMessageCount($nick) {
		global $dataDir;	
		return count(file($dataDir.'/'.$nick)) - 1;

	}

	function createFile($nick) {
		global $dataDir;
		// create file for nick and truncate
	
		file_put_contents($dataDir.'/'.$nick, "{\n");
	}
	
	function deleteFile($nick) {
		global $dataDir;
		unlink($dataDir.'/'.$nick);
	}
	
	function deleteAllFiles() {
		$participants = getAllParticipants();
		foreach($participants as $key => $value) {
			deleteFile($participants[$key]);
		}
	}
