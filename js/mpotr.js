
var nick = "alice";
var nicks = 0;
var debugOutput = '';
var sessionID = -1;
var privateKey = gen(24, 0, 0); //modified to make Fortuna error message go away, need to re-sign
var publicKey = dhgen(privateKey, "gen");

debugOutput += "My name: " + nick + "<br>";
debugOutput += "My public key: " + publicKey + "<br>";
debugOutput += "My private key: " + privateKey + "<br>";

var privateKeysSim = [privateKey, "126422332315953517539183","408842930541538281614909"]; 
var publicKeysSim = [publicKey, "9bNX03Iyz=EilzV5yxjSU43yYkv5DxZ=SeJXd4vCo7k5L9YoE6Jk32mYs3Dgu9o5pGFU2dLn1iMTwZ9cCxZ2utiOHgotw9i6k7aE=Emm8d8KPvPaLdaVSO7pRGSPO3T0czsVqrs=Srl8p9KLmMzAKSlMm7KMqIfVFT59GPPgE1VWGoZYiUXwD2Oy5fI2mXoI0wwl3ozKyodgQ2zAgJNbI_JqdXvdNi1=8cnm0_hDBzoby_W0Ya1QcLTMmbUD_GwMVpb8uimN93__EFxjjkEvAJ=3guY8n=sh=2sqbwFjum2Ng6xiaTSnQSNDUaEZh=nGbH7bCVX6D_7eJvuGni16GJ9Qb0lW50ryTn_6ypnktQxVAKQ5zEt2E1inJ3LSmhmwqlrhJiRjQNDu0iMY46RWtgt4IwSaT699l4zfWVZIeUkClLQi_8mG9IuiAGY7GA6M3rIsiJkvZdi5d4YqPgkIM1Q7t4VOwT99Osw6sVpTK3bQa8K0J488gp1RqOzW5t32M8A9hOy1uBO1bLM4w=Q1Aqj1l00pS6xdkSch7DVpxBiMPUr=Ri9w2f1JWcy_tVQclFbuD7Vfog6g7Shqw1RfPY57dxFtWKdD6GFINH6VUOwN8ZaETwr=TAfqpjaCqPvnfVx7FaVIuul6KwAr1k84Mn=OkSRZT5U5PtdHQRoNWaP", "694iMehGz7iS2OaNWL4NxQ764vk5zfpa15LkdJNIsMrFqdByebYWEpwPfYx2bOPrTULITdg1OlrbRUKjVPrzf4ndH6AL=sYCoOGjPJK8mVOm4XHMIgmZr2fe16JKbAZt=qNWFchR3ipLQNS6uWoAR8JB30JAnqDNlj0K7i88xn1H0CxoLOLmwQ8mULJl07cOrOjkUa08MuPL_PJ6PuF=VJcupS5LSBFBclQVO_keDe1nRkLArJa=7tLzSDPEHcvsFzFx8bVzP9hoyS1wiPro1UEGcxE49Vz3yXVf3X1PXdKdjCCEY90D6ekbxt2XpcdsafFf0PUUQrZVWEnfgCgIQMLfxQAVMtrtpGPd77CrNvul907C2pX1PGs=1qtETSvk1WrYLe9EeLZvCYR3BZxFeORpF79ntziC8_hxqmh7XM5s2Btm7yz7=Jouh41V5JKmQzg1q6wQve5THheOMSDigwaklLtIFuhAYubZFlWQ=LPLPpI_tbWzoyaAqsTgEdkIpt795kTh2M_4fn=H2buimuWlClP6WwcKQXqck1JptlGL3PKP65VpnsUg2UJcPvttf77=sd0ZYMESngpuk_b7SNa6KDX7L62IfUYlANYCVt9D35K8BJvBg=8mHMWglBv8DcCIm1ER_0UdYkRLZA16WCy8Kf9pEnjhXNf1pTM4Aqq"];

var debugToServer = "";
var randomX;

function postToServer(msgID, val){
    debugToServer += 'Sent ' + '<b>' + msgID + '</b>:  ' + JSON.stringify(val) + "<br>";
}


//This will need to block in the real implementation
//Currently static test values for all but Alice
function gatherFromServer(msgID){
    result = 0;
    if (msgID === 'nick'){
        result = [nick, 'bob','charlie'];
    }
    else if (msgID === 'randomX'){
        result = [randomX, 'azYxAD3qhcr06ASN','TACu43MBC20dAHuX'];
    }
    else if (msgID === 'akePub'){
        result = publicKeysSim;
    }
    else if (msgID === 'akeReplyBlock'){
        result = [{}, {}, {}];
	    for (i=0; i < (nicks.length); i++) {
            //skip		
            if (nicks[i] === nick){
                continue;
            }
            block = {};

	        for (j=0; j < (nicks.length); j++) {
                //skip		
                if (nicks[i] === nicks[j]){
                    continue;
                }
                block[nicks[j]] = dhgen(privateKeysSim[i], publicKeysSim[j]);
            }
            result[i] = block;
	    }
    }
    else{
        result = ['', '', ''];
    }

    debugToServer += 'Gathered ' + '<b>' + msgID + '</b>:  ' + JSON.stringify(result) + "<br>";
    return result;
}

//Hash sorted list of nicknames and everybody's random seed, convert to 128 bits
function deriveSessionID(nicks, randomXs){
    return Crypto.util.bytesToBase64(Crypto.util.hexToBytes(Whirlpool(JSON.stringify(nicks.sort()) + JSON.stringify(randomXs.sort())).substring(0,32)));
}

function setup(){

    postToServer('nick',nick);
    nicks = gatherFromServer('nick');

    randomX = gen(16,1,0)
    postToServer('randomX',randomX);
    randomXs = gatherFromServer('randomX');

    sessionID = deriveSessionID(nicks, randomXs);
    debugOutput += "Derived session ID: " + sessionID + "<br>";

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
    
}
setup();

debugOutput += '<br><br>' + debugToServer;

