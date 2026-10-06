# Network

What `lpa` connects to, and when. Nothing on this page is optional reading: the claim that the key is nowhere is only worth what this list is worth.

| Host | When |
|---|---|
| `api.hyperliquid.xyz` (HTTPS and WebSocket) | Markets, quotes, orders, account reads, live views |
| `arb1.arbitrum.io`, `arbitrum-one-rpc.publicnode.com`, `arbitrum.drpc.org` | Arbitrum balances and deposits, the first node that answers |
| `api.hyperkeel.com` | Only when you connect with `lpa hyperkeel login`, and while connected (`LPA_HYPERKEEL_API` changes it) |
| `api.anthropic.com`, `api.openai.com`, `generativelanguage.googleapis.com`, `openrouter.ai` | Only the assistant provider you choose, if any; a local model (LM Studio, Ollama) or your own address stays where you point it |
| `127.0.0.1` | Its own pages (the ceremony, settings, the console) and the guardian's local socket |
| whatever a plugin you installed reaches | A plugin runs in its own process, which Node's permission model does not keep off the network; `lpa` reaches nothing on its behalf |

Nothing else: no analytics, no crash reports, no update check.

## What that means in practice

- **Out of the box, two services.** Hyperliquid for the market and the orders, public Arbitrum nodes for the balances and the deposits you sign on your phone. Several Arbitrum nodes are listed because the first one that answers is used; none of them is ours.
- **hyperkeel.com is a choice.** It is our market data service, and it is reached only once you sign in with `lpa hyperkeel login`, for as long as you stay connected. The MCP server's two account-free reads, `hyperkeel_brief` and `hyperkeel_leaders`, go to routes meant for agents: those calls are counted per day and per client name, and the count keeps no IP address and nothing personal.
- **The assistant is a choice, and so is its provider.** No provider is contacted unless you set one in `lpa config`. Point it at a local model and nothing leaves the machine at all.
- **127.0.0.1 is the machine talking to itself.** The QR ceremony page, the settings page and the service console are served there, and the guardian listens on a local socket. The console has its own password, and it is reached from another computer through an SSH tunnel, not by opening a port.
- **No account with us, no server of ours, no telemetry.** There is nothing to sign up for, and nothing reports back.
- **A plugin is yours to install.** It runs in a separate process that reads its own folder only, so it cannot read your keys or your settings; it can reach the network, and it knows your user name, the computer's name and its network addresses, which it can send: the install screen says so before you agree.

## Where the state lives

In the `lpa` folder, `~/.lpa` by default, or wherever `LPA_HOME` points: the settings, the sealed agent key, the policy, the mandate, the paper account, the copies, the recorded tape, the journal, and the plugins you installed with what you approved of them. `lpa reset` wipes it and leaves the program installed; `lpa uninstall --all` removes both.
