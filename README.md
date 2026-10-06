# Locker Protocol Agentic

**Your private key is nowhere: not on our servers, not on the agent's machine, not with anyone.**

The agent trades. It holds nothing.

- **Where the key is:** the account's private key stays in Locker Vault, an offline app on a phone or tablet. This computer only holds an agent key, sealed under a password, that expires on its own (six months by default, the longest Hyperliquid allows).
- **Who can withdraw:** only the vault, by a QR code a person scans and signs. Hyperliquid refuses the agent key every withdrawal and every send; the one movement of funds it accepts from that key is a deposit into a Hyperliquid vault, which lpa never signs (measured on mainnet, 2026-09-28).
- **What goes where:** orders and reads go to Hyperliquid, deposits and balances to Arbitrum nodes, and nothing else unless you turn it on (the list is below). No server of ours, no account, no telemetry.

**Documentation:** [doc.lockerprotocol.com/agent-wallet](https://doc.lockerprotocol.com/agent-wallet/agent): install, the setup in steps, how it trades and every command. **Website:** [hyperagentictrader.com](https://hyperagentictrader.com).

Locker Protocol Agentic is an agent wallet for Hyperliquid perps: the `lpa` command for people and for AI agents, an MCP server, and two SDK packages. It comes with a paper account on the real order book, a local policy checked before every order, and every movement of funds signed on the phone.

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
| Paper orders | nobody | simulated on the computer, on the live book |
| Open, close, cancel, modify | the agent key, in the guardian | after the quote, the policy and your go |
| Approve the agent, revoke it | Locker Vault | QR ceremony, on the phone |
| Deposit, withdraw, move margin between dexes | Locker Vault | QR ceremony, on the phone |
| The mandate: the agent's limits, signed once | Locker Vault | QR ceremony, on the phone |
| A live copy's orders | the agent key, in the guardian | under the policy and the mandate that names the trader |
| A plugin's commands | nothing for the real account | a separate process that reads its own folder only |

## The mandate, the live copies and the plugins

- **The mandate** is the agent's limits signed once on the phone: the policy's bounds, a ceiling on the notional opened per day, the fee recipient, and what the key may be used for. Locker Vault shows every bound on its own row. The guardian checks it before every opening and never lets it widen the local policy. The folder remembers the highest mandate signed and the revocation, so a file gone, an older one put back or a revoked one opens nothing, in this guardian and the next; `lpa mandate revoke` stops every opening until the phone signs a new one, and `lpa mandate release` (your password) goes back to the local policy alone.
- **A live copy** (`lpa copy start --live`) mirrors a trader on the real account. It needs the guardian unlocked by you and a mandate that names the trader, with room in its copy budget. Each order goes through the policy and the mandate like yours, signed by the agent key, never by the account's key. A reduction the guardian could not place is kept and tried again, never lost; the copy's budget stays counted while its positions are open; your own account is never copied. Paper stays the default.
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

## Start on paper

The paper account fills on Hyperliquid's real book, with the real fees, and needs no key and no vault. These sizes fit the default policy ($100 per order, leverage 3):

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
lpa init
```

The terminal opens a local page on this computer. The phone's Locker Vault shows its accounts as a QR code, the page reads it through the webcam, then shows the approval of a new agent key as a QR code for the phone to sign. The agent key is created and sealed here, under a password typed in the terminal, before the phone signs. The account's key never leaves the phone.

Then `lpa unlock` starts the guardian, a background process that holds the agent key in memory and signs orders; the agent never sees the key or the password. `lpa lock` takes the key out of memory.

## Every command

`lpa` alone opens an interactive session, with the same commands as `/` commands, live market views and an assistant on the model of your choice. Every command answers in text, or in JSON with `--json`; a refusal carries a stable code and what to do next. The flags and an example of each are in the [reference](https://www.npmjs.com/package/@locker-protocol/agent-wallet-hyperliquid-trader).

| Area | Commands |
|---|---|
| Setup | `lpa init`, `lpa unlock`, `lpa lock`, `lpa status`, `lpa doctor` |
| Market data | `lpa perps venues`, `lpa perps markets`, `lpa perps quote`, `lpa perps regime`, `lpa perps ranges` |
| Account reads | `lpa perps positions`, `lpa perps balance`, `lpa perps orders`, `lpa wallet address`, `lpa wallet balances` |
| Orders | `lpa perps open`, `lpa perps close`, `lpa perps cancel`, `lpa perps modify` |
| Funds, signed on the phone | `lpa perps deposit`, `lpa perps withdraw`, `lpa perps transfer`, `lpa agent revoke` |
| Paper | `lpa paper init`, `lpa paper status`, `lpa paper on`, `lpa paper off`, `lpa paper record`, `lpa paper replay` |
| Policy and journal | `lpa policy show`, `lpa policy set`, `lpa journal` |
| The mandate, signed on the phone | `lpa mandate sign`, `lpa mandate show`, `lpa mandate revoke`, `lpa mandate release` (your password) |
| Copies, on paper or live | `lpa copy start`, `lpa copy stop`, `lpa copy status`, `lpa copy resume` |
| Plugins | `lpa plugins install`, `list`, `inspect`, `remove`; then `lpa <plugin> <command>` |
| hyperkeel (optional) | `lpa hyperkeel login`, `status`, `logout`, `brief`, `leaders`, `follows`, `follow`, `unfollow`, `alerts` |
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
| [locker-protocol/agentic-examples](https://github.com/locker-protocol/agentic-examples) | Recipes to copy, paper mode by default. |

## Documentation

| Page | What it covers |
|---|---|
| [`docs/security-model.md`](docs/security-model.md) | What the model never sees, the hard limits measured on mainnet, the local policy and the risk:reward guard, and what the policy does not hold against. |
| [`docs/network.md`](docs/network.md) | Every host `lpa` connects to, and when. |
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
| `api.hyperkeel.com` | Only when you connect with `lpa hyperkeel login`, and while connected (`LPA_HYPERKEEL_API` changes it) |
| `api.anthropic.com`, `api.openai.com`, `generativelanguage.googleapis.com`, `openrouter.ai` | Only the assistant provider you choose, if any; a local model (LM Studio, Ollama) or your own address stays where you point it |
| `127.0.0.1` | Its own pages (the ceremony, settings, the console) and the guardian's local socket |

Nothing else: no analytics, no crash reports, no update check. A plugin you install runs in its own process and may reach the network on its own; `lpa` reaches nothing for it.

## Fees

Hyperliquid's own trading fees, plus a builder fee of 0.05 % of each order's notional to Locker, named in every quote and totalled in `lpa journal`. It applies once the account has approved it in `lpa init`, and never otherwise: without the approval, orders go out without it and are never blocked. The referral code `LOCKERPROTOCOL` is set once at activation; an account that already has a referrer keeps it. The paper account counts the same fees, so its results match real trading.

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
