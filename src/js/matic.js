import Biconomy from "@biconomy/mexa";
import { PLATFORM_SPN_ABI, STAKING_CONTRACT_ABI } from "../constants";

const bn = require('bn.js')
const Web3 = require("web3");
let sigUtil = require("eth-sig-util");

const config = require('./config')

const domainType = [
  { name: "name", type: "string" },
  { name: "version", type: "string" },
  { name: "verifyingContract", type: "address" },
  { name: "salt", type: "bytes32" },
  
];

const metaTransactionType = [
  { name: "nonce", type: "uint256" },
  { name: "from", type: "address" },
  { name: "functionSignature", type: "bytes" },
];

const SCALING_FACTOR_SPN = new bn(10).pow(new bn(6));

window.ethereum.enable().catch((error) => {
  console.log(error);
});
const web3 = new Web3(window.ethereum);

const biconomy = new Biconomy(new Web3.providers.WebsocketProvider(config.MATIC_PROVIDER_WS), {
  apiKey: config.BICONOMY_API_KEY, 
  debug: true,
});
const biconomyWeb3 = new Web3(biconomy);

biconomy
  .onEvent(biconomy.READY, () => {
    // Initialize your dapp here like getting user accounts etc
    console.log("Mexa is Ready", biconomy);
  })
  .onEvent(biconomy.ERROR, (error, message) => {
    // Handle error while initializing mexa
    console.error(error);
  });


export const initMatic = async () => {
  const MaticPOSClient = require("@maticnetwork/maticjs").MaticPOSClient;

  return new MaticPOSClient({
    maticProvider: config.MATIC_PROVIDER_RPC,
    parentProvider: web3.currentProvider,
    network: 'mainnet',
    version: 'v1',
  });

};

export const approve = async () => {
  const maticPOSClient = await initMatic();

  await maticPOSClient
    .approveERC20ForDeposit(config.MAINNET_SPN_TOKEN, new bn(10).mul(SCALING_FACTOR_SPN), { from: config.FROM_ADDRESS, onTransactionHash: (hash) => console.log('----onTransactionHash', hash) })
    .then(async (logs) => {
      console.log(logs);
    });
}

export const deposit = async () => {
  const maticPOSClient = await initMatic();

  await maticPOSClient.depositERC20ForUser(config.MAINNET_SPN_TOKEN, config.FROM_ADDRESS, new bn(10).mul(SCALING_FACTOR_SPN), { from: config.FROM_ADDRESS, gasPrice: '10000000000' })
    .then(async (logs) => {
      console.log("Deposit: " + logs.transactionHash);
    });
}


export const getContractDetails = async (web3, pAddress) => {
  const abi = PLATFORM_SPN_ABI;
  const contract = new web3.eth.Contract(abi, pAddress);
  const tokenName = await contract.methods.name().call();
  console.log('tokenName ', tokenName);
  let domainData = {
    name: tokenName,
    version: "1",
    verifyingContract: pAddress,
    salt: web3.utils.fromAscii('0x' + config.NETWORKD_ID.toString(16).padStart(64, '0')),
  };
  return { contract, domainData };
};

export const getStakeContractDetails = async (web3, pAddress) => {
  const abi = STAKING_CONTRACT_ABI;
  const contract = new web3.eth.Contract(abi, pAddress);

  let domainData = {
    name: 'SapienStaking',
    version: "1",
    verifyingContract: pAddress,
    salt: web3.utils.fromAscii('0x' + config.NETWORKD_ID.toString(16).padStart(64, '0')),
  };
  return { contract, domainData };
};

export const transfer = async () => {
  const pRecipient = '0xF86B30C63E068dBB6bdDEa6fe76bf92F194Dc53c';
  const tokenAddress = config.MATIC_SPN_TOKEN;

  const detail = await getContractDetails(biconomyWeb3, tokenAddress);
  const amount = new bn(2).mul(SCALING_FACTOR_SPN);
  console.log('toWei', amount);
  let functionSignature = detail.contract.methods
    .transfer(pRecipient, amount)
    .encodeABI();
  console.log('functionSignature', functionSignature);
  await executeMetaTransaction(functionSignature, detail.contract, detail.domainData)
    .then(log => console.log('executeMetaTransaction-', log))
    .catch(err => console.log('err executeMetaTransaction', err));
};


export const transferWithPurpose = async () => {
  const pRecipient = '0xFCbCCd4d846a59535f1a3eA349b9bC07e800Db4B';
  const tokenAddress = config.MATIC_SPN_TOKEN;

  const detail = await getContractDetails(biconomyWeb3, tokenAddress);
  const amount = new bn(2).mul(SCALING_FACTOR_SPN);
  console.log('toWei', amount);
  let functionSignature = detail.contract.methods
    .transferWithPurpose(pRecipient, amount, '0x12345678')
    .encodeABI();
  console.log('functionSignature', functionSignature);
  await executeMetaTransaction(functionSignature, detail.contract, detail.domainData)
    .then(log => console.log('executeMetaTransaction-', log))
    .catch(err => console.log('err executeMetaTransaction', err));
};

export const stake = async () => {

  const detail = await getContractDetails(biconomyWeb3, config.MATIC_SPN_TOKEN);
  const amount = new bn(2).mul(SCALING_FACTOR_SPN);
  console.log('toWei', amount);

  let functionSignature = detail.contract.methods
    .transfer(config.MATIC_SPN_STAKING_CONTRACT, amount)
    .encodeABI();

  console.log('functionSignature', functionSignature);
  await executeMetaTransaction(functionSignature, detail.contract, detail.domainData)
    .then(log => console.log('executeMetaTransaction-', log))
    .catch(err => console.log('err executeMetaTransaction', err));
};

export const unstake = async () => {

  const detail = await getStakeContractDetails(biconomyWeb3, config.MATIC_SPN_STAKING_CONTRACT); 
  const amount = new bn(2).mul(SCALING_FACTOR_SPN);

  let functionSignature = detail.contract.methods.unstake(amount).encodeABI();

  console.log('functionSignature', functionSignature);
  await executeMetaTransaction(functionSignature, detail.contract, detail.domainData)
    .then(log => console.log('executeMetaTransaction-', log))
    .catch(err => console.log('err executeMetaTransaction', err));
}

export const getStake = async () => {

  const contract = new biconomyWeb3.eth.Contract(STAKING_CONTRACT_ABI, config.MATIC_SPN_STAKING_CONTRACT);
  const stakedAmount = await contract.methods.getStake(config.FROM_ADDRESS).call();

  console.log(`stakedAmount for ${config.FROM_ADDRESS} is ${stakedAmount.tokens}`);
}

export const getPlatformSPNBalance = async () => {

  const contract = new biconomyWeb3.eth.Contract(PLATFORM_SPN_ABI, config.MATIC_SPN_TOKEN);
  const platformSPN = await contract.methods.balanceOf(config.FROM_ADDRESS).call();

  console.log(`platformSPN for ${config.FROM_ADDRESS} is ${platformSPN}`);
}

export const burn = async () => {
  const tokenAddress = config.MATIC_SPN_TOKEN;
  const detail = await getContractDetails(biconomyWeb3, tokenAddress); // SPN ChildTokenAddress
  const amount = new bn(5).mul(SCALING_FACTOR_SPN);
  let functionSignature = detail.contract.methods.withdraw(amount).encodeABI();
  console.log('functionSignature', functionSignature);
  executeMetaTransaction(functionSignature, detail.contract, detail.domainData);
};

export const exit = async () => {
  const maticPOSClient = await initMatic();

  await maticPOSClient
  .exitERC20(config.BURN_HASH, { from: config.FROM_ADDRESS, onTransactionHash: (hash) => console.log('----onTransactionHash', hash) })
  .then(async (logs) => {
    console.log(logs);
  });
};

const executeMetaTransaction = async (
  functionSignature,
  contract,
  domainData
) => {
  let userAddress = config.FROM_ADDRESS;
  let nonce = await contract.methods.getNonce(userAddress).call();

  let message = {};
  message.nonce = parseInt(nonce);
  message.from = userAddress;
  message.functionSignature = functionSignature;

  const dataToSign = JSON.stringify({
    types: {
      EIP712Domain: domainType,
      MetaTransaction: metaTransactionType,
    },
    domain: domainData,
    primaryType: "MetaTransaction",
    message: message,
  });
  console.log(domainData);
  console.log(userAddress, dataToSign);

  return new Promise((resolve, reject) => {

    web3.eth.currentProvider.send(
      {
        jsonrpc: "2.0",
        id: 999999999999,
        method: "eth_signTypedData_v4",
        params: [userAddress, dataToSign],
      },
      async function (error, response) {

        if (error) {
          console.log('sign error', error);
        } else {
          console.info(`User signature is ${response.result}`);

          let { r, s, v } = getSignatureParameters(response.result);

          // logging output
          console.log(userAddress);
          console.log(JSON.stringify(message));
          console.log(message);
          console.log(getSignatureParameters(response.result));

          const recovered = sigUtil.recoverTypedSignature_v4({
            data: JSON.parse(dataToSign),
            sig: response.result,
          });
          console.log(`Recovered ${recovered}`);

          contract.methods
            .executeMetaTransaction(userAddress, functionSignature, r, s, v)
            .send({
              from: userAddress,
            }).on('transactionHash', (hash) => resolve(`executeMetaTransaction transactionHash ${hash}`))
            .on('error', (err) => reject(err));
        }
      }
    );
  });
};

const getSignatureParameters = (signature) => {
  if (!web3.utils.isHexStrict(signature)) {
    throw new Error(
      'Given value "'.concat(signature, '" is not a valid hex string.')
    );
  }
  var r = signature.slice(0, 66);
  var s = "0x".concat(signature.slice(66, 130));
  var v = "0x".concat(signature.slice(130, 132));
  v = web3.utils.hexToNumber(v);
  if (![27, 28].includes(v)) v += 27;
  return {
    r: r,
    s: s,
    v: v,
  };
};