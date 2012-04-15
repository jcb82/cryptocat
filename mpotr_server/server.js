var buffer;

/**
* Expects payload to be JSON formatted in either of the two ways:
* {"*": data} - send data to everyone
* {"nick1": data1, "nick2": data2, ...} - send data1 to nick1, data2 to nick2, etc 
*/
function send(payload) {
	$.ajax({
		type: "POST", 
		url: "index.php",
		data: {"payload": payload},
		async: false, 
		dataType: "text",
		success: function(data) {
			buffer = data;
		}
	});
	return buffer;
}

/**
* Recieve from the server. Blocking. Reply will be parsed JSON.
* Count should be set to the number of messages you expect
* to recieve. If set to leq 0 (or is NaN) then the server will not
* return anything until it thinks all messages that should be returned 
* have arrived.
* Returned data: data.nick = payload
*/
function recieve(count) {
	buffer = null;

	do {
		$.ajax({
			type: "POST", 
			url: "index.php",
			data: {"recieve": count},
			dataType: "json",
			async: false, 
			success: function(data) {
				buffer = data;
			}
		});
	} while(buffer == null);

	return buffer;
}

/**
* Helper, see above. 
*/
//function recieve() {
//	return recieve(1);
//}

/**
* Register nick at server (get a session). Needs
* to be called before anything else. 
*/
function register(nick) {
	buffer = null;
	$.ajax({
		type: "POST", 
		url: "index.php",
		data: {"register": nick},
		async: false, 
		dataType: "text",
		success: function(data) {
			buffer = data;
		}
	});
	return buffer;
}

/**
* Get the number of participants.
*/
function getCount() {
	buffer = null;
	$.ajax({
		type: "POST", 
		url: "index.php",
		data: {"count": 0},
		async: false, 
		dataType: "text",
		success: function(data) {
			buffer = data;
		}
	});
	return buffer;
}

/**
* Unregister the currently registered nick.
*/
function unregister() {
	buffer = null;
	$.ajax({
		type: "POST", 
		url: "index.php",
		data: {"unregister": 0},
		async: false, 
		dataType: "text",
		success: function(data) {
			buffer = data;
		}
	});
	return buffer;
}

/** 
* Delete all message buffers on the server for 
* all participants (testing only). 
*/
function nuke() {
	buffer = null;
	$.ajax({
		type: "POST", 
		url: "index.php",
		data: {"nuke": 0},
		async: false, 
		dataType: "text",
		success: function(data) {
			buffer = data;
		}
	});
	return buffer;
}
