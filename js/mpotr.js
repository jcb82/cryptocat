function recvMessage() {
  this.message;
  this.signature;
  this.sender;
  this.verified;
};

recvMessage.prototype = {
  initialize: function(nick){
    this.sender = getParticipant(nick);
  },

  verifyMessage: function() {
    this.verified = ecdsaVerify(sender.publicKey, this.signature, this.message);
  }
};

function Participant() {
  this.nick;
  this.publicKey;
  this.ephPublicKey;
  this.privateKey;
  this.ephPrivateKey;

};

Participant.prototype = {
  initialize: function(nick, public_key) {
    if (public_key) {
      this.public_key = public_key;
    } else {
      this.privateKey = gen(24, 0, 0); //modified to make Fortuna error message go away, need to re-sign
      this.publicKey = dhgen(this.privateKey, "gen");
    }
  },

  deriveSessionID: function(nicks, randomXs){
    preimage = JSON.stringify(randomXs.sort());
    preimage += JSON.stringify(nicks.sort());
    var res = Crypto.util.hexToBytes(Whirlpool(preimage));
    // Take 16 Bytes
    res = res.slice(0, 16);
    res = Crypto.util.bytesToBase64(res);
    return res;
  },

  sendProtocolMessage: function(id) {
    switch(id) {
      case 'randomX':
        return gen(16,1,0);

      case 'akePub':
        return this.pubKey;
    }

  },

  processProtocolMessages: function(id, msgs) {
    switch(id) {
      case 'randomX':
        this.nicks = [];
        this.msgs = [];
        this.randomXs = [];
        for (var x in msgs) {
            this.nicks.push(x);
            this.randomXs.push(msgs[x]);
        }
        this.sessionID = this.deriveSessionID(this.nicks, this.randomXs);
        console.log("Generated sessionID: " + this.sessionID);
        return this.sessionID;
    }

  }
};


var TestServer = {
  participants: [],
  state: {},
  nicks: [],

  send: function(id, msg, nick) {
    if (!this.state[id]) {
      this.state[id] = [];
    }
    this.state[id].push([nick, msg]);
  },

  getMessages: function(id) {
    return this.state[id];
  }

};

var Alice = new Participant();
Alice.initialize('alice');
var Bob = new Participant();
Bob.initialize('bob');
var Charlie = new Participant();
Charlie.initialize('charlie');
var participants = [Alice, Bob, Charlie];


var messages = ['randomX'];
for (mid in messages) {
  for (i in participants) {
    var id = messages[mid];
    var participant = participants[i];
    res = participant.sendProtocolMessage(id);
    TestServer.send(id, res, participant);
  }

  var current_messages = TestServer.getMessages(id);
  console.log("-----");
  console.log("Current "+ id +" messages");
  console.log("-----");
  console.log(current_messages);

  for (i in participants) {
    var id = messages[mid];
    var participant = participants[i];
    res = participant.processProtocolMessages(id);
    console.log(res);
  }

}

TestServer.send(id, res, participant);

/****************
    //denAKE section - needs to be replaced. Currently static DH-AKE but not deniable
    postToServer('akePub',publicKey);
    akePubs = gatherFromServer('akePub');

    akeReplyBlock = {};
	for (i=0; i < (nicks.length); i++) {
        //skip
        if (nicks[i] === nick){
            continue;
        }
        akeReplyBlock[nicks[i]] = dhgen(privateKey, akePubs[i]);
	}
    postToServer('akeReplyBlock', akeReplyBlock);
    akeReplies = gatherFromServer('akeReplyBlock');

    //remainder of key exchange

    debugOutput += "Derived session ID: " + sessionID + "<br>";

    //postToServer(

**************/

