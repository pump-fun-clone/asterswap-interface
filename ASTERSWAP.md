# AsterSwap Interface

Fork of [Uniswap/interface](https://github.com/Uniswap/interface) configured for **AsterSwap** on BSC Mainnet.

## Deployed Contracts (BSC Mainnet, chainId: 56)

| Contract | Address | BSCScan |
|---|---|---|
| UniswapV2Factory | `0xe8Cb8917e829ED4b22f530cAdae7A30476C36bF0` | [View](https://bscscan.com/address/0xe8Cb8917e829ED4b22f530cAdae7A30476C36bF0#code) |
| UniswapV2Router02 | `0xd4EB323a3C2279434A6b3e4b3B0370008D3BA1f9` | [View](https://bscscan.com/address/0xd4EB323a3C2279434A6b3e4b3B0370008D3BA1f9#code) |
| WBNB | `0xBb4cdB9CBd36B01bd1cBaebF2de08d9173BC095B` | [View](https://bscscan.com/address/0xBb4cdB9CBd36B01bd1cBaebF2de08d9173BC095B) |

## Changes from upstream Uniswap interface

| File | Change |
|---|---|
| `apps/web/src/constants/asterswap.ts` | **New** — AsterSwap V2 factory & router addresses, app constants |
| `apps/web/src/hooks/useV2Pairs.ts` | Override V2 factory address on BSC to use AsterSwap's deployment |
| `apps/web/src/hooks/useNetworkSupportsV2.ts` | Include BSC (chainId 56) in supported V2 chains |
| `apps/web/src/pages/Swap/index.tsx` | Default chain set to BSC (`UniverseChainId.Bnb`) |
| `apps/web/src/state/multichain/types.ts` | Default chain context set to BSC |
| `apps/web/src/components/Web3Provider/walletConnect.ts` | App name → AsterSwap |
| `apps/web/src/components/Web3Provider/wagmiConfig.ts` | App name → AsterSwap |
| `apps/web/index.html` | Page title → AsterSwap |
| `apps/web/.env.asterswap` | **New** — environment variable template |

## Getting Started

```bash
# Install dependencies
bun install

# Copy env file
cp apps/web/.env.asterswap apps/web/.env
# Fill in your INFURA_KEY and WALLETCONNECT_PROJECT_ID

# Start dev server
bun run web
```

## TODO

- [ ] Replace Uniswap logo/favicon with AsterSwap branding assets
- [ ] Add AsterSwap token list (replace Uniswap default list)
- [ ] Configure WalletConnect project ID
- [ ] Set up production RPC (QuickNode or own BSC node)
- [ ] Remove/disable Uniswap-specific features (UniswapX, Unichain, etc.)
- [ ] Set up own routing backend or enable client-side V2 routing only
