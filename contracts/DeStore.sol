contract DeStore {

  event AddReceiver (
    bool status,
    uint index,
    uint availStorage
  );

  event AddFile (
    address _sender,
    bytes _name, // name of file
    uint _value
  );

  event AddSender (
    address _sender
  );

  address[] availReceivers;
  address owner;
  uint receiverIndex;

  struct Receiver {
    bool init; // whether this reciever has ever had their address added to availReceivers
    bool status; // whether this receiver is on or off
    uint index; // position in availReceivers[]
    uint balance;
    uint availStorage; // kilobytes
    bytes23[] hashes; // each element contains half of entire hash
  }

  struct File {
    address sender;
    bytes _name;
    bytes23[] hashes; // each element contains half of entire hash
    uint value; // amount this file is worth
    bool exists;
  }

  struct Sender {
    bool init;
    bool status;
    uint balance;
    mapping (bytes => File) files; // could be string of file name
  }

  mapping (address => Receiver) private receivers;
  mapping (address => Sender) private senders;

  /********************************************************
  * MODIFIERS
  *********************************************************/
  modifier checkReceiverStatus(address _receiverAddress) {
    if (receivers[_receiverAddress].status == true) _
  }

  modifier checkReceiverInit(address _receiverAddress) {
    if (receivers[_receiverAddress].init == true) _
  }

  modifier checkSenderStatus(address _senderAddress) {
    if (senders[_senderAddress].status == true) _
  }

  modifier checkFileExists(address _senderAddress, bytes _fileName) {
    if (senders[_senderAddress].files[_fileName].exists == true) _
  }

  /********************************************************/

  function DeStore() {
    owner = msg.sender;
    receiverIndex = 0;
  }

  /********************************************************/

  function receiverAdd(uint kilobytes) returns (bool) {
    if (receivers[msg.sender].init != false) return false; // catches if receiver is already initialized

    receivers[msg.sender].init = true;
    receivers[msg.sender].status = true;
    receivers[msg.sender].index = availReceivers.length;
    availReceivers.push(msg.sender);
    receivers[msg.sender].availStorage = kilobytes;

    AddReceiver (
      receivers[msg.sender].status,
      receivers[msg.sender].index,
      receivers[msg.sender].availStorage
    );

    return true;
  }

  // called from sender methods
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

  function receiverChangeStatus(bool newStatus) public checkReceiverInit(msg.sender) {
    if (receivers[msg.sender].status == newStatus) return;
    else {
      receivers[msg.sender].status = newStatus;
    }
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

  /********************************************************/
  /********************************************************/

  function senderAdd() external returns (bool) {
    if (senders[msg.sender].init != false) return false; // catches if receiver is already initialized
    senders[msg.sender].init = true;
    senders[msg.sender].status = true;
    AddSender(msg.sender);
    return true;
  }

  function senderAddFile(bytes23[] _hashes, bytes _fileName, uint _value)
    checkSenderStatus(msg.sender)
    external
    returns (bool)
  {
    Sender sender = senders[msg.sender];
    if (sender.files[_fileName].exists == true) return; // check to see if file exists
    sender.files[_fileName].exists = true;
    sender.files[_fileName].hashes = _hashes;
    sender.files[_fileName].value = _value;

    AddFile(msg.sender, _fileName, _value);
  }

  /*function senderGetFileHost(bytes _fileName, uint _amount)
    checkSenderStatus(msg.sender)
    checkFileExists(msg.sender, _fileName)
    public
  {
    uint memory i = receiverIndex;

    while (sentTo < _amount) {
      if (
        receivers[availReceivers][i].status == true &&
        receivers[availReceivers][i].availStorage <= senders[msg.sender].files[_fileName]
      )
    }
  }*/
  /********************************************************/


  function getFileHashes(address _senderAddress, bytes _fileName)
    checkSenderStatus(_senderAddress)
    checkFileExists(_senderAddress, _fileName)
    public
    constant
    returns (bytes23[])
  {
    return senders[_senderAddress].files[_fileName].hashes;
  }

}
