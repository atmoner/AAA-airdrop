import {
  DirectSecp256k1HdWallet
} from "@cosmjs/proto-signing"
import {
  defaultRegistryTypes,
  assertIsDeliverTxSuccess,
  SigningStargateClient,
} from '@cosmjs/stargate'
import fs from "fs"

var inputs = []
var outputs = []

// File read
let rawdata = fs.readFileSync('owners_eligible.json')
let finalData = JSON.parse(rawdata)

// ENV VAR READ

// Get seed
const mnemonic = process.env.AIRDROP_MNEMONIC;
if (mnemonic == "") {
  console.error("no mnemonic seed provided. Please set MNEMONIC_SEED env var")
  process.exit(1)
}

// If you need more gas, change it with env var. Default : 1000000 utori
const gas = process.env.AIRDROP_GAS != undefined ? process.env.AIRDROP_GAS : '1000000'

// Trigger simulation
const isSimulated = process.env.AIRDROP_IS_SIMULATED != undefined
if (isSimulated) {
  console.log("==============================")
  console.log("= RUNNING IN SIMULATION MODE =")
  console.log("==============================")
}

// Wallet set up

const wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, {
  prefix: 'tori'
})
// Here we get address sender
const [senderWallet] = await wallet.getAccounts();

// Create client to broadcast
const rpcEndpoint = 'https://teritori-rpc.polkachu.com';
const client = await SigningStargateClient.connectWithSigner(rpcEndpoint, wallet);

// MultiSig set up

// Set fee/gas
const fee = {
  amount: [{
    denom: 'utori',
    amount: '5000',
  }, ],
  gas: gas,
}

// Here we foreach file generated on convertion step
// Inputs = sender (AAA team part)
// Outputs = recipient of airdrop
finalData.forEach(function (item) {
  inputs.push({
    "address": senderWallet.address,
    "coins": [{
      "amount": String(item.rewards),
      "denom": 'utori'
    }]
  })
  outputs.push({
    "address": item.owner_addr,
    "coins": [{
      "amount": String(item.rewards),
      "denom": 'utori'
    }]
  })
})

// Format message to broadcast
const registryMsgMultiSend = defaultRegistryTypes[4][1]

const copieMultiSend = [{
  typeUrl: '/cosmos.bank.v1beta1.MsgMultiSend',
  value: registryMsgMultiSend.fromPartial({
    "inputs": inputs,
    "outputs": outputs
  }),
}]

// Send multisig tx or simulate it

if (isSimulated) {
  // View message before broadcast
  console.log("ready to simulate multisig for", outputs.length, "addresses")
  console.log('Gas estimated: ' + await client.simulate(senderWallet.address, copieMultiSend, ''))
} else {
  // Broadcast multiSend
  const result = await client.signAndBroadcast(senderWallet.address, copieMultiSend, fee, '')
  assertIsBroadcastTxSuccess(result)
  console.log(result)

  if (result.code !== undefined && result.code !== 0) {
    console.log("Failed to send tx: " + result.log || result.rawLog);
  } else {
    console.log("Succeed to send tx:" + result.transactionHash);
  }
}