'use strict';
const hostInfo = require('./hostInfo');
const hostAll = require('./hostAll');
const withdrawAll = require('./withdrawAll');
const removeHash = require('./removeHash');
const listHostDb = require('./listHostDb');

module.exports = {
  hostInfo: hostInfo,
  hostAll: hostAll,
  withdrawAll: withdrawAll,
  removeHash: removeHash,
  listHostDb: listHostDb
};
