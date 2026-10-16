# Locker Protocol Agentic

**Your private key is nowhere: not on our servers, not on the agent's machine, not with anyone.**

The agent trades. It holds nothing.

- **Where the key is:** the account's private key stays in Locker Vault, an offline app on a phone or tablet. This computer only holds an agent key, sealed under a password, that expires on its own (six months by default, the longest Hyperliquid allows).
- **Who can withdraw:** only the vault, by a QR code a person scans and signs. Hyperliquid refuses the agent key every withdrawal and every send; the one movement of funds it accepts from that key is a deposit into a Hyperliquid vault, which lpa never signs (measured on mainnet, 2026-09-28).
- **What goes where:** orders and reads go to Hyperliquid, deposits and balances to Arbitrum nodes, and nothing else unless you turn it on (the list is below). No server of ours, no account, no telemetry.

**Documentation:** [doc.lockerprotocol.com/agent-wallet](https://doc.lockerprotocol.com/agent-wallet/agent): install, the setup in steps, how it trades and every command. **Website:** [hyperagentictrader.com](https://hyperagentictrader.com).

Locker Protocol Agentic is an agent wallet for Hyperliquid perps: the `lpa` command for people and for AI agents, an MCP server, and two SDK packages. It comes with a simulation account on the real order book, a local policy checked before every order, and every movement of funds signed on the phone.

This repository is its home: the documentation, the changelog, the release log with the SHA-256 of every tarball, and the issue tracker. The four npm packages point their `repository` field here. The source is not published.

## How it works

Three places, and one rule: the key that owns the money never leaves the phone.

```text
  PHONE (offline)              THIS COMPUTER                              HYPERLIQUID
 +--------------------+      +-----------------------------------+      +----------------+
 | Locker Vault       |      | lpa   <- you, a script, or an AI  |      |                |
 |                    |      |  |       agent (shell or MCP)     |      |  order book    |
 | holds the ACCOUNT  |      |  |                                |      |                |
 | key; it never      |  QR  |  |  1. quote on the live book     |      |  your account  |
 | leaves the phone   |<---->|  |  2. local policy               |      |                |
 |                    |codes |  |  3. your go                    |      |                |
 | signs: the agent's |      |  v                                |      |                |
 | approval, deposits,|      | guardian (background process)     |      |                |
 | withdrawals, dex   |      |   holds the AGENT key in memory,  |----->|  orders,       |
 | transfers, revoke  |      |   checks the policy again, signs  |      |  cancels,      |
 +--------------------+      |   trading actions only            |      |  leverage,     |
                             +-----------------------------------+      |  TP/SL         |
                                                                        +----------------+
```

- **Locker Vault** is an app on a phone or tablet that stays offline. It holds the account's key and signs by QR code: the computer shows a request, the phone's camera reads it, the person reads on the phone what it does and signs, the phone shows the signature, the computer's webcam reads it back.
- **The agent key** is made on the computer by `lpa init`, approved once by the vault, sealed on disk under a password. Hyperliquid lets it trade, and refuses it every withdrawal and every send. It expires on its own.
- **The guardian** is a background process that `lpa unlock` starts. It holds the agent key in memory, checks every order against the policy a second time, and against the mandate once you sign one on the phone, and signs only a closed list of trading actions. It answers only requests that carry the token it writes at start, which a plugin cannot read. The agent that calls `lpa` never sees the password nor the key.

| What | Signed by | Where |
|---|---|---|
| Markets, quotes, positions, balances | nobody | public reads |
| Simulated orders | nobody | simulated on the computer, on the live book |
| Open, close, cancel, modify | the agent key, in the guardian | after the quote, the policy and your go |
| Approve the agent, revoke it | your wallet: Locker Vault, or the extension or mobile wallet you chose | QR ceremony on the phone, or a request you approve in your wallet |
| Deposit, withdraw, move margin between dexes | your wallet | the same |
| The mandate: the agent's limits, signed once | your wallet | the same |
| A live copy's orders | the agent key, in the guardian | under the policy and the mandate that names the trader |
| A plugin's commands | nothing for the real account | a separate process that reads its own folder only |

## Three ways to sign for your account

The drawing above follows Locker Vault, the safest way and the one we recommend. `lpa setup` asks how your account signs, Locker Vault first; `lpa init --with vault|browser|mobile` says it on one line, and `lpa signer show` says it afterwards.

| Way | What you need | What leaves this computer |
|---|---|---|
| Locker Vault, the safest, recommended | Locker Vault on a phone or tablet kept offline, a webcam | nothing: requests and answers travel as QR codes |
| Your browser extension (MetaMask, Rabby) | the extension, in the browser that opens the local page of `lpa` | nothing more: the extension signs on that page |
| Your mobile wallet | the wallet on your phone: you scan a WalletConnect QR once, then approve each request there | the requests, end-to-end encrypted, through WalletConnect's relay, which sees this computer's IP address and the time |

With an extension or a mobile wallet, the account is proven first, before any money, by one signature that moves nothing, checked here and sent nowhere; an address that is a contract is refused. Those two are online wallets and show a typed signature as raw fields, so the local page says what your wallet will show, field by field. Locker Vault keeps the key on a device that is never online and shows every request in words. `lpa signer use` changes the way for the same address; the agent key and the mandate stay.

## The mandate, the live copies and the plugins

- **No stop in percent.** Since 2.4.0 no share of a loss refuses an order, the day's nor the one since the start, and no fall of the equity stops the daily pilot. What bounds the money: the size of an order, the leverage, the markets, the orders and the notional of a day, the risk:reward, the expiry, the other bounds of this computer, the mandate, the model's budget, the pause after losses in a row, and the stops each strategy sets for itself.
- **The mandate** is the agent's limits signed once by your wallet: the policy's bounds, a ceiling on the notional opened per day, the fee recipient, and what the key may be used for. Locker Vault shows every bound on its own row. Since 2.4.0 it holds fifteen fields under the version 2 of its EIP-712 domain; a mandate signed before 2.4.0 is refused whole (`MANDATE_OUTDATED`) until you sign it again with `lpa mandate sign`. The guardian checks it before every opening and never lets it widen the local policy. The folder remembers the highest mandate signed and the revocation, so a file gone, an older one put back or a revoked one opens nothing, in this guardian and the next; `lpa mandate revoke` stops every opening until you sign a new one, and `lpa mandate release` (your password) goes back to the local policy alone.
- **A live copy** (`lpa copy start --live`) mirrors a trader on the real account. It needs the guardian unlocked by you and a mandate that names the trader, with room in its copy budget. Each order goes through the policy and the mandate like yours, signed by the agent key, never by the account's key. A reduction the guardian could not place is kept and tried again, never lost; the copy's budget stays counted while its positions are open; your own account is never copied. Simulation stays the default.
- **A plugin** adds commands and MCP tools. It runs in a separate Node process that reads its own folder only: not your keys, not your settings, not the guardian's token. It does know your user name, the computer's name and its network addresses, and the install screen says so. It reaches your wallet only through the capabilities it declared and you approved, none of which signs for the real account. Its files are fingerprinted at install, and a changed plugin does not run.

## What the agent key can and cannot do

Measured on Hyperliquid mainnet on 2026-09-28, with an approved agent key:

| Action | Signed by the agent key |
|---|---|
| Place, modify and cancel orders, set leverage | accepted |
| `withdraw3`, `usdSend`, `spotSend`, `sendAsset`, `usdClassTransfer` | refused |
| `approveAgent` (approve another agent), `approveBuilderFee` | refused |
| `vaultTransfer` (deposit the account into a vault) | **accepted** |

A stolen agent key cannot withdraw, but it can lose money: by trading against an accomplice on a thin market, or by depositing the account into a vault run by someone else. `lpa` never signs `vaultTransfer` (its guardian signs a closed list of trading actions), but a thief with the key and the password does not need `lpa`. The real bound is a dedicated account that holds only what you are ready to risk.

How this compares with the other agent wallets, quote by quote and source by source: [`COMPARISON.md`](COMPARISON.md).

## The four packages

Each package's page on npm is its complete reference: how it works, then every command, tool or function with an example.

| Package | What it is | Reference |
|---|---|---|
| `@locker-protocol/agent-wallet-hyperliquid-trader` | The `lpa` command: an agent wallet for Hyperliquid perps whose keys stay offline in Locker Vault. Also a library. | [npm](https://www.npmjs.com/package/@locker-protocol/agent-wallet-hyperliquid-trader) |
| `@locker-protocol/agent-wallet-hyperliquid-trader-mcp` | The MCP server: the same commands as 42 tools over stdio, and the tools of the plugins you install, for Claude Code, Cursor, Codex and any MCP client. | [npm](https://www.npmjs.com/package/@locker-protocol/agent-wallet-hyperliquid-trader-mcp) |
| `@locker-protocol/agent-wallet-hyperliquid-signer` | Hyperliquid signing, orders, account reads and live data, for programs whose keys stay in Locker Vault. ESM and CommonJS, with types. | [npm](https://www.npmjs.com/package/@locker-protocol/agent-wallet-hyperliquid-signer) |
| `@locker-protocol/agent-wallet-vault` | The codec of Locker Vault: sign requests and signatures as QR codes, account sync. ESM and CommonJS, with types. | [npm](https://www.npmjs.com/package/@locker-protocol/agent-wallet-vault) |

The four versions move together, one version per release. Node 22.13 or later for the wallet and the MCP server; the two SDKs alone run on any Node 22.

What gets installed where: the one-line installers put `lpa` and the MCP server in `~/.lpa`, on one copy of the packages, with two launchers, `lpa` and `locker-mcp`, so both always run the same version. `npm install -g` installs `lpa` alone; an MCP client can then fetch the server with `npx` at `@latest`, the newest release at each start: when a version comes out, run the installer again so that `lpa` follows. Either way they share the `~/.lpa` folder and the guardian, and a guardian signs nothing for a program of another version.

## Install

```sh
npm install -g @locker-protocol/agent-wallet-hyperliquid-trader@latest
```

Or the one-line installers, which fetch Node when it is missing and put everything in `~/.lpa`, with no administrator rights.

On macOS and Linux:

```sh
curl -fsSL https://hyperagentictrader.com/agent-wallet-install.sh | sh
```

On Windows (PowerShell):

```powershell
irm https://hyperagentictrader.com/agent-wallet-install.ps1 | iex
```

## Start in simulation

The simulation account fills on Hyperliquid's real book, with the real fees, and needs no key and no vault. These sizes fit the default policy ($100 per order, leverage 3):

```sh
lpa paper init --budget 1000
lpa perps quote --symbol ETH --side long --size 0.03 --leverage 3
lpa perps open  --symbol ETH --side long --size 0.03 --leverage 3 --paper
lpa paper status
lpa perps close --symbol ETH --paper
```

In a terminal, `open` and `close` show the quote and ask before they fill; without one (a script, an agent), add `--yes` once the user has agreed.

## Set up with Locker Vault

```sh
lpa setup
lpa init
lpa init --with browser
lpa init --with mobile
```

`lpa setup` takes the whole way, step by step; `lpa init` sets up the account and its trading key alone, with Locker Vault unless `--with` names your extension or your mobile wallet. With Locker Vault, the terminal opens a local page on this computer. The phone's Locker Vault shows its accounts as a QR code, the page reads it through the webcam, then shows the approval of a new agent key as a QR code for the phone to sign. The agent key is created and sealed here, under a password typed in the terminal, before the phone signs. The account's key never leaves the phone.

Then `lpa unlock` starts the guardian, a background process that holds the agent key in memory and signs orders; the agent never sees the key or the password. `lpa lock` takes the key out of memory.

## Every command

`lpa` alone opens an interactive session, with the same commands as `/` commands, live market views and an assistant on the model of your choice. Every command answers in text, or in JSON with `--json`; a refusal carries a stable code and what to do next. The flags and an example of each are in the [reference](https://www.npmjs.com/package/@locker-protocol/agent-wallet-hyperliquid-trader).

| Area | Commands |
|---|---|
| Setup | `lpa setup`, `lpa init`, `lpa unlock`, `lpa lock`, `lpa status`, `lpa doctor` |
| How the account signs | `lpa signer show`, `lpa signer use vault`, `lpa signer use browser`, `lpa signer use mobile`, `lpa signer forget` |
| Several accounts, one profile each | `lpa profile list`, `add`, `use`, `rename`, `remove`; `--profile <name>` on any command |
| Market data | `lpa perps venues`, `lpa perps markets`, `lpa perps quote`, `lpa perps regime`, `lpa perps ranges` |
| Account reads | `lpa perps positions`, `lpa perps balance`, `lpa perps orders`, `lpa perps fills`, `lpa perps funding`, `lpa perps fees`, `lpa perps ledger`, `lpa wallet address`, `lpa wallet balances` |
| Orders | `lpa perps check`, `lpa perps open`, `lpa perps close`, `lpa perps cancel`, `lpa perps modify`; `--tif`, `--reduce-only` and `--margin` on `quote`, `check` and `open` |
| Funds, signed by your wallet | `lpa perps deposit`, `lpa perps withdraw`, `lpa perps transfer`, `lpa agent revoke` |
| Simulation | `lpa paper init`, `lpa paper status`, `lpa paper on`, `lpa paper off`, `lpa paper record`, `lpa paper replay` |
| Policy and journal | `lpa policy show`, `lpa policy set`, `lpa journal`, `lpa journal export` |
| The mandate, signed by your wallet | `lpa mandate sign`, `lpa mandate show`, `lpa mandate revoke`, `lpa mandate release` (your password) |
| Copies, in simulation or live | `lpa copy start`, `lpa copy stop`, `lpa copy status`, `lpa copy resume` |
| The daily pilot | `lpa pilot status`, `lpa pilot schedule`, `lpa pilot strategy list`, `lpa pilot strategy show`, `lpa pilot model-down`, `lpa pilot plans`, `lpa pilot day`, `lpa pilot end-grid`, `lpa pilot end-range`, and the rest in the reference |
| Notices to your phone, off by default | `lpa notices`, `on`, `off`, `test` |
| Plugins | `lpa plugins install`, `list`, `inspect`, `remove`, `disable`, `enable`; then `lpa <plugin> <command>` |
| The server for assistants, on this computer | `lpa mcp status`, `off`, `on`, `forget` |
| hyperkeel (optional) | `lpa hyperkeel login`, `status`, `logout`, `brief`, `leaders`, `follows`, `follow`, `unfollow`, `alerts`, `off`, `on` |
| Settings | `lpa config` |
| Server | `lpa service install`, `status`, `logs`, `start`, `stop`, `restart`, `uninstall`; `lpa console`, `lpa console password` |
| Housekeeping | `lpa reset`, `lpa uninstall` |

## The MCP server

Claude Code:

```sh
claude mcp add locker -- npx -y --ignore-scripts @locker-protocol/agent-wallet-hyperliquid-trader-mcp@latest
```

Claude Desktop (`claude_desktop_config.json`), Cursor (`.cursor/mcp.json`) and Antigravity (`mcp_config.json`):

```json
{
  "mcpServers": {
    "locker": { "command": "npx", "args": ["-y", "--ignore-scripts", "@locker-protocol/agent-wallet-hyperliquid-trader-mcp@latest"] }
  }
}
```

Codex (`~/.codex/config.toml`):

```toml
[mcp_servers.locker]
command = "npx"
args = ["-y", "--ignore-scripts", "@locker-protocol/agent-wallet-hyperliquid-trader-mcp@latest"]
```

Any other MCP client: the command `npx -y --ignore-scripts @locker-protocol/agent-wallet-hyperliquid-trader-mcp@latest`, transport stdio. Node 22.13 or later. Its name in the official MCP Registry is `io.github.locker-protocol/agentic`.

With `lpa` installed by the one-line installer, point the client at its launcher instead, which is always the version of `lpa`: `claude mcp add locker -- ~/.lpa/bin/locker-mcp`.

Every tool, its arguments and an example call: the [MCP reference](https://www.npmjs.com/package/@locker-protocol/agent-wallet-hyperliquid-trader-mcp). An order is quoted first and confirmed with the `quote_id` of that quote; movements of funds answer the line the person types in their own terminal.

## Skills and examples

| Repository | What is in it |
|---|---|
| [locker-protocol/agent-skills](https://github.com/locker-protocol/agent-skills) | The skill that teaches an AI agent to use `lpa` and the MCP server, packaged as a plugin for six hosts, with its session-start hook and its evals. |
| [locker-protocol/agentic-examples](https://github.com/locker-protocol/agentic-examples) | Recipes to copy, simulation mode by default. |

## Documentation

| Page | What it covers |
|---|---|
| [`docs/security-model.md`](docs/security-model.md) | What the model never sees, the hard limits measured on mainnet, the local policy and the risk:reward guard, and what the policy does not hold against. |
| [`docs/network.md`](docs/network.md) | Every host `lpa` connects to, and when. |
| [`docs/strategies.md`](docs/strategies.md) | The strategies of the daily pilot: the four kinds, the eighteen shipped, the commands that read, choose, write and measure them. |
| [`docs/parity-metamask.md`](docs/parity-metamask.md) | The commands, one by one, beside MetaMask Agent Wallet's. |
| [`COMPARISON.md`](COMPARISON.md) | One line per claim, with the URL, the quote and the date it was last checked. |
| [`CHANGELOG.md`](CHANGELOG.md) | What each version added, changed and fixed. |
| [`RELEASES.md`](RELEASES.md) | The SHA-256 of every published tarball, and how to check it yourself. |

## Network

What `lpa` connects to, and when:

| Host | When |
|---|---|
| `api.hyperliquid.xyz` (HTTPS and WebSocket) | Markets, quotes, orders, account reads, live views |
| `arb1.arbitrum.io`, `arbitrum-one-rpc.publicnode.com`, `arbitrum.drpc.org` | Arbitrum balances and deposits, the first node that answers |
| `api.hyperkeel.com` | The daily pilot's dossier and the MCP server's brief, through hyperkeel's public routes for agents, without any connection; the rest only when you connect with `lpa hyperkeel login`, and while connected; the notices only once you turn them on with `lpa notices on` (the kind of a notice and at most one whole number, never a figure of the account) |
| `api.anthropic.com`, `api.openai.com`, `generativelanguage.googleapis.com`, `openrouter.ai` | Only the assistant provider you choose, if any; a local model (LM Studio, Ollama) or your own address stays where you point it |
| `nfs.faireconomy.media`, `api.alternative.me`, `www.federalreserve.gov`, `www.ecb.europa.eu`, `www.coindesk.com` | Only the daily pilot, once a day, when it builds its dossier: plain reads without a key, an account, your address or your positions |
| `relay.walletconnect.org` (WebSocket) | Only when the account signs with a mobile wallet, while a signature is asked: end-to-end encrypted requests |
| `127.0.0.1` | Its own pages (the ceremony, settings, the console) and the guardian's local socket |

Nothing else: no analytics, no crash reports, no update check. A plugin you install runs in its own process and may reach the network on its own; `lpa` reaches nothing for it.

## Fees

Hyperliquid's own trading fees, plus a builder fee of 0.05 % of each order's notional to Locker, named in every quote and totalled in `lpa journal`. It applies once the account has approved it in `lpa init`, and never otherwise: without the approval, orders go out without it and are never blocked. The referral code `LOCKERPROTOCOL` is set once at activation; an account that already has a referrer keeps it. The simulation account counts the same fees, so its results match real trading.

## Checking this repository

```sh
node tests/check.mjs
```

[`tests/check.mjs`](tests/check.mjs) has no dependency. It checks that every relative link resolves, that every claim in [`COMPARISON.md`](COMPARISON.md) carries a URL, a quotation and the date it was last read, that one version is used everywhere, and that nothing in the tree strays outside ASCII.

## Reporting a problem

Open an issue in this repository: [github.com/locker-protocol/agentic/issues](https://github.com/locker-protocol/agentic/issues). There are two templates, one for a bug and one for a question.

A security issue does not go in an issue. Read [`SECURITY.md`](SECURITY.md) and write to the address it gives.

## Licence

LOCKER PROTOCOL PROPRIETARY NON-COMMERCIAL LICENSE. See [`LICENSE`](LICENSE).
