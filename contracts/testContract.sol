contract Test {
	address owner;
	uint value1;
	// string value2;
	bytes32 value3;

	function Test(uint value) {
		uint value1 = value;
		owner = msg.sender;
	}

	function setValue(uint value) {
		value1 = value;
	}

	function getValue() constant returns (uint){
		return value1;
	}

	function getValue2() constant returns (bytes32){
		return value3;
	}

	// function getValue3() {

	// }
}
