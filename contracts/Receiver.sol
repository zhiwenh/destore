contract Receiver {

	address owner;
	address masterList;
	bytes32[] hashArray; // [oqwiehroiqer', 'oiqowierqowejr']
	uint availStorage;

	modifier restricted() {
    if (msg.sender == owner) _
	}

	modifier isMasterList() {
    if (msg.sender == masterList) _
	}

	function Receiver (uint availStorage, address master) {
		owner = msg.sender;
		masterList = master;
		masterList.call(bytes4(sha3("addReceiver(uint256)")), availStorage);
	}

	//returns storage
	//LEARN HOW TO ITERATE THROUGH MAPPING
	function retrieveStorage() restricted public constant returns (bytes32[])  {
		return hashArray;
	}
 
	function addToHashList(bytes32 hashIPFS) isMasterList {
		hashArray[hashArray.length++] = hashIPFS;
	}









	// //when checked folder and something was deleted or when deliberately deleted file
	// //WARNING: NO SECURITY ON THIS FUNCTION
	// function deleteHash(uint filesize, string hashIPFS) {
	// 	masterList.call(bytes4(sha3("addFilesize(uint256)")), filesize);
	// 	for (uint i = 0; i < hashArray.length; i++) {
	// 		if(hashArray[i] === hashIPFS) delete hashArray[i];
	// 	}
	// }

	// //function called every 5 minutes to update storage value in object
	// function updateStorage(uint storage) restricted {
	// 	availStorage = storage;
	// }

	// function recReassign(string[] deletedHashes, uint256[] storage) restricted {
	// 	//update hashArray AND availStorage
	// 	masterList.call(bytes4(sha3("reassign(string[], uint256[])")), deletedHashes, storage);
	// }

	// function destroy(uint256[] storage) restricted {
	// 	masterList.call(bytes4(sha3("reassign(string[], uint256[])")), hashArray, storage);
	// 	masterList.call(bytes4(sha3("removeReceiver()")));
	// 	suicide(owner);
	// }


}