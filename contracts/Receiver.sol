contract Receiver {

	address owner;
	address masterList;
	string[] hashArray; // [oqwiehroiqer', 'oiqowierqowejr']
	uint availStorage;

	modifier restricted() {
    if (msg.sender == owner) _
	}

	function Receiver (uint availStorage){
		owner = msg.sender
		masterList = '0x9813498237498273487'
		masterList.call(bytes4(sha3("addReceiver(uint256)")), availStorage);
	}

	//returns storage
	//LEARN HOW TO ITERATE THROUGH MAPPING
	function retrieveStorage() constant returns (string[]){
		return hashArray;
	}
 
	//when checked folder and something was deleted or when deliberately deleted file
	function delete(string hash, uint filesize){
		masterList.call(bytes4(sha3("deleteHash(uint256)")), filesize);
		delete hashArray[hash];
	}

	function addToHashList(string hashIPFS){
		hashArray[hashArray.length++] = hashIPFS;
	}

	//function called every 5 minutes to update storage value in object
	function updateStorage(uint storage){
		availStorage = storage
	}

	function recReassign(string[] deletedHashes, uint256[] storage){
		//update hashArray AND availStorage
		masterList.call(bytes4(sha3("reassign(string[], uint256[])")), deletedHashes, storage);
	}

	function destroy(uint256[] storage){
			masterList.call(bytes4(sha3("reassign(string[], uint256[])")), hashArray, storage);
		suicide(owner);
	}


}