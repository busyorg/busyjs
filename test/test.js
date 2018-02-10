const assert = require('assert');
const busy = require('..');
const bluebird = require('bluebird');

bluebird.promisifyAll(busy.Client.prototype);
const client = new busy.Client('wss://gtg.steem.house:8090');

const test = async () => {
  /** Get accounts */
  const accounts = await client.callAsync('get_accounts', [['fabien']]);
  console.log(accounts);
  client.close();
};

test();
