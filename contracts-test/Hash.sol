contract Hash {
  bytes _hash;
  List _list;

  function Hash(bytes hash, address list) {
    _list = List(list);
    _hash = hash;
    _list.set(hash, msg.sender);
  }

  function getHash() constant returns (bytes) {
    return (_hash);
  }
}

contract List {
  struct People {
    address sender;
    bytes hash;
  }
  People[] peoples;

  function set(bytes hash, address senderAddress) {
    peoples.push(People({sender: senderAddress, hash: hash}));
  }

  function get(uint id) constant returns (bytes) {
    /*return (_hashes[0], _hashes[1]);*/
    return peoples[id].hash;
  }
}
