// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const Ethereum = nodeRequire('../../libs/ethereum/ethereum.js');
const web3 = Ethereum._init();

var hash;
var recInstance;
var masterInstance;
var senderInstance;
var i = 0;

$("button.addMasterList").click(function() {
		Ethereum.deploy('MasterList')
			.then(function(instance){
				masterInstance = instance;
				// console.log('SIMPLE', simple[simple.length-1]);
			});
	});

$("button.addReceiver").click(function() {
	var value = $('#receiver').val();
	Ethereum.deploy('Receiver', [value, masterInstance.address])
		.then(function(instance){
			recInstance = instance;
			// console.log('SIMPLE', simple[simple.length-1]);
		});
});

$("button.addSender").click(function() {
	hash = $('#hash').val();
	var filesize = $('#sender').val();
	var hash1 = hash.substring(0,23);
	var hash2 = hash.substring(23,46);
	console.log(hash1);
	console.log(hash2);
	Ethereum.deploy('Sender', [hash1, hash2, filesize, masterInstance.address])
		.then(function(instance){
			senderInstance = instance;
		});
});

$("button.test").click(function() {
		// var value = parseInt($("input.text").val(), 10);
		masterInstance.testReceiver().then(function(res){
			console.log('Receiver Address',res[0]);
			console.log('Available Storage',res[1].toNumber());
		});
		// addToLog("InitContract.set("+value+")");
	});

	$("button.test2").click(function() {
		// var value = parseInt($("input.text").val(), 10);
		console.log('CLICKED');
		var value = $('#sender').val();
		var hash1 = hash.substring(0,23);
		var hash2 = hash.substring(23-10,46-10);
		senderInstance.testSender(hash1, hash2).then(function(res){
			console.log('Original value: ', hash);
			console.log('Current value: ', web3.toAscii(res[0])+web3.toAscii(res[1]));
			
		});
		// addToLog("InitContract.set("+value+")");
	});

	$("button.test3").click(function() {
		// var value = parseInt($("input.text").val(), 10);
		recInstance.retrieveStorage().then(function(res){
			for (var i = 0; i < res.length; i+=2) {
				console.log('RECEIVED FILE HASH'+((i/2)+1)+': '+ web3.toAscii(res[i])+web3.toAscii(res[i+1]));
			}
		});
		// addToLog("InitContract.set("+value+")");
	});