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

  function DeStore() {
    owner = msg.sender;
  }

  modifier receiverStatusTrue() {
    if (receivers[msg.sender].status != true) throw;
  }

  function receiverAdd(uint kilobytes) {
    if (receivers[msg.sender].init != false) throw; // catches if receiver is already initialized

    receivers[msg.sender].init == true;
    receivers[msg.sender].status = true;
    receivers[msg.sender].availStorage = kilobytes;

    availReceivers.push(msg.sender);
    receivers[msg.sender].index = availReceivers.length;
  }

  // could be called only after verification
  function receiverAddHashes(address _receiverAddress, bytes23[] _hashes)
    private
    receiverStatusTrue
  {
    for (uint i = 0; i < _hashes.length; i++) {
      receivers[_receiverAddress].hashes.push(_hashes[i]);
    }
  }

  function receiverAddStorage(uint kilobytes)
    external
    receiverStatusTrue
  {
    receivers[msg.sender].availStorage += kilobytes;
  }

  function receiverGetStorage()
    external
    receiverStatusTrue
    constant
    returns (uint)
  {
    return receivers[msg.sender].availStorage;
  }

  function receiverGetStatus()
    external
    receiverStatusTrue
    constant
    returns (bool)
  {
    return receivers[msg.sender].status;
  }

}
