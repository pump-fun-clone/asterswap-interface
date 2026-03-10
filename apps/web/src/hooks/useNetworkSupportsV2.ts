import { V2_ROUTER_ADDRESSES } from '@uniswap/sdk-core'
import { ASTERSWAP_V2_ROUTER_ADDRESSES } from '~/constants/asterswap'
import { useAccount } from '~/hooks/useAccount'

/**
 * Chains that support V2 pools — merges the SDK defaults with
 * AsterSwap's custom deployments (e.g. BSC mainnet, chainId 56).
 */
export const SUPPORTED_V2POOL_CHAIN_IDS = Array.from(
  new Set([
    ...Object.keys(V2_ROUTER_ADDRESSES).map((chainId) => parseInt(chainId)),
    ...Object.keys(ASTERSWAP_V2_ROUTER_ADDRESSES).map((chainId) => parseInt(chainId)),
  ]),
)

export function useNetworkSupportsV2() {
  const { chainId } = useAccount()

  return chainId && SUPPORTED_V2POOL_CHAIN_IDS.includes(chainId)
}
