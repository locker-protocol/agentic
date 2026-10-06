# Security model

What holds, what does not, and how we know. Every number here was measured, and the measurement is named.

## What the model never sees

An AI agent sees the output of the commands: markets, quotes, positions, balances, error codes. It never sees:

- the secret recovery phrase, which is in Locker Vault on a phone or tablet that is offline;
- the agent key in the clear, which exists only in the memory of the guardian, the background process `lpa unlock` starts;
- the password, which the person types at unlock, and which is never read from an environment variable or from a command line argument.

## The hard limits, which hold even if the machine is taken

Measured on Hyperliquid mainnet on 2026-09-28, on a test account, one signed attempt per action with an approved agent key.

| Action, signed by the agent key | Result |
|---|---|
| Place, modify and cancel orders, set leverage | accepted |
| `withdraw3` (withdraw) | refused |
| `usdSend`, `spotSend`, `sendAsset` (send) | refused |
| `usdClassTransfer` (move between spot and perps) | refused |
| `approveAgent` (approve another agent) | refused |
| `approveBuilderFee` (approve a builder fee) | refused |
| `vaultTransfer` (deposit the account into a vault) | **accepted** |

Hyperliquid applies those refused actions, signed under EIP-712, to the agent's own account, which is empty: the answer reads "Must deposit before performing actions. User: `<agent>`". This is Hyperliquid's rule, not a rule of ours, which is why it holds on a machine we no longer control.

`vaultTransfer` is the hole, and we name it rather than describe the key as sign-only. A stolen agent key can pay the account into a vault run by the thief, who can then lose those funds by trading against themselves. `createSubAccount` signed by the agent is evaluated against the account, so the signer passes; sub-accounts belong to the account, so nothing leaves that way.

Two more things follow from what the key can do:

- **Trading is also losing.** A stolen agent key can empty the account by trading against an accomplice on a thin market, on a HIP-3 dex. This is why the real bound is a dedicated account holding only what you are ready to risk, and not a promise about what the key can sign.
- **The key lasts six months**, the longest Hyperliquid allows, so you do not hold a ceremony every week. Its date is not what protects you. What protects you is that Hyperliquid refuses it every withdrawal and every transfer, that the guardian lends it only for the trading actions of a closed list, that the limits you sign on your phone last a month and are renewed by one scan, that the service holds it unsealed thirty days at a time at most, that `lpa agent revoke` ends it in a second, and that the account is dedicated. Hyperliquid also strikes off the agents of an account that was emptied: `lpa doctor` says so, and `lpa agent renew` approves a new one in one scan.

Depositing and withdrawing both require a scan of the vault, so they require a person. An agent does not scan a QR code.

## The local policy

`~/.lpa/policy.json`, checked before every order twice: once by the command, and again by the guardian just before it signs. `lpa policy show` and `lpa policy set`.

| Limit | Default |
|---|---|
| Size per order, in USD | 100 |
| Leverage | 3 |
| Markets | the main dex only; the HIP-3 dexes on request |
| Orders per day | 20 |
| Loss in a day, realised plus unrealised, read on the account | 10 % of equity |
| Risk to reward, when an order carries both a take-profit and a stop-loss | 3 |

Closing and cancelling are always allowed. Widening a limit takes effect at the next `lpa unlock`, so that a change made while the guardian is running cannot loosen what it is checking.

### The risk to reward guard

An order that carries both a take-profit and a stop-loss is refused when the stop is more than three times further from the entry than the take-profit. `lpa policy set --max-risk-reward <n>` moves the ratio, `--max-risk-reward never` turns the guard off, and raising it or turning it off is a widening, so it waits for the next `lpa unlock`. The command checks it and the guardian checks it again, and the ratio is shown in the quote.

What the guard does not cover, deliberately: an order without a take-profit or without a stop-loss is not checked, because there is no ratio to read. `perps modify --tp` and `perps modify --sl` on an open position are not checked either: on a position that is already open these are exits, which are always allowed, and refusing one would leave the position with no stop at all. Copies on paper are not checked.

## The mandate

The policy is a file on the computer: anyone with a shell there can edit it, and a wider limit waits for the person's password at the next `lpa unlock`. The mandate is the same limits signed on the phone. `lpa mandate sign` shows every bound, the phone shows them again on its own card and signs once, and the signature is checked before the file is written.

| What the mandate carries | What the guardian does with it, before every opening |
|---|---|
| The policy's bounds: size per order, leverage, markets, dexes, orders a day, the day's loss | applies the narrowest of them and the policy's: the mandate never widens anything |
| A ceiling on the notional opened per UTC day | counts the day's real openings, the person's and the live copies', and refuses what would pass it |
| The fee recipient and the highest rate | refuses to open if this program would pay someone else, or more |
| What the key may be used for: orders from the agent, live copies of the traders it names, or both | refuses the other use |
| The traders a live copy may follow, and the budget of all live copies together | refuses a live copy of anyone else, or past the budget |
| An end, never after the agent's | refuses once it has passed |

The guardian reads the file again before each opening, with the marks the folder keeps beside it (`mandate-state.json`, 0600: the highest nonce signed here and the nonce up to which it was revoked; both only ever go up), and nothing of it stays in memory. Once a mandate was signed here, a file that is gone, damaged, older than the last signed, revoked, ended or signed for another agent (a renewal) opens nothing, by name, in this guardian and in the next, until the phone signs a newer one. `lpa mandate revoke` writes the revocation there: it only restricts, so an agent may run it. `lpa mandate release`, after the person's password, drops the mandate and the marks: the local policy alone, as before any mandate. Closing a position is always allowed.

What signs is judged and counted in one breath: the day's counters (orders, notional of the mandate) are read and taken with nothing awaited in between, and the budget of the live copies is reserved before anything is awaited, so N requests at once cannot each pass on the same figures; a place taken for an order that was not placed is given back.

What it does not do: it binds the guardian, not the key. A program that reads the guardian's memory, or steals the sealed key and its password, does not go through the guardian. What holds then is the table further up.

## Live copies

`lpa copy start --live` copies a trader on the real account. The orders are signed by the agent key in the guardian, never by the account's key; each goes through the quote, the policy, the mandate and the closed list of actions, like one of the person's. A live copy needs the guardian unlocked by the person, and a mandate signed on the phone that names the trader and has room in its copy budget. An agent can start one only within what the phone signed. The budget of a copy stays counted while the positions it opened are open, so stopping and starting it does not take it twice; a copy kept on disk is taken up again only under a mandate in force that names it; the person's own account is never copied (each order would come back as an execution to copy). The trader's execution is written down as taken before the order leaves (a guardian killed in between never places it twice), and a reduction the guardian could not place is kept and tried again, never lost.

## The pilot

`lpa pilot start` arms an agent that trades on its own, in the guardian, one deliberation at a time. On paper it needs no key and no mandate. Live, it signs through the same guardian, under a use no request of the socket can claim: before each opening the guardian reads again a mandate in force that names `pilot`, and a mandate that is absent, ended, revoked or allows trading only refuses the opening by name; it never falls back on the local policy alone. A mandate that allows the pilot alone opens nothing to anyone else. The policy, the closed list of actions, the day's counters (taken in one breath with the pilot's own budget, given back when an order is not placed) and the monotone mark of the day all apply, then the pilot's own ceilings: deliberations and spend on the model a day.

What it reads is data: every answer of a tool reaches the model framed with the tool it came from, a third party's text named as such, and nothing in an answer calls a tool. Its table has no tool of funds, limits, mandate, unlocking, service or plugins; it never takes `--yes`; arming it, pausing, resuming and stopping it are the person's (refused in a shell nobody holds). A message the person writes to it is something to weigh, never a permission: an order asked for in words is judged like any other.

The trade-off, written as it is: the pilot lives in the guardian, so the model's key and the connection that carries, at each deliberation, the positions, the marks, the account address and the memory share the memory of the unsealed agent key. A local model (LM Studio, Ollama) keeps all of that on the computer.

`lpa pilot stop --flat` closes at market the positions the pilot's activities opened, and only those; `lpa panic` stops every pilot and copy, then locks the key, and holds with no record, no page and no model.

## The live page

`lpa live` shows every activity of the computer as it happens, from the record (`activity.db`, 0600, in the 0700 folder, local only, never a secret: the tokens and the providers' keys are taken out at its door). The page is served on 127.0.0.1 under a token given to the browser through an address good for one visit, the Host and the Origin checked, a strict CSP with `form-action 'none'`, nothing loaded from elsewhere; under the service, the console serves it behind its session.

It writes seven things and nothing else: a message to the pilot, the go of an order the pilot proposed, pause, resume, stop, a line of the memory, stop everything. A write comes from the page itself (its Origin, a JSON body of 16 KiB at most). It places no order of its own, unlocks nothing, changes neither the policy nor the mandate. The go of a proposed order, closing what the pilot opened and stopping everything take the person's go as the host gives it, never through the console's relay: on the command's own page the terminal that serves it asks, as `perps open` asks; under the console, the console's password, checked by the page's own process on a brake of its own. A quote shown is good for 120 seconds on two clocks, once, and for the order it was shown for: otherwise `QUOTE_STALE`, and nothing is signed. A session open for twelve hours is not a person: the freshness is what makes the difference.

## Plugins

A plugin runs in a separate Node process started with the permission model, reading its own folder only, with an empty environment. Measured on Node 24.21.0 on 2026-09-30: it cannot read the config, the sealed key nor the guardian's token, and cannot start a program or a worker; it can reach the network and connect to a Unix socket. The permission model of Node 24 does not cover `node:os` either: a plugin knows the user name, the home folder's path, the name of the computer and its network addresses, and can send them; the install screen says so, and no guard of Node closes it yet. So the guardian answers only requests that carry the token it writes at start, which a plugin cannot read: a real process under the permission model reaches the socket and is refused. The token and the journal are written in place without ever following a link put at their name (a program of the same user could have pointed them elsewhere); every other file goes through a temporary name renamed into place, unique to each write. A file of the folder that reads as `null` is an error, never "absent"; `LPA_HOME` refuses control characters and is judged on what it really names; a folder is a home by what only lpa writes there (`policy.json`, the paper account, a sealed key), never by a `config.json` alone; the journal is read from its end within a bound. The consent screen shows a plugin's words as plain text, and a manifest carrying a control or a bidirectional format character is refused at install; the MCP server lists a plugin's tools from the manifest in its files, under a word `lpa` does not answer to, never from `plugins.json` alone.

A plugin reaches the wallet only through the capabilities its command declared and the person approved at install: reading the markets, the account and the journal, trading on the paper account, proposing an order (the quote and the command line, nothing signed). A call to anything else stops it. Its files are fingerprinted at install and again before each run; a plugin changed on disk does not run. None of its scripts runs at install. What it reads through its capabilities, it could send elsewhere: the install screen says so.

## Honesty

Written the same way in the README of the command:

> Honestly: an agent that goes through `lpa` cannot get around the policy. An agent that reads the guardian's memory, or steals the sealed key file and its password, can talk to Hyperliquid directly; what holds then is Hyperliquid's own refusals above, the key's expiry, and the dedicated account.

The policy is enforced by the guardian, so an agent that only ever calls `lpa` or the MCP server cannot step around it. It is not a boundary against a machine that is already taken. The boundaries against that machine are the ones in the table further up, and the size of the account.

## The network

Two services and nothing else by default: Hyperliquid for the market and the orders, and public Arbitrum nodes for the balances and the deposits. Everything else is something you switch on, the pilot's model among them: a model at a provider receives, at each deliberation, the positions, the marks, the account address and the pilot's memory; a local one keeps them here. The full list, host by host, is in [`network.md`](network.md).
