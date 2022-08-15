# "Fund Me" smart contract

Basic EVM smart-contract.

1. Build with Solidity, Hardhat and Alchemy
2. Interaction with the Chainlink Oracle
- programaticaly fetching ETH/USD price from data-feed, based on used chain
- setting-up minimal tip fund as low as 50USD in ETH
3. Unit and Stage testing
- tests for local node network and online test network
4. Deployed on Rinkeby testnet
5. Etherscan contract verification

## Requirements
- Nodejs version 16.16.0

## Quickstart
```
$ git clone https://github.com/martincapovcak/hardhat-fund-me-fcc.git
$ cd hardhat-fund-me-fcc
$ npm install
```

## Enviroment variables
```
RINKEBY_RPC_URL= <https://alchemy.io>
PRIVATE_KEY= <0xkey>
ETHERSCAN_API_KEY= <key>
COINMARKETCAP_API_KEY= <key>
```

## NPM scripts

```
$ npm run test
$ npm run test:staging
$ npm run coverage
```
