import ROOT_CHAIN_MANAGER from "./artifacts/RootChainManager.json";
import CHILD_CHAIN_MANAGER from "./artifacts/ChildChainManager.json";
import CHILD_TOKEN from "./artifacts/ChildToken.json";
import PLATFORM_SPN from "./artifacts/SapienPlatformSPN.json";
import STAKING_CONTRACT from "./artifacts/SapienStaking.json";
import ROOT_TOKEN from "./artifacts/DummyToken.json";
import CHILD_ETH_TOKEN from "./artifacts/MaticWETH.json";
import ERC20 from "./abi/ERC20.json";
import { TOKEN_LIST } from "./TokenAddress.js";
import CONTRACT_ADDRESS from "./ContractAddress.json";

export const ROOT_PROVIDER = CONTRACT_ADDRESS.root.RPC;
export const CHILD_PROVIDER = CONTRACT_ADDRESS.child.RPC;

export const ERC20_ABI = ERC20;
export const ROOT_CHAIN_MANAGER_ABI = ROOT_CHAIN_MANAGER.abi;
export const CHILD_CHAIN_MANAGER_ABI = CHILD_CHAIN_MANAGER.abi;
export const CHILD_TOKEN_ABI = CHILD_TOKEN.abi;
export const PLATFORM_SPN_ABI = PLATFORM_SPN.abi;
export const STAKING_CONTRACT_ABI = STAKING_CONTRACT.abi;
export const ROOT_TOKEN_ABI = ROOT_TOKEN.abi;
export const CHILD_ETH_TOKEN_ABI = CHILD_ETH_TOKEN.abi;

export const ROOT_CHAIN_MANAGER_ADDRESS =
  CONTRACT_ADDRESS.root.POSRootChainManager;
export const CHILD_CHAIN_MANAGER_ADDRESS =
  CONTRACT_ADDRESS.child.ChildChainManager;
export const PLASMA_ROOT_CHAIN_ADDRESS = CONTRACT_ADDRESS.root.PlasmaRootChain;
export const ROOT_DUMMY_TOKEN_ADDRESS = CONTRACT_ADDRESS.root.DummyToken;
export const CHILD_DUMMY_TOKEN_ADDRESS = CONTRACT_ADDRESS.child.DummyToken;
export const ROOT_MANA_ADDRESS = CONTRACT_ADDRESS.root.MANA;
export const CHILD_MANA_ADDRESS = CONTRACT_ADDRESS.child.MANA;
export const ROOT_ETH_TOKEN_ADDRESS = CONTRACT_ADDRESS.root.WETH;
export const CHILD_ETH_TOKEN_ADDRESS = CONTRACT_ADDRESS.child.WETH;
export { TOKEN_LIST };
