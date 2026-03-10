import { Currency } from '@uniswap/sdk-core'
import { useMemo } from 'react'
import { UniverseChainId } from 'uniswap/src/features/chains/types'
import { parseQuoteCurrencies } from 'uniswap/src/features/transactions/swap/hooks/useTrade/parseQuoteCurrencies'
import { useIndicativeTradeQuery } from 'uniswap/src/features/transactions/swap/hooks/useTrade/useIndicativeTradeQuery'
import { useTradeQuery } from 'uniswap/src/features/transactions/swap/hooks/useTrade/useTradeQuery'
import type { TradeWithGasEstimates } from 'uniswap/src/features/transactions/swap/services/tradeService/tradeService'
import { TradeWithStatus, UseTradeArgs } from 'uniswap/src/features/transactions/swap/types/trade'

// error strings hardcoded in @uniswap/unified-routing-api
// https://github.com/Uniswap/unified-routing-api/blob/020ea371a00d4cc25ce9f9906479b00a43c65f2c/lib/util/errors.ts#L4
export const SWAP_QUOTE_ERROR = 'QUOTE_ERROR'

export const API_RATE_LIMIT_ERROR = 'TOO_MANY_REQUESTS'

/**
 * AsterSwap: chains that use client-side V2 routing instead of Uniswap's trading API.
 * The API doesn't know about our custom V2 contracts, so we compute quotes locally.
 * The actual client-side hook is injected via setClientSideV2TradeHook() from the web app
 * to avoid circular imports between packages/uniswap and apps/web.
 */
const CLIENT_SIDE_ROUTING_CHAINS: Set<number> = new Set([UniverseChainId.Bnb])

type UseTradeHook = (params: UseTradeArgs) => TradeWithStatus

let clientSideV2TradeHook: UseTradeHook | null = null

/** Called once at app startup from apps/web to inject the client-side V2 hook */
export function setClientSideV2TradeHook(hook: UseTradeHook): void {
  clientSideV2TradeHook = hook
}

function isClientSideChain(chainId?: number): boolean {
  return chainId !== undefined && CLIENT_SIDE_ROUTING_CHAINS.has(chainId)
}

export function useTrade(params: UseTradeArgs): TradeWithStatus {
  const { currencyIn, currencyOut } = parseQuoteCurrencies(params)
  const chainId = currencyIn?.chainId ?? currencyOut?.chainId
  const useClientSide = isClientSideChain(chainId) && clientSideV2TradeHook !== null

  // Skip API queries when using client-side routing (hook calls must be unconditional)
  const {
    error,
    data,
    isLoading: queryIsLoading,
    isFetching,
  } = useTradeQuery(useClientSide ? { ...params, skip: true } : params)
  const isLoading = !useClientSide && ((params.amountSpecified && params.isDebouncing) || queryIsLoading)
  const indicative = useIndicativeTradeQuery(useClientSide ? { ...params, skip: true } : params)

  // AsterSwap: delegate to injected client-side hook for BSC
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const clientSideResult = useClientSide && clientSideV2TradeHook ? clientSideV2TradeHook(params) : null

  return useMemo(() => {
    // AsterSwap: on BSC, return the client-side V2 result directly
    if (clientSideResult !== null) {
      return clientSideResult
    }
    return parseTradeResult({
      data,
      currencyIn,
      currencyOut,
      isLoading,
      isFetching,
      indicative,
      error,
      isDebouncing: params.isDebouncing,
    })
  }, [clientSideResult, currencyIn, currencyOut, data, error, indicative, isFetching, isLoading, params.isDebouncing])
}

function parseTradeResult(input: {
  data?: TradeWithGasEstimates
  currencyIn?: Currency
  currencyOut?: Currency
  isLoading: boolean
  isFetching: boolean
  indicative: ReturnType<typeof useIndicativeTradeQuery>
  error: Error | null
  isDebouncing?: boolean
}): TradeWithStatus {
  const { data, currencyIn, currencyOut, isLoading, isFetching, indicative, error, isDebouncing } = input
  if (!data?.trade || !currencyIn || !currencyOut) {
    return {
      isLoading: Boolean(isLoading || isDebouncing),
      isFetching,
      trade: null,
      indicativeTrade: isLoading ? indicative.trade : undefined,
      isIndicativeLoading: indicative.isLoading,
      error,
      gasEstimate: data?.gasEstimate,
    }
  }

  // If `transformTradingApiResponseToTrade` returns a `null` trade, it means we have a non-null quote, but no routes.
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (data.trade === null) {
    return {
      isLoading,
      isFetching,
      trade: null,
      indicativeTrade: undefined, // We don't want to show the indicative trade if there is no completable trade
      isIndicativeLoading: false,
      error: new Error('Unable to validate trade'),
      gasEstimate: data.gasEstimate,
    }
  }

  return {
    isLoading: isDebouncing || isLoading,
    isFetching,
    trade: data.trade,
    indicativeTrade: indicative.trade,
    isIndicativeLoading: indicative.isLoading,
    error,
    gasEstimate: data.gasEstimate,
  }
}
