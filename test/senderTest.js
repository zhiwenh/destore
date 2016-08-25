contract('MasterList', function (accounts) {
  it('This test should fail,', function (done){
    Sender.new()
    .then(function(sender){
      sender.owner.call().then(
        function(owner){
          assert.equal(msg.sender, owner, 'msg.sender does not match owner');
        }
      ).catch(done);
    });
  });
});
