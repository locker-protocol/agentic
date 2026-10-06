# The commands, beside MetaMask Agent Wallet's

Why this page exists: a recipe, a skill or a shell script written for one command line should read in the other. We kept MetaMask's vocabulary and its flag names wherever they fit, so that moving across is a rename and not a rewrite.

The `mm` column was read in MetaMask's own command reference, [docs.metamask.io/agent-wallet/reference/commands](https://docs.metamask.io/agent-wallet/reference/commands/), on 2026-09-29. The `lpa` column is this product. Nothing of theirs is copied into ours.

## Setting up

| MetaMask | Locker | Note |
|---|---|---|
| | `lpa setup [--paper]` | The whole way in, nine steps taken up where they stopped: this computer, the model, the vault account, some funds, the key, the limits, the mandate, the service, the daily pilot on paper. Each step is a command of its own. |
| `mm init` | `lpa init [--days 180]` | Ours is the QR ceremony with Locker Vault: the phone shows its accounts, the page reads them through the webcam, the phone signs the approval of the agent key. |
| `mm doctor` | `lpa doctor` | Checks the setup, signs nothing. |
| `mm login` / `mm reset` | `lpa unlock` / `lpa lock` | There is no account to log into: `lpa unlock` opens the sealed agent key for the guardian with a password typed by the person. |
| `mm reset` | `lpa reset` | Wipes the local state of the computer: settings, sealed agent key, policy, journal, paper account, copies, hyperkeel session. The program stays installed. |

## The wallet

| MetaMask | Locker | Note |
|---|---|---|
| `mm wallet address` | `lpa wallet address` | The Locker Vault account the agent trades for. |
| `mm wallet balance` | `lpa wallet balances` | ETH and USDC on Arbitrum, margin and spot on Hyperliquid, per dex. |

## Perps, reading

| MetaMask | Locker | Note |
|---|---|---|
| `mm perps list-venues` | `lpa perps venues` | One venue, `hyperliquid`. `--venue` is accepted so that recipes carry over. |
| `mm perps markets` | `lpa perps markets [--dex <name> \| --all-dexes] [--search <text>] [--limit <n>]` | Sorted by 24 hour volume, halted markets marked. |
| `mm perps balance [--dex] [--all-dexes]` | `lpa perps balance [--dex <name> \| --all-dexes] [--address <0x...>]` | Equity and withdrawable margin, per dex. |
| `mm perps positions [--dex] [--all-dexes]` | `lpa perps positions [--dex <name> \| --all-dexes] [--address <0x...>]` | |
| `mm perps orders` | `lpa perps orders [--dex <name> \| --all-dexes] [--address <0x...>]` | Triggers included. |
| `mm perps dexs` | (no separate command) | The HIP-3 dexes appear through `--dex` and `--all-dexes` on the reads. |
| `mm perps quote --symbol --side --size --leverage [--type] [--limit-px]` | `lpa perps quote --symbol <S> --side long\|short --size <base> --leverage <n> [--type limit --limit-px <p>] [--max-slippage-bps <n>] [--tp <p>] [--sl <p>]` | The quote names the entry price and the worst accepted price, the fees as one total, the liquidation estimate, the risk to reward ratio, and the 10 USD minimum. |

## Perps, ordering

| MetaMask | Locker | Note |
|---|---|---|
| `mm perps open ... [--dry-run] [--yes]` | `lpa perps open ... [--dry-run] [--yes] [--paper]` | Same flags. `--dry-run` is the quote plus the policy check, with nothing signed. Without a terminal and without `--yes`, the answer is `CONFIRMATION_REQUIRED`. |
| `mm perps close [--symbol] [--size] [--all] [--max-slippage-bps]` | `lpa perps close (--symbol <S> [--size <base>] \| --all) [--max-slippage-bps <n>] [--dry-run] [--yes] [--paper]` | Reduce-only, at market. Always allowed by the policy. |
| `mm perps modify --symbol [--leverage] [--tp] [--sl]` | `lpa perps modify --symbol <S> [--leverage <n>] [--tp <p>] [--sl <p>] [--yes]` | Leverage, or a take-profit and a stop-loss on an open position. |
| `mm perps cancel --order-id [--symbol]` | `lpa perps cancel --symbol <S> --order-id <oid> [--yes]` | We ask for the symbol; MetaMask looks it up when it is left out. Neither has a `--all`. |

## Perps, moving funds

Every one of these is signed by Locker Vault on the phone. The agent key cannot sign them, and Hyperliquid would refuse it if it tried.

| MetaMask | Locker | Note |
|---|---|---|
| `mm perps deposit --amount [--source-chain-id]` | `lpa perps deposit --amount <usdc> [--source-chain-id 42161] [--yes]` | USDC from Arbitrum by default, same as theirs. |
| `mm perps withdraw --amount [--destination]` | `lpa perps withdraw --amount <usdc> [--destination <0x...>] [--yes]` | `withdraw3`. Hyperliquid charges 1 USDC for a withdrawal. |
| `mm perps transfer --amount --direction spot-to-perp\|perp-to-spot` | `lpa perps transfer --amount <usdc> --to-dex <name\|main> [--from-dex <name\|main>] [--yes]` | Ours moves margin between the main dex and a HIP-3 dex. |
| (absent) | `lpa agent revoke` | Retire the agent now, signed by Locker Vault. |

## What we have and they do not

| Locker | What it is |
|---|---|
| `lpa paper init \| status \| on \| off` | A paper account that fills on Hyperliquid's real book with the real fees, before any key and any vault exists. |
| `lpa paper record`, `lpa paper replay --strategy <file.json>` | Record the market into a local tape, then replay a strategy written as JSON on it, with the win rate, its 95 % lower bound and the costs. |
| `lpa policy show \| set` | The limits every order is checked against, by the command and again by the guardian. See [`security-model.md`](security-model.md). |
| `lpa journal [--since 24h]` | What was done, what was refused, what was paid, fees as one total. |
| `lpa perps regime --symbol <S>`, `lpa perps ranges` | How a market is trading, and the markets in a range now with their support and resistance. |
| `lpa copy start \| stop \| status \| resume` | Copy a trader, in the background, inside the guardian: on paper by default (nothing is signed), or `--live` on the real account, signed by the agent key under a mandate signed on the phone that names the trader. Four sizings (`proportional` with a mandatory bound, `mirror`, `percent`, `fixed`), and the trader's executions read back after a dropped feed. MetaMask's copying is a plugin; see [`COMPARISON.md`](../COMPARISON.md). |
| `lpa mandate sign \| show \| revoke` | The agent's limits, signed once on the phone and checked by the guardian before every opening. |
| `lpa plugins install \| list \| inspect \| remove` | Plugins that run out of process, under Node's permission model, reaching the wallet only through the capabilities they declared; none of them signs for the real account. MetaMask's plugins run in its own process. |
| `lpa hyperkeel ...` | Market data and alerts from hyperkeel.com, once you connect. Optional. |
| `lpa service ...`, `lpa console` | Run the guardian around the clock as a service of the system, with a console behind its own password. |
| `lpa config` | A local settings page: assistant, limits, paper trading, account, hyperkeel. |
| `lpa pilot start \| stop \| pause \| resume \| status \| ask \| notes \| rules` | An agent that trades on its own, inside the guardian, on paper first and live only under a mandate signed on the phone that allows it; bounded deliberations, a memory you correct, messages it reads at its next step. |
| `lpa live` | A page of everything the computer's agents do and think, as it happens, with the record behind it (`lpa store status \| prune \| export \| backup`). |
| `lpa panic` | Everything stops now: pilots, copies, then the key; closes nothing, prints how to revoke the agent. |
| `lpa` alone | An interactive session: the same commands as `/` lines with Tab completion, live views, and an assistant on the model of your choice. |

## What they have and we do not

MetaMask Agent Wallet is a general wallet: it has swaps, token sends, prediction markets, earn vaults, transaction signing, plugins and a command for each. `lpa` does one thing, Hyperliquid perps, and everything that is not a perps order goes through Locker Vault on the phone. If you need a wallet that signs arbitrary EVM transactions from a script, this is not it.

## The guards both sides share

Taken from our own extension and kept the same here: a 10 USD minimum per order, a margin guard on every dex with both figures named, an order refused rather than parked on a halted market, the size rounded to the market's `szDecimals` and the price rounded to its tick.
