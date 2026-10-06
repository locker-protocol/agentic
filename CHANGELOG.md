# Changelog

Everything worth knowing about each version of the four packages, which move together: `@locker-protocol/agent-wallet-hyperliquid-trader`, `@locker-protocol/agent-wallet-hyperliquid-trader-mcp`, `@locker-protocol/agent-wallet-hyperliquid-signer` and `@locker-protocol/agent-wallet-vault`. The SHA-256 of every published tarball is in [`RELEASES.md`](RELEASES.md).

## 2.0.2, 2026-10-06

What a fourth pass found, played from zero on what is online by someone who knew nothing of the product: her own vault created on the production Vault, an install on a fresh computer and one on a server reset, the new account funded for real, a day on each, and the day after.

Version 2.0.1 never reached the registry whole: its signer was published, its three other packages were not, and its changes ship here.

### Fixed

- **Two installations on one account, and the first said its key was still good.** Hyperliquid keeps one trading agent a name for an account, so `lpa setup` on a server replaced the key of the computer set up before it. `lpa doctor` said "expired or emptied" with its remedy cut at the end of the line, while `lpa status`, `lpa agent show` and `lpa unlock` kept saying "179 days left". The four now read Hyperliquid and say the same of such a key: not listed, the two causes (another lpa under the same name, or an account emptied), and `lpa agent renew`; the last line of `doctor` is that remedy, not `lpa unlock`.
- **A day without an order said "1 said none" and nothing of why.** `lpa pilot day` tells the reader's climate and each deliberation's own reason, in the model's words (for example that BTC sat at 61 % of its week's range where the charter opens longs in the lower third): a day without a trade reads as a decision, not a fault.
- **The daily pilot could be scheduled on a real account too small to trade.** `lpa pilot schedule --on --live` reads the account first and refuses under the floor (120 dollars with the default charter), saying what to deposit or how to stay on paper.
- **A real order showed its quote and asked before saying the key was locked.** The guardian's key is checked before the question, for an open as for a close.
- **A real order said "sent" and no more.** When Hyperliquid filled it at once, the terminal says so with the size and the average price, as the paper account always said "filled".
- **The service fee's signature was told by the page alone.** The terminal says it too, with the cap and the recipient.
- **The addresses of the mandate read in lower case** on the terminal and on the ceremony page, where the phone's card reads them in their checksummed form: the two sides now show the same letters.
- `lpa pilot status` said a day under way twice, once as "being played now" and once as "not ended". Once.
- The hints that still said `lpa init` say `lpa setup`: the `account` line of `doctor`, the console's Account card, an order on a computer with no account, the mandate without an agent. The journal line of `doctor` says it "rotates" past 64 MB instead of reading as if it already had. The fresh computer is told about five minutes, the time the way took, not ten. The texts that said "/config", a word of the session, say `lpa config` and name /config as the session's own.


What two complete installations with real funds, played from the first `curl` to the first real order by someone who had never opened a terminal, found and what was done about it.

### Fixed

- **The live page connected to nothing.** `lpa live`, and the same page under the service's console, stayed on "connecting": its script is now built once as a self-contained file and served as it is. The page's token and the activity to open travel in the script's address, as values.
- **A signed answer still in front of the camera stopped the next signature.** The ceremony page now names an answer that belongs to another request, waits for the right one, and says in a screen of its own when it has read, so you know when to lower the phone. The camera sits above the card to compare, so a long card (a mandate) no longer pushes it below the fold.
- **The service fee could be skipped by accident and never asked again.** `lpa agent fee` asks it on its own, and `lpa setup` takes the step up at the missing signature.
- **The funds step stopped when the USDC landed before the gas.** It waits for a little ETH on Arbitrum. It also sees USDC sent straight to the account on Hyperliquid, with no bridge and no ETH, and says both ways before you send anything.
- **A deposit's `lpa init` asked the vault's sync QR again.** It goes on from the account saved on this computer; `--account` reads the vault again.
- **A long at 1x showed a liquidation price of `1.4551915e-11`.** It has none.
- **A close read as the opposite order** ("SHORT 62.5 ... at 3x" to close a long, with a liquidation estimate). It is shown as the close it is: the side closed, the exit, the result of this exit, no liquidation.
- **The story of a day by steps said `@ undefined, stop undefined, target undefined`.** It tells the first step, the ladder and the exit.
- **`lpa pilot status` said "No pilot on this computer" the evening a real day had been played.** It tells the daily pilot first.
- `lpa install --service` from a shell with no terminal ended in 1 although `lpa` was installed; it ends well and says the one step left.
- **A service fee already authorized ended the ceremony in silence**, on the approval's page. The page's last step and the terminal say it is already authorized, and that nothing is to sign.
- **The daily pilot's status said "within a minute" while the day was being played.** It says the day is under way, since when, and where to watch it.
- A funded account's `lpa init` went straight from the sync QR to the password with no word: the terminal says the password and the trading key follow in the same ceremony. The last step of a setup without the service, and the end of the setup, no longer say the same sentence twice. `lpa service install` and `lpa console`, on a server, give the console's address together with the SSH tunnel, before the way out when the port is taken.

### Changed

- **One term for everything: 180 days.** The mandate lasts the agent key's own life by default (180 days at most, never past the key; `--days` signs a shorter one), and the service keeps the key for that whole life, locking only on `lpa lock` or a restart of the machine. It was thirty days for both.
- **The daily pilot has its own clock.** `lpa pilot schedule --on [--live]` has the service play one day every day at the charter's time, in UTC from the service's own clock (no cron, no time zone, a computer asleep plays the day when it wakes), and the follow every hour. A day that cannot start is tried again, four times, then said. `--off` plays no new day and keeps following what is held.
- **The guided setup explains the model**, in a step of its own: what an API key is, where to get one at Anthropic, OpenAI or Google, what a day costs, the free way on your own machine; a "later" is kept. **Its last step schedules the daily pilot on a practice account** (it used to arm the continuous pilot, about three dollars a day, without a word of its cost). The funds step says what the daily pilot asks of the account. The end says what is, from where things stand.
- **The prices of the models are known.** The public price lists of Anthropic, OpenAI and Gemini (read on 6 October 2026) are built in: nothing to type for a model on them; your own price always wins, and a model on no list is still yours to price. The settings page shows the price beside each model, recommends `claude-sonnet-5` (about 9 cents a day of the daily pilot when it deliberates, measured) and "Try it" tries the model the form shows. The model when none is chosen is `claude-sonnet-5`, no longer the dearest.
- **The default charter is the measured one:** longs only, a step of 0.5 daily ATR, a long opened in the lower third of the week's range, the event rule on the shorts alone, a fill counted five basis points through the level. A charter that wants the earlier figures writes them. A day on which no market can reach its entry zone ends before any model is asked and names each market with where it sits; an account too small for the first step is told so, with the equity that would do, before any model is asked.
- A wrong password says which password it is and the way out when it is forgotten. A way out written for an agent ("Ask the user to run...") also says, in words, what it means for the person reading it. `lpa doctor` says what the model is for. The installer ends on one line, `lpa setup`, says where to type it, and tells a person on a server to log out and back in rather than to open a new window.

## 2.0.0, 2026-10-05

First version.

### Safety guarantees of this version

- The mandate has a durable state: `~/.lpa/mandate-state.json` keeps the highest nonce signed here and the revocation, so an older mandate put back, a revoked one put back or a file gone opens nothing, in this guardian and the next; a renewed agent needs a mandate of its own; `lpa mandate revoke` lasts; `lpa mandate release` (the person's password) goes back to the local policy alone; `lpa unlock` and `lpa status` say the mandate's standing.
- The guardian counts what signs in one breath: N openings at once cannot each pass the day's ceilings, N live copies at once cannot each take the whole copy budget; a place taken for an order that was not placed is given back; an equity that does not read opens nothing; a clock that went back keeps the day's counters; an order placed with a journal that could not be written comes back placed, with the reason.
- Live copies: the execution is written as taken before the order leaves (never placed twice after a crash), a reduction that could not be placed is kept and tried again, the budget stays counted while the positions are open and at the read back only a mandate in force takes a copy up, the person's own account is never copied.
- Plugins: a manifest with a control or a bidirectional character is refused, the consent screen is plain text, the MCP server lists a plugin's tools from its files under a free word only.
- MCP: `QUOTE_STALE` when the book (paper or real), the account, the market, the side, the size or the leverage changed between the quote and the go; an order cancelled while the guardian signs it is answered all the same.
- A relayed page is opened in the browser on its one-visit code, never on the console's address that carries the token; the token and the journal are never written through a link; a market named ALL is a market in the session.
- The home: a file holding `null` is not a file that is absent (a policy replaced by four bytes no longer goes back to the defaults); `LPA_HOME` refuses control characters and is judged on what it really names (a link included); a folder is a home by its `policy.json`, its paper account or a sealed key, never by a `config.json` alone; the journal is read within a bound of 8 MB from its end; what a disk answers is named local with its errno.
- The SDK: the 10 s timer of `/info` covers the body; the candles share a memo entry within its tick and the memo is bounded; a user-signed message carrying a field its types do not declare is refused; the UR sequence bound reads every spelling of a length.
- Every published launch line and configuration runs the MCP server with `npx -y --ignore-scripts`; the installer sets `umask 077`.

### More guarantees of this version

- `lpa mandate sign` reads Hyperliquid's clock and refuses to sign more than 5 minutes away from it. `mandate sign` and `mandate show` name the account and the instant signed, and Locker Vault shows both on its card. `lpa mandate revoke` says which of its three outcomes happened.
- A vault answer signed by another account than the one asked is refused with a code of its own, `VAULT_ANSWER_MISMATCH`.
- Copies: a copy that ended is kept beside a new copy of the same trader, and `copy status --all` shows both; `lpa copy resume` asks a running guardian to take its paused copies up; a file of `copies/` that is not a copy of lpa is named by `copy status` and fails `lpa doctor`; `lpa paper on` warns when a live copy runs.
- MCP: every string of a tool has a maximum length in its schema; sizes and prices are plain decimals; a batch holds 64 messages at most, and one failing message no longer takes the batch with it; a line too long is refused as it arrives; a quote is held, not spent, while the world is read again, and the account is part of what must not move between the quote and the go.
- Plugins: a plugin runs on a frozen copy of its approved files; its approval is read again before each call it makes; a plugin that takes a word already taken says so first; an archive over 32 MiB, or 64 MiB unpacked, is refused; the consent screen says that a plugin knows the user name, the name of the computer and its network addresses.
- Policy and quote: a take profit or a stop loss must be on its side of the entry; the exits shown and journalled are the ones the order signs; one risk:reward computation serves the quote and the policy; `lpa policy set` accepts only what a mandate can sign.
- Files: a journal line cut short is closed before the next one; settings files are read within 4 MB; `lpa reset` removes the service first, makes sure no guardian answers before it erases anything, and names the live copies that still hold positions.
- Paper tape and replay: a tape line that does not read is skipped and counted; the tape is written aside, then moved into place; a replay window that holds no candle is refused with what the tape covers.
- The SDK: each `/info` try has its own 10 s window; a market typed in another case is found under its exact name; a number that is not finite, or would be written with an exponent, is refused before it is signed; a sale below the smallest price rises to it instead of 0; a feed whose socket goes silent is closed and resumes.
- The vault library: a sync QR is bounded in characters and in bytes and walked before the library reads it; a signature answer is bounded, its r and s checked on the curve; two animated QR in sight are said as such; a frame count no reader takes is refused before anything is drawn.
- The installer: every path a launcher names is quoted, so a home holding a quote or a dollar sign installs launchers that run; a new launcher is run before it replaces the one that worked; a node reached through a `.` or an empty entry of the PATH is refused; an archive with no SHA-256 written into the installer is refused; `lpa uninstall --all` removes the folder the installer made even when it holds only the settings.

### The command, `@locker-protocol/agent-wallet-hyperliquid-trader`

- `lpa init`: set up with Locker Vault through the QR ceremony. A local page on this computer reads the vault's accounts through the webcam, then shows the approval of a new agent key for the phone to sign. The agent key is created and sealed here, under a password typed in the terminal, before the phone signs. `--days` sets how long the agent lives, 7 by default.
- `lpa unlock` and `lpa lock`: start the guardian, a background process that holds the agent key in memory and signs orders, and take the key back out of memory. The password is typed by the person, never read from the environment or from an argument.
- `lpa doctor` and `lpa status`: the setup check by check, and the account, agent, guardian and mode at a glance. Neither signs anything.
- `lpa wallet address` and `lpa wallet balances`: the vault account, its ETH and USDC on Arbitrum, its margin and spot on Hyperliquid.
- Reads: `lpa perps venues`, `markets`, `quote`, `positions`, `balance`, `orders`, with `--dex <name>` and `--all-dexes` for the HIP-3 dexes. Markets are sorted by 24 hour volume and halted ones are marked.
- `lpa perps regime --symbol <S>` and `lpa perps ranges`: a market's trend, structure, momentum, RSI, volatility and volume; the markets trading in a range now, with their width, support and resistance.
- Orders: `lpa perps open`, `close`, `cancel`, `modify`. Each one quotes, checks the local policy, asks the person, then the guardian rebuilds the order, checks the policy again and signs. `--dry-run` stops before any signature; `--yes` is the person's, never the agent's; `close --all` closes every position. Closing and cancelling are always allowed by the policy.
- Movements of funds: `lpa perps deposit`, `withdraw`, `transfer`, and `lpa agent revoke`. All four are signed by Locker Vault on the phone, never by the agent key.
- Paper account: `lpa paper init --budget`, `status`, `on`, `off`. Fills on Hyperliquid's real book, counts the same fees, needs no key and no vault, and works before `lpa init`. With paper mode on, every `perps` read comes from the paper account, and `modify`, `cancel`, `deposit`, `withdraw` and `transfer` are refused so nothing reaches the real account by mistake.
- `lpa paper record` and `lpa paper replay --strategy <file.json>`: record the market into a local tape (candles at 1 m, 5 m, 1 h and 4 h, and funding), then replay a strategy written as a JSON file on it, with the win rate, its 95 % lower bound, the costs and a verdict.
- `lpa policy show` and `lpa policy set`: the limits every order is checked against, by the command and again by the guardian. Defaults are 100 USD per order, leverage 3, the main dex only, 20 orders a day, a daily loss of 10 % of equity, and a risk:reward guard at 3. Widening a limit takes effect at the next `lpa unlock`.
- `lpa journal [--since 24h]`: what was done, what was refused and what was paid, with the fees of the period as one total.
- `lpa config`: a local settings page for the assistant, the limits, paper trading, the account and the hyperkeel connection.
- `lpa copy start`, `stop`, `status`, `resume`: copy a trader on paper, in the background, inside the guardian, so it keeps running when the session is closed. Nothing is signed. The parts of one order that crosses the book are copied as a single order. Four ways to size an opening with `--sizing`: `proportional` to the equities and never more than `--max-scale` times the trader's size (1 by default), `mirror`, `percent` of the copy's equity as margin, or a `fixed` margin. When the live feed drops or the computer restarts, the trader's executions are read back from Hyperliquid before the copy goes on: a reduction is mirrored however late, an opening more than two minutes old is not chased.
- `lpa copy start --live`: copy a trader on the real account, signed by the agent key in the guardian, under the policy and a mandate signed on the phone that names the trader, with room in its copy budget. The guardian must hold the key; paper stays the default. Each order counts in the day's orders and notional; stopping the copy leaves its positions open, and says so.
- `lpa mandate sign`, `show`, `revoke`: the agent's limits signed once on the phone (Locker Vault shows every bound on its own card), checked by the guardian before every opening, never wider than the local policy. It adds a ceiling on the notional opened per day, the fee recipient and its rate, and what the key may be used for (orders from the agent, live copies of named traders).
- `lpa plugins install`, `list`, `inspect`, `remove`, and `lpa <plugin> <command>`: plugins that add commands and MCP tools. A plugin runs in a separate Node process under the permission model, reading its own folder only, and reaches the wallet only through the capabilities it declared and the person approved (markets, account, journal, paper trading, order proposals); none of them signs for the real account. No script of a plugin runs at install; its files are fingerprinted, and a changed plugin does not run.
- The guardian answers only requests that carry the token it writes at start, which a plugin cannot read.
- `lpa hyperkeel login`, `status`, `logout`, `brief`, `leaders`, `follows`, `follow`, `unfollow`, `alerts`: market data and alerts from hyperkeel.com. Optional, and only reached once you connect.
- `lpa service install`, `status`, `logs`, `start`, `stop`, `restart`, `uninstall`, plus `lpa console` and `lpa console password`: run the guardian around the clock as a service of the system, on this computer or on a server, with a console on `127.0.0.1:7717` behind its own password. The console unlocks the service, renews the agent through the phone, shows the pages of commands typed on the server and lists its warnings.
- `lpa reset` and `lpa uninstall [--all]`: wipe the local state, or remove the command from this computer.
- `lpa` alone opens an interactive session: the same commands as `/` lines with Tab completion over the whole grammar, live views for the markets, a chart with its order book and trades, the hyperkeel radar, the leaderboard and any trader's page, and an assistant on the model of your choice. Seven providers are supported, local models included; without one configured, nothing leaves the machine for an assistant.
- Every command answers in text, or in JSON with `--json` or `--format json`. A refusal carries a stable code and what to do next.
- Fees are shown as one total everywhere they appear: the quote, the confirmation, the paper account, the journal and the JSON output.
- One-line installers for macOS, Linux and Windows, which fetch Node when it is missing, check what they download by SHA-256, need no administrator rights and put everything in `~/.lpa`.

### The MCP server, `@locker-protocol/agent-wallet-hyperliquid-trader-mcp`

- 42 tools over stdio, plus the tools of the plugins the user installs (their answers marked untrusted), each one running the `lpa` command of the same name through the same library, so the local policy, the paper mode and the refusals are exactly the command's.
- Reads, orders, movements of funds, the paper account, the policy, the journal, the doctor, hyperkeel and the paper copies. Orders need `confirm: true`; without it, `perps_open` and `perps_close` answer with the quote and sign nothing.
- Movements of funds answer with the exact line for the user to type, because only the phone signs them.
- `hyperkeel_brief` and `hyperkeel_leaders` read hyperkeel's routes for agents, which need no account.
- Every tool carries its four annotations, so a client can tell a read from an order before it calls.
- `mandate_show`, `mandate_sign` (answers the line the user types; the phone signs) and `mandate_revoke` (only restricts). `copy_start` takes `live`, `sizing`, `max_scale`, `percent` and `fixed_margin`.

### The libraries

- `@locker-protocol/agent-wallet-hyperliquid-signer`: msgpack and keccak of the L1 actions, EIP-712 of the user-signed actions, the agent key, the builder fee, the HIP-3 dexes, the order maths and the reads of the API. An order answers what executed at once (`filledSz`, `avgPx`); `getHlFillsSince` reads an account's executions back over REST, for what a live feed missed. Published in ESM and CommonJS, each with its declarations.
- Every package publishes its JavaScript without comments, and its declarations with their documentation.
- `@locker-protocol/agent-wallet-vault`: the Locker Vault codec. Sign requests (`eth-sign-request`, typed data and transactions), answers (`eth-signature`, multipart), and account sync. Published in ESM and CommonJS, each with its declarations.
