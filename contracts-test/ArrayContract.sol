contract ArrayContract {
  uint[2**20] m_aLotOfIntegers;
  bool[2][] m_pairsOfFlags;
  function setAllFlagPairs(bool[2][] newPairs) {
    // assignment to array replaces the complete array
    m_pairsOfFlags = newPairs;
  }
  function setFlagPair(uint index, bool flagA, bool flagB) {
    // access to a non-existing index will stop execution
    m_pairsOfFlags[index][0] = flagA;
    m_pairsOfFlags[index][1] = flagB;
  }
  function getFlagPairs() constant returns (bool[2][] array) {
    return m_pairsOfFlags;
  }
  function getFlagPairsLength() constant returns (uint length) {
    return m_pairsOfFlags.length;
  }
  function getLotsOfIntegers() constant returns (uint[2**20] arr) {
    return m_aLotOfIntegers;
  }
}
