// Mumbai config
/* module.exports = {
  NETWORKD_ID: '5',
  MATIC_PROVIDER_RPC: 'https://rpc-mumbai.matic.today',
  MATIC_PROVIDER_WS: 'wss://ws-mumbai.matic.today', // This is the MATIC testnet RPC
  PARENT_PROVIDER: 'https://goerli.infura.io/v3/70645f042c3a409599c60f96f6dd9fbc', // This is the Goerli testnet RPC
  FROM_ADDRESS: '<->', // Your address
  MAINNET_SPN_TOKEN: '0xF66238bF9A57bd27b41939B6989C4b4809ddb935', // Goerli SPN
  MATIC_SPN_TOKEN: '0x75433132D9dED99A4810CE4A96f9B7a2a1d138c9', // Mumbai SPN
  MATIC_SPN_STAKING_CONTRACT: '0x4728fb23Fe09A815c8B617bAeF0Fc5B18A018e27', // Mumbai Staking
  DUMMY_PARENT_TOKEN: '0x655F2166b0709cd575202630952D71E2bB0d61Af',
  DUMMY_CHILD_TOKEN: '0xfe4F5145f6e09952a5ba9e956ED0C25e3Fa4c7F1',
  BICONOMY_API_KEY: '<->',

  BURN_HASH: '',
} */

// Mainnet config
module.exports = {
  NETWORKD_ID: 137,
  MATIC_PROVIDER_RPC: 'https://rpc-mainnet.matic.network',
  MATIC_PROVIDER_WS: 'wss://ws-mainnet.matic.network', // This is the MATIC testnet RPC
  PARENT_PROVIDER: 'https://mainnet.infura.io/v3/70645f042c3a409599c60f96f6dd9fbc', // This is the Mainnet testnet RPC
  FROM_ADDRESS: '0x63545eD8189fe96762Ec32f151e6A51E6B36F312', // Your address
  MAINNET_SPN_TOKEN: '0x...', // Mainnet SPN
  MATIC_SPN_TOKEN: '0x3Cd92Be3Be24daf6D03c46863f868F82D74905bA', // Matic mainnet SPN
  MATIC_SPN_STAKING_CONTRACT: '0x016ba77341b2F549Cb06E499AD04247F95365f51', // Matic mainnet Staking
  BICONOMY_API_KEY: '--',

  BURN_HASH: '',
}