import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing"
import {
  defaultRegistryTypes,
  assertIsDeliverTxSuccess,
  SigningStargateClient,
} from '@cosmjs/stargate'
import fs from "fs"

var inputs = []
var outputs = [] 

let rawdata = fs.readFileSync( 'owners_eligible.json' )
let finalData = JSON.parse( rawdata ) 

// Add your mnemonic sender here
const mnemonic = "";
const wallet = await DirectSecp256k1HdWallet.fromMnemonic( mnemonic, { 
    prefix: 'tori' 
  }
)
// Here we get address sender
const [senderWallet] = await wallet.getAccounts();

// Create client to broadcast
const rpcEndpoint = 'https://teritori-rpc.polkachu.com';
const client = await SigningStargateClient.connectWithSigner( rpcEndpoint, wallet );

// Set fee/gas
const fee = {
  amount: [
    {
      denom: 'utori',
      amount: '5000',
    },
  ],
  gas: '1000000', // If more gas, change it here!! See simulation above
}

// Here we foreach file generated on convertion step
// Inputs = sender (AAA team part)
// Outputs = recipient of airdrop
finalData.forEach( function( item ) {
  
  inputs.push({
    "address": senderWallet.address,
    "coins": [
      {
        "amount": String( item.rewards ),
        "denom": 'utori'
      }
    ]
  })
  outputs.push({
    "address": item.owner_addr,
    "coins": [
      {
        "amount": String( item.rewards ),
        "denom": 'utori'
      }
    ]
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

// View message befor broadcast
console.log( copieMultiSend[0] )
console.log( 'Gas estimated: ' + await client.simulate(senderWallet.address, copieMultiSend, '') )

// Broadcast multiSend
// const result = await client.signAndBroadcast(senderWallet.address, copieMultiSend, fee, '')
// assertIsBroadcastTxSuccess(result)
// console.log(result)
