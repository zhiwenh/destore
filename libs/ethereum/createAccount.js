var headers = {
  'User-Agent': 'Super Agent/0.0.1',
  'Content-Type': 'application/json-rpc',
  'Accept': 'application/json-rpc'
}

var options = {
  url: "http://localhost:8545",
  method: 'POST',
  headers: headers,
  body: JSON.stringify({
    jsonrpc: '2.0',
    method: 'personal_newAccount',
    params: ['pass'],
    id: 1
  })
}

request(options, function(error, response, body) {
  if (!error && response.statusCode == 200) {
    res.writeHeader(200, {
      "Content-Type": "text/plain"
    });
    res.write(res.statusCode.toString() + " " + body);
  } else {
    res.writeHeader(response.statusCode, {
      "Content-Type": "text/plain"
    });
    res.write(response.statusCode.toString() + " " + error);
  }
  res.end();
});
