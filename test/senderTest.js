contract(Sender, function () {
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


// contract('Conference', function(accounts) {
//   it("should assert true", function(done) {
//     var conference = Conference.at(Conference.deployed_address);
//     assert.isTrue(true);
//     done();
//   });
// });
