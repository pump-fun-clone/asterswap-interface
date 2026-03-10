/**
 * AsterSwap: client-side V2 trade hook, wired with:
 * - useV2Pair (reads on-chain reserves from AsterSwap's factory on BSC)
 * - ClassicTrade constructor (from the web app routing types)
 */
import { type Currency, TradeType } from '@uniswap/sdk-core'
import { type Pair, type Trade } from '@uniswap/v2-sdk'
import { createUseClientSideV2Trade } from 'uniswap/src/features/transactions/swap/hooks/useClientSideV2Trade'
import { useV2Pair } from '~/hooks/useV2Pairs'
import { ApproveInfo, ClassicTrade, QuoteMethod } from '~/state/routing/types'

function buildClassicTrade(v2Trade: Trade<Currency, Currency, TradeType>) {
  return new ClassicTrade({
    v2Routes: [
      {
        routev2: v2Trade.route,
        inputAmount: v2Trade.inputAmount,
        outputAmount: v2Trade.outputAmount,
      },
    ],
    v3Routes: [],
    tradeType: v2Trade.tradeType,
    quoteMethod: QuoteMethod.CLIENT_SIDE_FALLBACK,
    approveInfo: { needsApprove: false } as ApproveInfo,
    gasUseEstimate: 150_000,
    gasUseEstimateUSD: 0.05,
  })
}

function useV2PairAdapter(tokenA?: Currency | null, tokenB?: Currency | null): [number, Pair | null] {
  return useV2Pair(tokenA ?? undefined, tokenB ?? undefined)
}

export const useClientSideV2Trade = createUseClientSideV2Trade(useV2PairAdapter, buildClassicTrade)
