import Biconomy from "@biconomy/mexa";
import { CHILD_TOKEN_ABI } from "../constants";

const bn = require('bn.js')
const Web3 = require("web3");
let sigUtil = require("eth-sig-util");

const config = require('./config')


const from = '0xFCbCCd4d846a59535f1a3eA349b9bC07e800Db4B';

const domainType = [
  { name: "name", type: "string" },
  { name: "version", type: "string" },
  { name: "chainId", type: "uint256" },
  { name: "verifyingContract", type: "address" },
];

const metaTransactionType = [
  { name: "nonce", type: "uint256" },
  { name: "from", type: "address" },
  { name: "functionSignature", type: "bytes" },
];

const SCALING_FACTOR = new bn(10).pow(new bn(18));
const amount = new bn(1).mul(SCALING_FACTOR);

window.ethereum.enable().catch((error) => {
  console.log(error);
});
const web3 = new Web3(window.ethereum);

console.log(web3.currentProvider);

const biconomy = new Biconomy(new Web3.providers.HttpProvider(config.MATIC_PROVIDER), {
  apiKey: 'oOL-zY445.5ae84dd0-7a95-4e6d-ad4d-f655261d8960', //'yhgD9_k2A.a88e1bb4-056c-4bb0-ac52-5d917ce8c7bc',
  debug: true,
});
const biconomyWeb3 = new Web3(biconomy);

biconomy
  .onEvent(biconomy.READY, () => {
    // Initialize your dapp here like getting user accounts etc
    console.log("Mexa is Ready");
  })
  .onEvent(biconomy.ERROR, (error, message) => {
    // Handle error while initializing mexa
    console.error(error);
  });


export const initMatic = async () => {
  const MaticPOSClient = require("@maticnetwork/maticjs").MaticPOSClient;

  return new MaticPOSClient({
    maticProvider: config.MATIC_PROVIDER,
    parentProvider: web3.currentProvider,
    rootChain: config.ROOTCHAIN_ADDRESS,
    posRootChainManager: config.POS_ROOT_CHAIN_MANAGER_ADDRESS,
  });

};

export const approve = async () => {
  const maticPOSClient = await initMatic();

  await maticPOSClient
    .approveERC20ForDeposit('0x0D2be3F144ca1f7c106F586eDA2Ab2F8921f89E6', amount, { from, onTransactionHash: (hash) => console.log('----onTransactionHash', hash) })
    .then(async (logs) => {
      console.log(logs);
    });
}

export const deposit = async () => {
  const maticPOSClient = await initMatic();

  await maticPOSClient.depositERC20ForUser('0x0D2be3F144ca1f7c106F586eDA2Ab2F8921f89E6', from, amount, { from, gasPrice: '10000000000' })
    .then(async (logs) => {
      console.log("Deposit: " + logs.transactionHash);
    });
}


export const getContractDetails = async (web3, pAddress) => {
  const abi = CHILD_TOKEN_ABI;
  const contract = new web3.eth.Contract(abi, pAddress);
  const tokenName = await contract.methods.name().call();
  console.log(tokenName);
  let domainData = {
    name: tokenName,
    version: "1",
    chainId: "3", // Ropsten
    verifyingContract: pAddress,
  };
  return { contract, domainData };
};

export const transfer = async () => {
  const pAmount = '0.01';
  const pRecipient = '0x63545eD8189fe96762Ec32f151e6A51E6B36F312';
  const tokenAddress = '0xefa67A7B52972eF721a6D6227A3C356a62CcBa58'; // DUMMY

  const detail = await getContractDetails(biconomyWeb3, tokenAddress);
  const amount = web3.utils.toWei(pAmount + "");
  console.log('toWei', amount);
  let functionSignature = detail.contract.methods
    .transfer(pRecipient, amount)
    .encodeABI();
  console.log('functionSignature', functionSignature);
  await executeMetaTransaction(functionSignature, detail.contract, detail.domainData)
    .then(log => console.log('executeMetaTransaction-', log))
    .catch(err => console.log('err executeMetaTransaction', err));
};

export const burn = async () => {
  const tokenAddress = '0xefa67A7B52972eF721a6D6227A3C356a62CcBa58'; // DUMMY
  const detail = await getContractDetails(biconomyWeb3, tokenAddress); // DUMMY ChildTokenAddress
  const amount = web3.utils.toWei('0.05' + "");
  let functionSignature = detail.contract.methods.withdraw(amount).encodeABI();
  console.log('functionSignature', functionSignature);
  executeMetaTransaction(functionSignature, detail.contract, detail.domainData);
};

const executeMetaTransaction = async (
  functionSignature,
  contract,
  domainData
) => {
  let userAddress = from;
  let nonce = await contract.methods.getNonce(userAddress).call();

  let message = {};
  message.nonce = parseInt(nonce);
  message.from = userAddress;
  message.functionSignature = functionSignature;
  message.network = "Interact with Matic Network";

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
            .on('error', (err) => reject(`executeMetaTransaction error ${err}`));
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