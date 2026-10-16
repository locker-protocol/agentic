# Network

What `lpa` connects to, and when. Nothing on this page is optional reading: the claim that the key is nowhere is only worth what this list is worth.

| Host | When |
|---|---|
| `api.hyperliquid.xyz` (HTTPS and WebSocket) | Markets, quotes, orders, account reads, live views |
| `arb1.arbitrum.io`, `arbitrum-one-rpc.publicnode.com`, `arbitrum.drpc.org` | Arbitrum balances and deposits, the first node that answers |
| `api.hyperkeel.com` | The daily pilot, when it builds its dossier, and the MCP server's brief: hyperkeel's public routes for agents, without any connection, sending only the program's name and version; the rest of hyperkeel (the traders you follow, alerts) only when you connect with `lpa hyperkeel login`, and while connected; the notices of the service and the pilot only once you turn them on with `lpa notices on` (`LPA_HYPERKEEL_API` changes the address) |
| `api.anthropic.com`, `api.openai.com`, `generativelanguage.googleapis.com`, `openrouter.ai` | Only the assistant provider you choose, if any; a local model (LM Studio, Ollama) or your own address stays where you point it |
| `nfs.faireconomy.media`, `api.alternative.me`, `www.federalreserve.gov`, `www.ecb.europa.eu`, `www.coindesk.com` | Only the daily pilot, once a day, when it builds its dossier: the public economic calendar, the fear and greed index, and the headlines of the Federal Reserve, the ECB and CoinDesk; plain reads without a key, an account, your address or your positions |
| `relay.walletconnect.org` (WebSocket) | Only when the account signs with a mobile wallet, while a signature is asked: the requests to your phone, end-to-end encrypted; the relay sees this computer's IP address, the time and the project id, not the content |
| `127.0.0.1` | Its own pages (the ceremony, settings, the console) and the guardian's local socket |
| whatever a plugin you installed reaches | A plugin runs in its own process, which Node's permission model does not keep off the network; `lpa` reaches nothing on its behalf |

Nothing else: no analytics, no crash reports, no update check.

## What that means in practice

- **Out of the box, two services.** Hyperliquid for the market and the orders, public Arbitrum nodes for the balances and the deposits your wallet signs. Several Arbitrum nodes are listed because the first one that answers is used; none of them is ours.
- **hyperkeel.com is a choice.** It is our market data service, and it is reached only once you sign in with `lpa hyperkeel login`, for as long as you stay connected. The MCP server's two account-free reads, `hyperkeel_brief` and `hyperkeel_leaders`, go to routes meant for agents: those calls are counted per day and per client name, and the count keeps no IP address and nothing personal.
- **The notices are a choice.** Since 2.4.0 the service's and the pilot's notices stay on this computer until you run `lpa notices on`. Then only the kind of a notice and at most one whole number leave, never an address, an amount, the key or its password. `lpa doctor --egress` lists every call that left this computer over thirty days.
- **The relay is the price of a mobile wallet.** Locker Vault and a browser extension reach no relay: their requests stay on this computer. A mobile wallet is reached through WalletConnect's relay, encrypted end to end; the link lasts seven days and `lpa signer forget` closes it.
- **The assistant is a choice, and so is its provider.** No provider is contacted unless you set one in `lpa config`. Point it at a local model and nothing leaves the machine at all.
- **127.0.0.1 is the machine talking to itself.** The QR ceremony page, the settings page and the service console are served there, and the guardian listens on a local socket. The console has its own password, and it is reached from another computer through an SSH tunnel, not by opening a port.
- **No account with us, no server of ours, no telemetry.** There is nothing to sign up for, and nothing reports back.
- **A plugin is yours to install.** It runs in a separate process that reads its own folder only, so it cannot read your keys or your settings; it can reach the network, and it knows your user name, the computer's name and its network addresses, which it can send: the install screen says so before you agree.

## Where the state lives

In the `lpa` folder of each profile, `~/.lpa` by default (other profiles under `~/.lpa/profiles/<name>/`), or wherever `LPA_HOME` points: the settings, the sealed agent key, the policy, the mandate, the simulation account, the copies, the recorded tape, the journal, and the plugins you installed with what you approved of them. `lpa reset` wipes it and leaves the program installed; `lpa uninstall --all` removes both.
