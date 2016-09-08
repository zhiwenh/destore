'use strict';
const hostInfo = require('./hostInfo');
const hostAll = require('./hostAll');
const balance = require('./balance');
const withdrawAll = require('./withdrawAll');
const removeHash = require('./removeHash');
const listHostDb = require('./listHostDb');

module.exports = {
  hostInfo: hostInfo,
  hostAll: hostAll,
  balance: balance,
  withdrawAll: withdrawAll,
  removeHash: removeHash,
  listHostDb: listHostDb
};
