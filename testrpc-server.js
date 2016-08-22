var TestRPC = require('ethereumjs-testrpc');
var server = TestRPC.server();
server.listen(8545, function(err, blockchain) {
  if (err) {
    console.log(err);
  } else {
    console.log(blockchain);
  }
});
