contract('MasterList', function (accounts) {
  it('should return bytes32', function (done){
    var sender = Sender.deploy();

    return sender.testSender.call().then()
  });
});
