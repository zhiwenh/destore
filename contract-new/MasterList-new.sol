contract Receiver {

	MasterList masterInstance;
	bytes32[] hashArray;
	uint availStorage;

	function Receiver (uint availStorage, address masterAdd) {
		masterInstance = MasterList(masterAdd);
		masterInstance.addReceiver(availStorage);
	}

	function retrieveStorage() public constant returns (bytes32[]) {
		return hashArray;
	}
 
	function addToHashList(bytes23 hash1, bytes23 hash2) {
		hashArray[hashArray.length++] = hash1;
		hashArray[hashArray.length++] = hash2;
	}

}

contract MasterList {

  struct ReceiverList {
  	address receiverAddress;
  	uint availStorage;
  }

  struct ContractPairs {
  	address[] receiverAddresses;
  	address senderAccount;
  }

  address owner;
  address receiver;
  ReceiverList[] receivers;
  ContractPairs[] pairs;
  Receiver recInstance;

  function MasterList() {
  	owner = msg.sender;
  }

  function payReceivers() constant returns (address, address){
  	for(uint8 i = 0; i < pairs.length; i++){
			if(msg.sender == pairs[i].senderAccount) {
				return (pairs[i].receiverAddress1, pairs[i].receiverAddress2);
			}
		}
  }

	function addReceiver(uint availStorage) {
		receivers[receivers.length++] = ReceiverList(msg.sender, availStorage);
	}

	function testReceivers() constant returns (address, address) {
		return (pairs[pairs.length-1].receiverAddress1, pairs[pairs.length-1].receiverAddress1);
	}

	function findReceiver(uint filesize) constant returns (address) {
		for(uint8 i = 0; i < receivers.length; i++){
			if(filesize < receivers[i].availStorage) {
				receivers[i].availStorage -= filesize;
				return receivers[i].receiverAddress;
			}
		}
	}

	function assign(uint filesize, bytes23 hash1, bytes23 hash2) {
		receiver = findReceiver(filesize);
		receiver2 = findReceiver(filesize);
		pairs[pairs.length++] = ContractPairs(receiver1, receiver2, msg.sender);
		for(uint8 i = 0; i < 2; i++) {
			sendToReceiver(hash1, hash2, pairs[pairs.length-1].receiverAddress[i]);
		}
	}

	function sendToReceiver(bytes23 hash1, bytes23 hash2, address receiver) {
		recInstance = Receiver(receiver);
		recInstance.addToHashList(hash1, hash2);
	}

	function clearReceivers() {
		for(uint8 i = 0; i < receivers.length; i++){
			delete receivers[i];
		}
	}

}
