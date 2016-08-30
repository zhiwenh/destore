contract DeStore {

  address owner; // consider deleting later
  address[] availReceivers;

  struct Receiver {
    address receiverAddress;
    uint availStorage;
    uint balance;
    bytes23[] hashes;
    bool valid; // whether this receiver is on or off
    bool init; // whether this reciever has ever been turned on
    uint index; // position in availReceivers[]
  }

  struct Sender {
    address senderAddress;
    uint balance;
    bytes23[] hashes;
  }

  mapping (address => Receiver) private recievers;
  mapping (address => Sender) private senders;

  function DeStore() {
    owner = msg.sender;
  }

  function addReceiver(uint _availStorage) {
    if (recievers[msg.sender].valid == false) {
      recievers[msg.sender].availStorage = _availStorage;
      recievers[msg.sender].valid == true;
    }
  }

  function checkReceiverStorage() constant returns (uint) {
    return recievers[msg.sender].availStorage;
  }

}
