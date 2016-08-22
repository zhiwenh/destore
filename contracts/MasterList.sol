contract Sender {
  uint _filesize;
  bytes23 _hash1;
  bytes23 _hash2;
  MasterList masterInstance;

	function Sender(bytes23 hash1, bytes23 hash2, uint filesize, address masterAdd) {
		masterInstance = MasterList(masterAdd);
		_hash1 = hash1;
		_hash2 = hash2;
		_filesize = filesize;
		masterInstance.assign(_filesize, _hash1, _hash2);
	}

	function testSender() constant returns (bytes32, bytes32){
		return (_hash1, _hash2);
	}
}

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
		for(uint i = 0; i < receivers.length; i++){
			delete receivers[i];
		}
	}

}
