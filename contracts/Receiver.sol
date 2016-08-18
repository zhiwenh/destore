contract Receiver {

	address owner;
	address masterList;
	string[] hashArray; // [oqwiehroiqer', 'oiqowierqowejr']
	uint availStorage;

	modifier restricted() {
    if (msg.sender == owner) _
	}

	modifier isMasterList() {
    if (msg.sender == masterList) _
	}

	function Receiver (uint availStorage) {
		owner = msg.sender
		masterList = '0x9813498237498273487'
		masterList.call(bytes4(sha3("addReceiver(uint256)")), availStorage);
	}

	//returns storage
	//LEARN HOW TO ITERATE THROUGH MAPPING
	function retrieveStorage() public constant returns (string[]) restricted {
		return hashArray;
	}
 
	//when checked folder and something was deleted or when deliberately deleted file
	//WARNING: NO SECURITY ON THIS FUNCTION
	function deleteHash(uint filesize, string hashIPFS) {
		masterList.call(bytes4(sha3("addFilesize(uint256)")), filesize);
		for (var i = 0; i < hashArray.length; i++) {
			if(hashArray[i] === hashIPFS) delete hashArray[i];
		}
	}

	function addToHashList(string hashIPFS) isMasterList {
		hashArray[hashArray.length++] = hashIPFS;
	}

	//function called every 5 minutes to update storage value in object
	function updateStorage(uint storage) restricted {
		availStorage = storage;
	}

	function recReassign(string[] deletedHashes, uint256[] storage) restricted {
		//update hashArray AND availStorage
		masterList.call(bytes4(sha3("reassign(string[], uint256[])")), deletedHashes, storage);
	}

	function destroy(uint256[] storage) restricted {
		masterList.call(bytes4(sha3("reassign(string[], uint256[])")), hashArray, storage);
		masterList.call(bytes4(sha3("removeReceiver()")));
		suicide(owner);
	}


}