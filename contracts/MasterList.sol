contract Sender {
	address owner;
	uint balance;
	bytes23[] hashArray;
  uint fileSize;
  /*MasterList masterInstance;*/

	function Sender(bytes23[] _hashArray, uint _fileSize, address masterAddress) {
		owner = msg.sender;
		balance = msg.value;
		/*masterInstance = MasterList(masterAddress);*/
		hashArray = _hashArray;
		fileSize = _fileSize;
		/*masterInstance.assign(fileSize, hash);*/
	}

	function addHash(bytes23 hash1, bytes23 hash2) public returns (bool) {
		if (hash1.length == 23 && hash2.length == 23) {
			hashArray.push(hash1);
			hashArray.push(hash2);
			return true;
		} else {
			return false;
		}
	}

	function getHashesLength() constant returns (uint hashArrayLength) {
		return (hashArray.length);
	}

	function getHashes() constant returns (bytes23[]) {
		return hashArray;
	}

	function checkBalance() constant returns (uint) {
		return balance;
	}

	function withdraw(uint withdrawAmount) public returns (uint) {
		if (balance >= withdrawAmount) {
			balance -= withdrawAmount;
			if (!msg.sender.send(withdrawAmount)) {
					balance += withdrawAmount;
			}
			return balance;
		}
	}

}

/*contract Receiver {

	MasterList masterInstance;
	bytes[] hashArray;
	uint availStorage;
	address owner;

	function Receiver (uint availStorage, address masterAdd) {
		masterInstance = MasterList(masterAdd);
		masterInstance.addReceiver(availStorage);
		owner = msg.sender;
	}

	function retrieveStorage() public constant returns (bytes[]) {
		return hashArray;
	}

	function addToHashList(bytes hash) {
		hashArray[hashArray.length++] = hash;
	}

}

contract MasterList {

  struct ReceiverList {
  	address receiverAddress;
  	uint availStorage;
  }

  address owner;
  address receiver;
  ReceiverList[] receivers;
  Receiver recInstance;

  function MasterList() {
  	owner = msg.sender;
  }

	function addReceiver(uint availStorage) {
			receivers[receivers.length++] = ReceiverList(msg.sender, availStorage);
	}

	function testReceiver() constant returns (address, uint) {
		return (receivers[0].receiverAddress, receivers[0].availStorage);
	}

	function findReceiver(uint filesize) constant returns (address) {
		for(uint i = 0; i < receivers.length; i++){
			if(filesize < receivers[i].availStorage) {
				receivers[i].availStorage -= filesize;
				return receivers[i].receiverAddress;
			}
		}
	}

	function assign(uint filesize, bytes23 hash1, bytes23 hash2) {
		receiver = findReceiver(filesize);
		recInstance = Receiver(receiver);
		recInstance.addToHashList(hash1, hash2);
	}

	function clearReceivers() {
		for(uint i = 0; i  < receivers.length; i++){
			delete receivers[i];
		}
	}

}*/
