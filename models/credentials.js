'use strict';
const Datastore = require('nedb');
const bcrypt = require('bcrypt');
const SALT_WORK_FACTOR = 10;

const Credentials = new Datastore({
  filename: __dirname + '/../data/credentials.db',
  autoload: true
});

const Schema = {
  password: null; // bcrypt
  id: null; // maybe an id
  accountType = null; // Host or User;
};

Credentials.ensureIndex({}, (err) => {
  if(err) console.log('Credentials.ensureIndex error: ', err);
});
