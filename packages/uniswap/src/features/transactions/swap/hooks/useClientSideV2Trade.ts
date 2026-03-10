/**
 * useClientSideV2Trade
 *
 * AsterSwap: computes V2 quotes entirely client-side by reading on-chain reserves.
 * Used on BSC where Uniswap's routing API doesn't know about our custom contracts.
 *
 * Factory address is overridden in apps/web/src/hooks/useV2Pairs.ts to use
 * AsterSwap's deployed factory: 0xe8Cb8917e829ED4b22f530cAdae7A30476C36bF0
 */
import { type Currency, TradeType } from '@uniswap/sdk-core'
import { type Pair, Trade } from '@uniswap/v2-sdk'
import { useMemo } from 'react'
import { type TradeWithStatus, type UseTradeArgs } from 'uniswap/src/features/transactions/swap/types/trade'

export const PAIR_STATE_LOADING = 0
export const PAIR_STATE_NOT_EXISTS = 1
export const PAIR_STATE_EXISTS = 2
export const PAIR_STATE_INVALID = 3

const NO_ROUTE: TradeWithStatus = {
  isLoading: false,
  isFetching: false,
  trade: null,
  indicativeTrade: undefined,
  isIndicativeLoading: false,
  error: null,
  gasEstimate: undefined,
}

const LOADING: TradeWithStatus = {
  isLoading: true,
  isFetching: true,
  trade: null,
  indicativeTrade: undefined,
  isIndicativeLoading: false,
  error: null,
  gasEstimate: undefined,
}

/**
 * useV2PairsForTrade is injected by the web app layer (dependency injection)
 * to avoid a circular import. The web app passes useV2Pair via createUseClientSideV2Trade.
 */
export function createUseClientSideV2Trade(
  useV2Pair: (tokenA?: Currency | null, tokenB?: Currency | null) => [number, Pair | null],
  // ClassicTrade constructor — injected to avoid circular import
  buildClassicTrade: (v2Trade: Trade<Currency, Currency, TradeType>) => TradeWithStatus['trade'],
) {
  return function useClientSideV2Trade(params: UseTradeArgs): TradeWithStatus {
    const { amountSpecified, otherCurrency, tradeType } = params

    const currencyIn = tradeType === TradeType.EXACT_INPUT ? amountSpecified?.currency : otherCurrency
    const currencyOut = tradeType === TradeType.EXACT_INPUT ? otherCurrency : amountSpecified?.currency

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [pairState, pair] = useV2Pair(currencyIn, currencyOut)

    return useMemo(() => {
      if (!amountSpecified || !currencyIn || !currencyOut) {
        return NO_ROUTE
      }
      if (pairState === PAIR_STATE_LOADING) {
        return LOADING
      }
      if (!pair || pairState === PAIR_STATE_NOT_EXISTS || pairState === PAIR_STATE_INVALID) {
        return NO_ROUTE
      }

      try {
        let v2Trade: Trade<Currency, Currency, TradeType> | undefined

        if (tradeType === TradeType.EXACT_INPUT) {
          const results = Trade.bestTradeExactIn([pair], amountSpecified, currencyOut, {
            maxHops: 1,
            maxNumResults: 1,
          })
          v2Trade = results[0]
        } else {
          const results = Trade.bestTradeExactOut([pair], currencyIn, amountSpecified, {
            maxHops: 1,
            maxNumResults: 1,
          })
          v2Trade = results[0]
        }

        if (!v2Trade) {
          return NO_ROUTE
        }

        const trade = buildClassicTrade(v2Trade)
        return {
          isLoading: false,
          isFetching: false,
          trade,
          indicativeTrade: undefined,
          isIndicativeLoading: false,
          error: null,
          gasEstimate: undefined,
        }
      } catch {
        return NO_ROUTE
      }
    }, [amountSpecified, currencyIn, currencyOut, pair, pairState, tradeType, buildClassicTrade])
  }
}
