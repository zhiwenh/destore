'use strict';
const promisify = require('es6-promisify');

const hostInfo = require('./hostInfo');
const hostAll = require('./hostAll');
const withdrawAll = require('./withdrawAll');


module.exports = {
  hostInfo: hostInfo,
  hostAll: hostAll,
  withdrawAll: withdrawAll
};
