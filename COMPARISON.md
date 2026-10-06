# Where the key is, in every agent wallet we could check

Every line below is one claim about one product, with the URL it comes from, the words as they are written there, and the date we last read them. Nothing here is our reading of what a product does: it is what its own documentation, its published code or a public registry says.

## How this page is kept

- Every line is read again before each release of our packages. The date in the last column is the day it was last read, not the day it was written.
- A line that no longer checks out is removed, not softened. If a product changes, the line changes with it or it goes.
- We quote, we do not characterise. Where a product does something a bare private key does not, it is in the section that says so.
- A name appears only with a source anyone can open. A claim we could not verify is not on this page.
- Our own claims are at the bottom. They point at our documentation, not at an outside source, because they are ours to prove: the measurements behind them were run on Hyperliquid mainnet and are named there.

## The key is with a company, and the agent holds a credential that makes it sign

| Product | What the source says | Source | Last read |
|---|---|---|---|
| MetaMask Agent Wallet, server-wallet mode | "Keys are managed and secured server-side in a trusted execution environment (TEE), so agents can't access your main wallet. You retain self-custody." | [docs.metamask.io/agent-wallet/reference/architecture](https://docs.metamask.io/agent-wallet/reference/architecture/) | 2026-09-29 |
| MetaMask Agent Wallet, sign-in | "Google, email passwordless, and MetaMask Mobile QR are three separate methods." and "Each one loads a different wallet address, even if you use the same email across them." | [docs.metamask.io/agent-wallet/quickstart](https://docs.metamask.io/agent-wallet/quickstart/) | 2026-09-29 |
| MetaMask Agent Wallet, published code 6.2.1 | The published bundle carries the host "agentic-proxy.workers.cx.metamask.io" (in `dist/chunks/result-D_1AaN84.js`) and the host "api.segment.io" (in `dist/chunks/analytics-Dn0Jy_K1-Bqqb5NVS.js`). | [registry.npmjs.org/@metamask/agent-wallet/-/agent-wallet-6.2.1.tgz](https://registry.npmjs.org/@metamask/agent-wallet/-/agent-wallet-6.2.1.tgz) | 2026-09-29 |
| Coinbase AgentKit, default wallet provider | "The `CdpEvmWalletProvider` is a wallet provider that uses the Coinbase Developer Platform (CDP) v2 Wallet API." | [github.com/coinbase/agentkit, typescript/agentkit/README.md](https://github.com/coinbase/agentkit/blob/master/typescript/agentkit/README.md) | 2026-09-29 |
| Coinbase AgentKit, what the agent holds | The provider is configured from the environment: "CDP_API_KEY_ID=your_api_key_id", "CDP_API_KEY_SECRET=your_api_key_secret", "CDP_WALLET_SECRET=your_wallet_secret". | [github.com/coinbase/agentkit, typescript/agentkit/README.md](https://github.com/coinbase/agentkit/blob/master/typescript/agentkit/README.md) | 2026-09-29 |
| Turnkey, AI agents | "Let agents operate wallets while private keys stay isolated in Turnkey's secure enclaves." | [turnkey.com/solutions/ai-agents](https://www.turnkey.com/solutions/ai-agents) | 2026-09-29 |
| Turnkey, what the agent holds | "Give each agent its own API key and policy scope so specialized agents can share wallet access without conflict." | [turnkey.com/solutions/ai-agents](https://www.turnkey.com/solutions/ai-agents) | 2026-09-29 |
| Privy, agent wallets | "Privy provides the key management, authorization model, and policy controls to let agents transact safely within human-defined boundaries." | [docs.privy.io/wallets/overview/solutions/agent-wallets](https://docs.privy.io/wallets/overview/solutions/agent-wallets) | 2026-09-29 |
| Privy, what the agent holds | "The agent holds the credential needed to trigger signing and can transact independently without prompting a user." | [docs.privy.io/wallets/overview/solutions/agent-wallets](https://docs.privy.io/wallets/overview/solutions/agent-wallets) | 2026-09-29 |
| Crossmint, platform-hosted agent wallets | "Use a server signer for operations, similar to a company wallet. The platform holds the secret and controls signing." | [docs.crossmint.com/wallets/signers-and-custody](https://docs.crossmint.com/wallets/signers-and-custody) | 2026-09-29 |

## The private key is on the machine the agent runs on

| Product | What the source says | Source | Last read |
|---|---|---|---|
| MetaMask Agent Wallet, bring your own wallet | "You supply a BIP-39 mnemonic." and "Never pass `--mnemonic` on the command line. Set the `MM_MNEMONIC` environment variable instead." | [docs.metamask.io/agent-wallet/reference/architecture](https://docs.metamask.io/agent-wallet/reference/architecture/) | 2026-09-29 |
| ElizaOS, plugin-evm | "The plugin requires the following environment variables:" then, under "# Required", "EVM_PRIVATE_KEY=your_private_key_here". | [docs.elizaos.ai/plugin-registry/defi/evm](https://docs.elizaos.ai/plugin-registry/defi/evm) | 2026-09-29 |
| Solana Agent Kit, constructor | The first argument of `new SolanaAgentKit(...)` in the README's own example is "your-wallet-private-key-as-base58". | [github.com/sendaifun/solana-agent-kit, README.md](https://github.com/sendaifun/solana-agent-kit/blob/main/README.md) | 2026-09-29 |
| Solana Agent Kit, its own warning | "This toolkit handles private keys and transactions. Always ensure you're using it in a secure environment and never share your private keys." | [github.com/sendaifun/solana-agent-kit, README.md](https://github.com/sendaifun/solana-agent-kit/blob/main/README.md) | 2026-09-29 |
| Crossmint, server signers | "Server signers derive keys deterministically from a secret in your infrastructure." | [docs.crossmint.com/wallets/signers-and-custody](https://docs.crossmint.com/wallets/signers-and-custody) | 2026-09-29 |

## The Hyperliquid MCP servers of the official registry

Read on 2026-09-29 with the registry's own search: ten distinct servers answer the query `hyperliquid`.

| Server | What the source says | Source | Last read |
|---|---|---|---|
| `io.github.R2Rlabs/hyperliquid-reins`, the only one of the ten that places orders | Its `REINS_PRIVATE_KEY` variable, marked secret, is described as "Live mode: an API wallet's key, which can trade but not withdraw. Never the account's own key." | [registry.modelcontextprotocol.io, search hyperliquid](https://registry.modelcontextprotocol.io/v0/servers?search=hyperliquid) | 2026-09-29 |
| `xyz.honeycheck/hyperliquid-funding-mcp` | Its `PAY_WALLET_KEY` variable, marked secret, is described as "Optional. Private key of a funded Circle Gateway wallet, for the paid tools. Free tools need nothing." | [registry.modelcontextprotocol.io, search hyperliquid](https://registry.modelcontextprotocol.io/v0/servers?search=hyperliquid) | 2026-09-29 |
| The eight others | None of `dev.tesseralytics/hyperliquid-data`, `io.github.Br0ski777/hyperliquid-data`, `io.github.Br0ski777/hyperliquid-whales`, `io.github.Glebenjoy/hyperliquid-info-mcp`, `io.github.alekskram/hyperliquid-agent-gateway`, `io.github.junct-bot/hyperliquid-mcp`, `io.github.kitsune-de/hyperliquid-mcp`, `io.github.retampweb/pa1m-hyperliquid` declares an "environmentVariables" entry holding a key: five are remote servers, three declare no variable at all. | [registry.modelcontextprotocol.io, search hyperliquid](https://registry.modelcontextprotocol.io/v0/servers?search=hyperliquid) | 2026-09-29 |

## What the others do that a bare key does not

A private key in an environment variable is the weakest arrangement of all, and several of these products are a long way past it. Read as written.

| Product | What the source says | Source | Last read |
|---|---|---|---|
| Turnkey, policies in the enclave | "Evaluate every agent action within secure enclaves so only authorized actions execute, blocking compromised requests." | [turnkey.com/solutions/ai-agents](https://www.turnkey.com/solutions/ai-agents) | 2026-09-29 |
| Privy, policy engine | "Privy's policy engine allow you to enforce guardrails on how agents spend funds." | [docs.privy.io/wallets/overview/solutions/agent-wallets](https://docs.privy.io/wallets/overview/solutions/agent-wallets) | 2026-09-29 |
| Crossmint, signer scopes | "For both patterns, signer scopes can limit what the agent is allowed to do." | [docs.crossmint.com/wallets/signers-and-custody](https://docs.crossmint.com/wallets/signers-and-custody) | 2026-09-29 |
| ElizaOS, TEE option | "TEE Support: Secure wallet derivation in Trusted Execution Environments" | [docs.elizaos.ai/plugin-registry/defi/evm](https://docs.elizaos.ai/plugin-registry/defi/evm) | 2026-09-29 |
| MetaMask Agent Wallet, guarantee | "Transactions through Agent Wallet deemed safe are guaranteed against loss up to $10,000/month." | [docs.metamask.io/agent-wallet/reference/architecture](https://docs.metamask.io/agent-wallet/reference/architecture/) | 2026-09-29 |
| MetaMask Agent Wallet, Guard Mode | "Guard Mode enforces all of your policies and asks for approval on anything outside them." | [docs.metamask.io/agent-wallet/reference/trading-modes](https://docs.metamask.io/agent-wallet/reference/trading-modes/) | 2026-09-29 |
| MetaMask Agent Wallet, outflow limit | "Your outflow limit caps the total value that can leave the server-wallet in a rolling 24-hour window." | [docs.metamask.io/agent-wallet/reference/outflow-policy](https://docs.metamask.io/agent-wallet/reference/outflow-policy/) | 2026-09-29 |
| MetaMask Agent Wallet, perps on a testnet | "`--network` is optional and defaults to `mainnet`; pass `--network testnet` to trade on the venue's testnet." | [docs.metamask.io/agent-wallet/reference/commands](https://docs.metamask.io/agent-wallet/reference/commands/) | 2026-09-29 |
| Reins, the Hyperliquid MCP server of the registry | Its `REINS_MODE` variable defaults to `paper`, described as "paper (live prices, simulated fills, nothing signed) or live." | [registry.modelcontextprotocol.io, search hyperliquid](https://registry.modelcontextprotocol.io/v0/servers?search=hyperliquid) | 2026-09-29 |

## What the outflow limit is measured on

| Claim | What the source says | Source | Last read |
|---|---|---|---|
| What the 24-hour limit counts | "Our transaction simulation engine analyzes token outflow from your account and estimates the volume in USD." and "This includes token transfers, swaps, and deposits (for example, to Uniswap, Polymarket, or Hyperliquid)." | [docs.metamask.io/agent-wallet/reference/outflow-policy](https://docs.metamask.io/agent-wallet/reference/outflow-policy/) | 2026-09-29 |
| What it does not count | "Signatures (for example, Permit2) are not included in the outflow calculation as of now." | [docs.metamask.io/agent-wallet/reference/outflow-policy](https://docs.metamask.io/agent-wallet/reference/outflow-policy/) | 2026-09-29 |
| Where a plugin runs | "Plugins run in-process and unsandboxed." and "Install-time consent plus MetaMask backend policy signing are the real trust boundaries." | [docs.metamask.io/agent-wallet/plugins](https://docs.metamask.io/agent-wallet/plugins/) | 2026-09-29 |

## Copying a trader with MetaMask Agent Wallet, and what a plugin may do

`perps-copytrade` is a plugin for MetaMask Agent Wallet that copies a Hyperliquid trader. Its repository was read at commit `4307b980` (2026-09-30).

| Claim | What the source says | Source | Last read |
|---|---|---|---|
| What the plugin is, and who signs it | Its README: "Copy a Hyperliquid trader's perps opens and closes onto your MetaMask agent wallet, mirrored in real time." Its skill file declares "author: metamask" in its metadata. | [github.com/AyushBherwani1998/mm-perps-copytrade, README.md and skills/SKILL.md](https://github.com/AyushBherwani1998/mm-perps-copytrade/blob/4307b9808098bbc3060dc8622d4ac6783c73a7dd/skills/SKILL.md) | 2026-09-30 |
| Copying while nobody watches | "Server-wallet mode is recommended for unattended daemons", then "it signs without a password prompt. In BYOK or guard mode, each mirrored order may pause for MFA/password approval, which stalls a daemon." Server-wallet mode is the one whose keys are "managed and secured server-side", in the first table of this page. | [github.com/AyushBherwani1998/mm-perps-copytrade, skills/SKILL.md, lines 58 to 60](https://github.com/AyushBherwani1998/mm-perps-copytrade/blob/4307b9808098bbc3060dc8622d4ac6783c73a7dd/skills/SKILL.md) | 2026-09-30 |
| What a plugin needs to sign, by MetaMask's own page | The capability `wallet-submit` grants "Signing and transaction submission, still policy-gated by Agent Wallet". | [docs.metamask.io/agent-wallet/plugins](https://docs.metamask.io/agent-wallet/plugins/) | 2026-09-30 |
| What the copying command declares | In the plugin's `package.json`, the command `copytrade:start` declares `"capabilities": ["wallet-read"]`, and no command of the package declares "wallet-submit". | [github.com/AyushBherwani1998/mm-perps-copytrade, package.json](https://github.com/AyushBherwani1998/mm-perps-copytrade/blob/4307b9808098bbc3060dc8622d4ac6783c73a7dd/package.json) | 2026-09-30 |
| How it places each copied order | `src/copytrade/executor.ts` runs `spawn(cmd, fullArgs, { env: process.env, stdio: ["ignore", "pipe", "pipe"] })` with the arguments "perps", "open" and, at the end, "--yes", "--json"; `src/copytrade/mmBin.ts` sets `cmd` by "re-running the same entrypoint that loaded this plugin". | [github.com/AyushBherwani1998/mm-perps-copytrade, src/copytrade/executor.ts](https://github.com/AyushBherwani1998/mm-perps-copytrade/blob/4307b9808098bbc3060dc8622d4ac6783c73a7dd/src/copytrade/executor.ts) | 2026-09-30 |

## The source of MetaMask Agent Wallet

| Claim | What the source says | Source | Last read |
|---|---|---|---|
| The repository the package points at | The `repository.url` of `@metamask/agent-wallet` 7.0.0, published 2026-09-16, is "https://github.com/MetaMask/agentic.git"; that address and the declared homepage `github.com/MetaMask/agentic-cli` both answer HTTP 404. | [registry.npmjs.org/@metamask/agent-wallet](https://registry.npmjs.org/@metamask/agent-wallet) | 2026-09-29 |
| The licence of 7.0.0 | The `LICENSE` file inside the published tarball: "You are granted a limited non-exclusive license to inspect and study the code in this repository. There is no associated right to reproduction granted under this license except where reproduction is necessary for inspection and study of the code." | [registry.npmjs.org/@metamask/agent-wallet/-/agent-wallet-7.0.0.tgz](https://registry.npmjs.org/@metamask/agent-wallet/-/agent-wallet-7.0.0.tgz) | 2026-09-29 |

Versions 6.0.0 to 6.2.1 of the same package remain published under MIT or Apache 2.0. Nothing of theirs is copied into ours: what we took is the shape of the command line, so that a recipe written for one reads in the other. The commands stand side by side in [`docs/parity-metamask.md`](docs/parity-metamask.md).

## What we say about ourselves

These are ours to prove, so they point at our own pages rather than at anyone else's.

- The account's private key stays in Locker Vault, offline, and the computer holds only a sealed agent key that expires on its own. [`README.md`](README.md), first three lines.
- The agent key is refused by Hyperliquid for `withdraw3`, `usdSend`, `spotSend`, `sendAsset`, `usdClassTransfer`, `approveAgent` and `approveBuilderFee`, and accepted for `vaultTransfer`. Measured on Hyperliquid mainnet on 2026-09-28, one signed attempt per action. [`README.md`](README.md), the table, and [`docs/security-model.md`](docs/security-model.md).
- A stolen agent key still loses money: it can trade against an accomplice on a thin market, and it can deposit the account into someone else's vault. We say it in the same table rather than write "sign-only". [`docs/security-model.md`](docs/security-model.md).
- No account, no server of ours, no telemetry: the hosts `lpa` reaches, and when, are listed one by one. [`docs/network.md`](docs/network.md).
- A paper account that fills on Hyperliquid's real book with the real fees, before any key and any vault exists. [`README.md`](README.md), "Start on paper".
- Every movement of funds is a QR code signed on the phone, which is why an agent cannot make one on its own. [`docs/security-model.md`](docs/security-model.md).
- A copy that runs with nobody watching signs with the agent key, which expires and cannot withdraw, under a mandate the person signed on the phone that names the trader and caps the budget; never with the account's key, and never on a server of ours. [`docs/security-model.md`](docs/security-model.md), "Live copies".
- The agent's limits can be signed on the phone, bound by bound, and the guardian checks that signature before every order it opens; nothing on the computer widens them. [`docs/security-model.md`](docs/security-model.md), "The mandate".
- A plugin runs in a separate process that reads its own folder only (it still knows the user name, the computer's name and its network addresses, and the install screen says so), and the guardian answers only requests carrying a token that process cannot read: starting another program is refused to it, not merely undeclared. Measured on Node 24.21.0 on 2026-09-30. [`docs/security-model.md`](docs/security-model.md), "Plugins".
