contract Sender {
  address owner; //0x019823r0918j231029830982173 -- address of owner
  // address[] receiverAddresses;
  uint filesize; //1928347 bytes
  bytes23 _hash1;
  bytes23 _hash2;
  MasterList masterlist;

  modifier restricted() {
    if (msg.sender == owner) _
	}

	/*Event warnUser()*/

	function Sender(bytes23 hash1, bytes23 hash2, uint size, address masterAdd) {
		owner = msg.sender;
		MasterList masterlist = MasterList(masterAdd);
		_hash1 = hash1;
		_hash2 = hash2;
		filesize = size;
		// masterList.call(bytes4(sha3("assign(uint256, string)")), filesize, hashIPFS);
		MasterList.assign(filesize, _hash1, _hash2);
	}

	// function addToRecList(address receiver) {
	// 	receiverAddresses[receiverAddresses.length++] = receiver;
	// }

	// function removeFromRecList (address receiver) {
	// 	for (uint i = 0; i < receiverAddresses.length; i++) {
	// 		if (receiverAddresses[i] == receiver) delete receiverAddresses[i];
	// 	}
	// }

	// function destroy() restricted {
	// 	for (uint i = 0; i < receiverAddresses.length; i++){
	// 		receiverAddresses[i].call(bytes4(sha3("deleteHash(uint256, string)")), filesize, hashIPFS);
	// 	}
 //    suicide(owner);
	// }

}
