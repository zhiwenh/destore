contract MasterList {
  address public owner; //0x019823r0918j231029830982173 -- address of owner
	mapping (address => uint) receiverStorage; // {0xiwurowiquer:1, 0x9173246342: 5, 0x192837432874: 10}
	address[] receiverIndex;

	modifier restricted() {
    if (msg.sender == owner) _
	}

	//constructor
	function MasterList(){
		owner = msg.sender;
	}

	function addReceiver(uint availStorage){
		receiverStorage[msg.sender] = availStorage;
	}

	//called by sender to find receiver with given filesize
	//EDITTTTTTTTTTT
	function findReceiver(uint filesize) constant returns (address){
		for(var i =0;i<receiverStorage.length; i++){
			if(filesize < receiverStorage[]) {
				//send receiver somewhere
				break;
			}
		}
	}		

	//when receiver is destroyed, reassigns all files to other receivers
	function reassign(string[] hashAddresses, uint256[] storage){
		for(var i =0; i<hashAddresses.length; i++){
			
			hashAddresses[i]
		}
	}

	function deleteHash(uint storage){
		recStorage[msg.sender] += storage;
	}

	//to self-destruct SC and return money to owner
	function destroy() restricted {
		suicide(owner);
	}





}
