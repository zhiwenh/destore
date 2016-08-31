contract DeStore {

  event AddReceiver (
    bool _init,
    bool _status,
    uint _index,
    uint _availStorage
  );

  address owner; // consider deleting later
  address[] availReceivers;

  struct Receiver {
    bool init; // whether this reciever has ever had their address added to availReceivers
    bool status; // whether this receiver is on or off
    uint index; // position in availReceivers[]
    uint balance;
    uint availStorage; // kilobytes
    bytes23[] hashes; // each element contains half of entire hash
  }

  struct Sender {
    address senderAddress;
    uint balance;
    bytes23[] hashes; // each element contains half of entire hash
  }

  mapping (address => Receiver) private receivers;
  mapping (address => Sender) private senders;

  modifier checkReceiverStatus(address _receiverAddress) {
    if (receivers[_receiverAddress].status == true) _
  }

  modifier checkReceiverInit(address _receiverAddress) {
    if (receivers[_receiverAddress].init == true) _
  }

  function DeStore() {
    owner = msg.sender;
  }

  function receiverAdd(uint kilobytes) returns (bool) {
    if (receivers[msg.sender].init != false) return false; // catches if receiver is already initialized
    availReceivers.push(msg.sender);

    receivers[msg.sender].init = true;
    receivers[msg.sender].status = true;
    receivers[msg.sender].index = availReceivers.length;
    receivers[msg.sender].availStorage = kilobytes;

    AddReceiver (
      receivers[msg.sender].init,
      receivers[msg.sender].status,
      receivers[msg.sender].index,
      receivers[msg.sender].availStorage
    );

    return true;
  }

  // called from sender
  function receiverAddHashes(address _receiverAddress, bytes23[] _hashes)
    private
    checkReceiverStatus(_receiverAddress)
  {
    for (uint i = 0; i < _hashes.length; i++) {
      receivers[_receiverAddress].hashes.push(_hashes[i]);
    }
  }

  function receiverGetHashes()
    external
    checkReceiverStatus(msg.sender)
    constant
    returns (bytes23[])
  {
    return receivers[msg.sender].hashes;
  }

  function receiverAddStorage(uint kilobytes)
    external
    checkReceiverStatus(msg.sender)
  {
    receivers[msg.sender].availStorage += kilobytes;
  }

  function receiverGetStorage()
    external
    checkReceiverStatus(msg.sender)
    constant
    returns (uint)
  {
    return receivers[msg.sender].availStorage;
  }

  function receiverGetStatus(address _receiverAddress) public constant returns (bool) {
    return receivers[_receiverAddress].status;
  }

  function receiverGetBalance()
    checkReceiverInit(msg.sender)
    constant
    returns (uint)
  {
    return receivers[msg.sender].balance;
  }

  // double check the security of this later
  function receiverWithdraw(uint withdrawAmount) public checkReceiverInit(msg.sender) returns (uint) {
    if (receivers[msg.sender].balance >= withdrawAmount) {
      receivers[msg.sender].balance -= withdrawAmount;
      if (!msg.sender.send(withdrawAmount)) {
          receivers[msg.sender].balance += withdrawAmount;
      }
    }
    return receivers[msg.sender].balance;
  }


}
