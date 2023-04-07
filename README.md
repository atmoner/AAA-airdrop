# AAA-airdrop

## Install
```
git clone https://github.com/atmoner/AAA-airdrop.git
cd AAA-airdrop
npm i
```

## Use
### First step
1. Generate the input json file with the AAA [Comics address checker](https://git.aaa-metahuahua.com/AAA_Community/comicsbooksadresscheckers)
2. Name the json file `owners_eligible.json`
3. Place it in the same folder as the script
4. See section below (depending of your OS) 

### Env var :
- AIRDROP_MNEMONIC : the mnemonic seed of the wallet
- AIRDROP_GAS : amount of gas to use (default value is env var is not present : 1000000)
- AIRDROP_IS_SIMULATED : set the env var with anything if you want a dry-run

### Usage Linux / MacOS
```
// Simulation
AIRDROP_MNEMONIC="<your mnemonic seed>" AIRDROP_IS_SIMULATED=true node multiSend.js

// Real
AIRDROP_MNEMONIC="<your mnemonic seed>" AIRDROP_GAS=<your amount of gas> node multiSend.js
```

### Usage Windows
```
// Simulation
$env:AIRDROP_MNEMONIC='<your mnemonic seed>'; $env:AIRDROP_IS_SIMULATED='true'; node multiSend.js; Remove-Item Env:AIRDROP_MNEMONIC; Remove-Item Env:AIRDROP_IS_SIMULATED

// Real
$env:AIRDROP_MNEMONIC='<your mnemonic seed>'; $env:AIRDROP_GAS='<your amount of gas>'; node multiSend.js; Remove-Item Env:AIRDROP_MNEMONIC; Remove-Item Env:AIRDROP_GAS
```