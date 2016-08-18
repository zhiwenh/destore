contract Sender {
	address masterList;
  address owner; //0x019823r0918j231029830982173 -- address of owner
  address[] receiverAddresses;
  uint filesize; //1928347 bytes
  string hashIPFS;

  modifier restricted() {
    if (msg.sender == owner) _
	}

	/*Event warnUser()*/

	function Sender(string hashAddress, uint size, address master) {
		owner = msg.sender;
		masterList = master;
		hashIPFS = hashAddress;
		filesize = size;
		masterList.call(bytes4(sha3("assign(uint256, string)")), filesize, hashIPFS);
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
