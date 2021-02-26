require('dotenv').config()

const { ethers } = require("ethers");
const {getAddress, sendTransaction} = require('../sawtooth/sawtooth-helpers');
const secp256k1 = require('secp256k1')
const { randomBytes } = require('crypto');
const crypto = require('crypto');
const { default: axios } = require("axios");

const hash512 = (x) =>
  crypto.createHash('sha512').update(x).digest('hex');

const TRANSACTION_FAMILY = 'todos';
const TRANSACTION_FAMILY_VERSION = '1.0';
const INT_KEY_NAMESPACE = hash512(TRANSACTION_FAMILY).substring(0, 6)


// let privKey;
// do {
//   privKey = randomBytes(32);
// } while (!secp256k1.privateKeyVerify(privKey));

let privKey1 = Buffer.from(
  "7f664d71e4200b4a2989558d1f6006d0dac9771a36a546b1a47c384ec9c4f04b", 'hex');

let privKey2 = Buffer.from(
  "2473b1f5198c4a5fa610204314c8743aa465d253fe746f5d039a29b238aa2697", 'hex');


const wallet = new ethers.Wallet(privKey1);
let pubKey = secp256k1.publicKeyConvert(Uint8Array.from(Buffer.from(wallet.publicKey.substr(2), 'hex')), true);
const publicKey = Buffer.from(pubKey).toString('hex');

console.log('privKey:', privKey1.toString('hex'));
console.log('publicKey:', publicKey);


(async () => {

  const payload = {
    type: 'todo',
    id: 10,
    
    input: null,
    output:{
      value: "val",
      owner: publicKey
    }
  };

  let transaction = JSON.stringify(payload);
  const txid = await wallet.signMessage(transaction)

  const pl = JSON.stringify({func: 'post', args:{transaction, txid}});
  const address = getAddress(TRANSACTION_FAMILY, txid);

  try{
    await sendTransaction(
      TRANSACTION_FAMILY, 
      TRANSACTION_FAMILY_VERSION,
      [address],
      [address],
      pl);
    
    console.log('ok');
  }
  catch(err){
    console.log(err);
  }
})();
