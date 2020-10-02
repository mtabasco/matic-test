// Mumbai config
module.exports = {
  NETWORKD_ID: 80001,
  MATIC_PROVIDER_RPC: 'https://rpc-mumbai.matic.today',
  MATIC_PROVIDER_WS: 'wss://ws-mumbai.matic.today', // This is the MATIC testnet RPC
  PARENT_PROVIDER: 'https://goerli.infura.io/v3/70645f042c3a409599c60f96f6dd9fbc', // This is the Goerli testnet RPC
  FROM_ADDRESS: '--', // Your address
  MAINNET_SPN_TOKEN: '0xF66238bF9A57bd27b41939B6989C4b4809ddb935', // Goerli SPN
  MATIC_SPN_TOKEN: '0x8174Ab11EEd70297311f7318a71d9e9f48466Fff', // Mumbai SPN
  MATIC_SPN_STAKING_CONTRACT: '0xe8BaDb9383b5eA6C465217EB8B477E03bf60C66f', // Mumbai Staking
  BICONOMY_API_KEY: '--',

  BURN_HASH: '--',
}

// Mainnet config
/* module.exports = {
  NETWORKD_ID: 137,
  MATIC_PROVIDER_RPC: 'https://rpc-mainnet.matic.network',
  MATIC_PROVIDER_WS: 'wss://ws-mainnet.matic.network', // This is the MATIC testnet RPC
  PARENT_PROVIDER: 'https://mainnet.infura.io/v3/70645f042c3a409599c60f96f6dd9fbc', // This is the Mainnet testnet RPC
  FROM_ADDRESS: '-', // Your address
  MAINNET_SPN_TOKEN: '0x20f7a3ddf244dc9299975b4da1c39f8d5d75f05a', // Mainnet SPN
  MATIC_SPN_TOKEN: '0x3Cd92Be3Be24daf6D03c46863f868F82D74905bA', // Matic mainnet SPN
  MATIC_SPN_STAKING_CONTRACT: '0xb3FAf67dfC7f7a5CFd92Db75214DD162c7bcFEd8', // Matic mainnet Staking
  BICONOMY_API_KEY: '-',

  BURN_HASH: '--',
} */