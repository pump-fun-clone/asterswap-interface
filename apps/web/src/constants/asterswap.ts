/**
 * AsterSwap contract addresses on BSC Mainnet (chainId: 56)
 *
 * Factory deployed at: https://bscscan.com/address/0xe8Cb8917e829ED4b22f530cAdae7A30476C36bF0
 * Router deployed at:  https://bscscan.com/address/0xd4EB323a3C2279434A6b3e4b3B0370008D3BA1f9
 */

export const ASTERSWAP_V2_FACTORY_ADDRESSES: { [chainId: number]: string } = {
  56: '0xe8Cb8917e829ED4b22f530cAdae7A30476C36bF0', // BSC Mainnet
}

export const ASTERSWAP_V2_ROUTER_ADDRESSES: { [chainId: number]: string } = {
  56: '0xd4EB323a3C2279434A6b3e4b3B0370008D3BA1f9', // BSC Mainnet
}

export const ASTERSWAP_SUPPORTED_CHAIN_IDS = [56]

export const ASTERSWAP_DEFAULT_CHAIN_ID = 56

export const APP_NAME = 'AsterSwap'
export const APP_URL = 'https://app.asterswap.io'
