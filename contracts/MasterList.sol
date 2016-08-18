contract MasterList {

	// mapping (address => uint) receiverStorage; // {0xiwurowiquer:1, 0x9173246342: 5, 0x192837432874: 10}
	// address[] receiverIndex;

  struct Receiver {
  	address receiverAddress;
  	uint availStorage;
  	// uint availScore;
  }

  address public owner; //0x019823r0918j231029830982173 -- address of owner
  Receiver[] public receivers;

	modifier restricted() {
    if (msg.sender == owner) _
	}

	//constructor
	function MasterList() {
		owner = msg.sender;
	}

	function addReceiver(uint availStorage) {
		for(var i = 0; i < receivers.length; i++) {
			receivers[receivers.length++] = Receiver(msg.sender, availStorage);
		}
	}

	//called by sender to find receiver with given filesize
	//returns receiverAddress
	function findReceiver(uint filesize) constant returns (address) {
		for(var i = 0; i < receivers.length; i++){
			if(filesize < receivers[i].availStorage) {
				//decrease available Storage of receiver
				receivers[i].availStorage -= filesize;
				//send receiver somewhere
				return receivers[i].receiverAddress;
			}
		}
	}		

	//receiver call need to be put inside findReceiver???????
	function assign(uint filesize, string hashIPFS) {
		address receiver = this.call(bytes4(sha3("findReceiver(uint256)")), filesize);
		msg.sender.call(bytes4(sha3("addToRecList(address)")), receiver);
		receiver.call(bytes4(sha3("addToHashList(string)")), hashIPFS);
	}

	//when receiver is destroyed, reassigns all files to other receivers
	function reassign(string[] hashAddresses, uint256[] filesizes){
		for (var i = 0; i < hashAddresses.length; i++) { 
			address receiver = this.call(bytes4(sha3("findReceiver(uint256)")), filesizes[i]);
			receiver.call(bytes4(sha3("addToHashList(string)")), hashIPFS)
		}
	}

	function removeReceiver() {		
		for (var i = 0; i < receivers.length; i++){
			if(receivers[i].receiverAddress === msg.sender) delete receivers[i];
		}
	}

	function addFilesize(uint filesize) {
		for (var i = 0; i < receivers.length; i++){
			if (receivers[i].receiverAddress === msg.sender) receivers[i].availStorage += filesize;
		}
	}

	//to self-destruct SC and return money to owner
	function destroy() restricted {
		suicide(owner);
	}

}
