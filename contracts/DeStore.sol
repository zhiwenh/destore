contract DeStore {




  address owner; // consider deleting later
  address[] availReceivers;

  struct Receiver {
    address receiverAddress;
    uint availStorage; // kilobytes
    uint balance;
    bytes23[] hashes; // each element contains half of entire hash
    bool status; // whether this receiver is on or off
    bool init; // whether this reciever has ever had their address added to availReceivers
    uint index; // position in availReceivers[]
  }

  struct Sender {
    address senderAddress;
    uint balance;
    bytes23[] hashes; // each element contains half of entire hash
  }

  mapping (address => Receiver) private receivers;
  mapping (address => Sender) private senders;

  modifier checkReceiverStatus(address _receiverAddress) {
    if (receivers[_receiverAddress].status == false) throw;
    _
  }

  function DeStore() {
    owner = msg.sender;
  }

  function receiverAdd(uint kilobytes) {
    if (receivers[msg.sender].init != false) throw; // catches if receiver is already initialized

    receivers[msg.sender].init = true;
    receivers[msg.sender].status = true;
    receivers[msg.sender].availStorage = kilobytes;

    availReceivers.push(msg.sender);
    receivers[msg.sender].index = availReceivers.length;
    return;
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



}
