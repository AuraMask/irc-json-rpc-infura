const test = require('tape');
const {fetchConfigFromReq} = require('../src/index');

test('fetchConfigFromReq - basic', (t) => {

  const network = 'eth_mainnet';
  const req = {
    method: 'irc_getBlockByNumber',
    params: ['0x482103', true],
  };

  const {fetchUrl, fetchParams} = fetchConfigFromReq({network, req});
  t.equals(fetchUrl, 'https://api.infura.io/v1/jsonrpc/mainnet/irc_getBlockByNumber?params=%5B%220x482103%22%2Ctrue%5D');
  t.deepEquals(fetchParams, {method: 'GET'});
  t.end();

});

test('fetchConfigFromReq - basic', (t) => {

  const network = 'eth_ropsten';
  const req = {
    method: 'irc_sendRawTransaction',
    params: ['0x0102030405060708090a0b0c0d0e0f'],
  };

  const {fetchUrl, fetchParams} = fetchConfigFromReq({network, req});
  t.equals(fetchUrl, 'https://api.infura.io/v1/jsonrpc/ropsten');
  t.deepEquals(fetchParams, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(req),
  });
  t.end();

});

test('fetchConfigFromReq - strip non-standard keys', (t) => {

  const network = 'eth_ropsten';
  const req = {
    method: 'irc_sendRawTransaction',
    params: ['0x0102030405060708090a0b0c0d0e0f'],
    origin: 'happydapp.irc',
  };

  const {fetchUrl, fetchParams} = fetchConfigFromReq({network, req});
  t.equals(fetchUrl, 'https://api.infura.io/v1/jsonrpc/ropsten');
  const parsedReq = JSON.parse(fetchParams.body);
  t.notOk('origin' in parsedReq, 'non-standard key removed from req');
  t.end();

});
