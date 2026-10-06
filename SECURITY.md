# Security Policy

## Reporting a vulnerability

Email **contact@lockerprotocol.com** with `SECURITY` in the subject.

Please include the steps to reproduce, the version of the package (`lpa --version`), and the operating system. Never include a real secret recovery phrase, a private key, an agent key file or a password, ours or anyone else's.

- We acknowledge a report within **72 hours** and keep you informed until it is resolved.
- Please give us reasonable time to ship a fix before making it public (coordinated disclosure, 90 days at most).
- Do not open a GitHub issue for a security report. Issues in this repository are public from the moment they are written.

## Scope

- The four packages: `@locker-protocol/agent-wallet-hyperliquid-trader`, `@locker-protocol/agent-wallet-hyperliquid-trader-mcp`, `@locker-protocol/agent-wallet-hyperliquid-signer`, `@locker-protocol/agent-wallet-vault`.
- The `lpa` command and its guardian, including the sealed agent key at rest, the password handling, the local socket and the closed list of actions the guardian will sign.
- The local pages `lpa` serves on `127.0.0.1`: the QR ceremony, the settings page, and the service console with its own password.
- The QR ceremony itself: the sign requests built for Locker Vault and the answers read back from it.
- The local policy, the order path and the paper account: any way to get an order signed without the policy check, or without the person's confirmation, is a vulnerability.
- The one-line installers published at `hyperagentictrader.com/agent-wallet-install.sh` and `hyperagentictrader.com/agent-wallet-install.ps1`, and what they download.
- The published tarballs: a package on npm whose SHA-256 does not match [`RELEASES.md`](RELEASES.md) is a security issue, and we want to hear about it.

Other Locker Protocol software has its own policy in its own repository: the Locker Vault app, the browser extension, the dApps and the deployed contracts.

## Out of scope

- Hyperliquid itself, its API and its matching engine; public Arbitrum nodes; the AI provider you choose for the assistant. Report those to them.
- Losing money on a trade, a liquidation, slippage, or the fees. The limits are yours to set: see `lpa policy show`.
- What is already written down as a limit of the design, unless you can go further than the documentation says:
  - an agent key that a thief holds, with its password, can talk to Hyperliquid directly; what holds then is what Hyperliquid refuses it, its expiry, and the dedicated account. This is in [`docs/security-model.md`](docs/security-model.md);
  - `vaultTransfer` is accepted by Hyperliquid for an agent key. `lpa` never signs it, and the risk is written in the README. A way to make `lpa` sign it **is** in scope;
  - an agent that reads the guardian's memory on a machine it already controls.
- A model that proposes a bad trade. The guard is that a person confirms, and that the policy is checked twice. A way around either one is in scope; a poor suggestion is not.
- Reports produced by a scanner with no working proof against the shipped package.

## What the design promises

The account's private key is in Locker Vault, on a phone or tablet that is offline, and it never reaches this computer. The computer holds an agent key, sealed under a password, that expires on its own. Hyperliquid refuses that key every withdrawal and every send, which was measured on mainnet on 2026-09-28; the one movement of funds it accepts from that key, a deposit into a Hyperliquid vault, is refused by the guardian. The table is in the [README](README.md), the reasoning in [`docs/security-model.md`](docs/security-model.md). A report that shows one of those statements to be false is the most valuable report we can receive.

## Safe harbor

Good faith research within the scope above will never lead to legal action from us. Test with your own accounts and your own funds, never with anyone else's.

## Recognition

There is no paid bounty programme yet. A confirmed reporter is credited publicly in [`CHANGELOG.md`](CHANGELOG.md), unless they prefer to stay anonymous.
