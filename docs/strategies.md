# The strategies of the daily pilot

Since version 2.2.0 the charter of the daily pilot no longer holds one way of trading. It keeps how much (the risk, the leverage, the budgets, the events rule) and names a strategy: how the pilot trades, under a name and in one sentence, in a JSON file that `lpa` reads and never executes. This page lists the strategies `lpa` ships and the commands that read, choose, write and measure them.

Nothing here widens a limit. Before any day, `lpa pilot strategy show` says what the local policy and the mandate in force would refuse of a strategy at an equity, and the guardian still refuses it by its code.

Since 2.4.1 a strategy by steps is sized within the largest order the policy and the mandate allow: the day lowers its base stake, the steps keeping their proportions, until its largest step fits, and weighs the whole ladder against the leverage, the orders and the notional of a day before its first step, so that a ladder is never refused half-way. A bound that leaves the first step under Hyperliquid's $10 minimum is named, and nothing is placed.

## The four kinds of method

| Kind | How a position is built and left |
|---|---|
| `ladder` | by steps posted in advance under the price (or at moments, for a DCA), out at the average price plus the target, at once or in parts; no stop |
| `stop` | one position with a stop and a target the trader names, a stop that trails, or a part out first; the size is set so that the stop loses the charter's risk |
| `grid` | buys under the price and sells over it across a range; buying, selling or neutral; what to do out of the range |
| `range` | two entries resting just inside the borders of a range, the first filled cancelling the other, out at a share of its width or at a stop beyond the border |

The stops a strategy sets for itself (a stop in daily ATRs, the border of a range, a grid's exit out of its range, a stop that trails, a time stop) are its method, and they stay. No stop in percent exists above them since 2.4.0: no share of the day's loss or of the loss since the start refuses an order, and no fall of the equity stops the pilot. The pause after losses in a row stays.

A plan keeps the method that opened it: putting another strategy in use never touches a position held, which is followed to its exit.

## The strategies shipped

Eighteen, built from the charter's own figures. `ladder-long` is the charter measured over two years, and the default. Every shipped strategy carries the measure it was shipped with, which `lpa pilot strategy show` gives with its bounds (below).

| Name | Kind | What it does |
|---|---|---|
| `ladder-long` | ladder | Builds a long by steps posted in advance, in the lower third of the week's range, with no stop, and exits the whole position at its average price plus the target. The charter measured over two years. |
| `ladder-both` | ladder | The same steps both ways: a long in the lower third of the week's range, a short in its upper third. Measured over two years: more return than the longs alone, for a deeper worst fall. |
| `ladder-tiers` | ladder | The measured ladder, out in three parts rather than at once: a third of the position at the average price plus 0.5 %, half the rest at plus 1 %, the rest at plus 1.5 %, each on a limit that reduces. No stop. |
| `dca-time` | ladder | A long bought a little at a time: the first entry the trader names, then the same stake at market every three days, eight in all whatever the price, out at the average price plus the target. No stop. |
| `dca-value` | ladder | The same by the value: every three days the code buys what the position lacks to be worth one more stake, more when the price fell, nothing when it rose past the plan; out at the average price plus the target. No stop. |
| `swing-stop` | stop | One position at a time, with a stop and a target the trader names; the code sizes it so that the stop loses the risk of the charter, and three deliberations vote. The way of before 2 October. |
| `swing-trail` | stop | One position with a stop the trader names and no take profit: the stop follows three daily ATRs under the highest price since the entry (over the lowest for a short), never back. The target the trader names is the aim the trade is judged on. |
| `swing-partial` | stop | The same, half the position taken at once the risk, the stop then at the entry with its fees and the rest trailing three daily ATRs. |
| `breakout` | stop | An entry past the high of the last thirty days (a long) or their low (a short), at market or at a trigger beyond it, the stop then trailing three daily ATRs; a position still open 48 hours after its fill is closed at the market. |
| `trend-pullback` | stop | In a strong trend only, an entry near the daily EMA 20, half a daily ATR from it at most, on the side of the trend (over the EMA 50 for a long, under it for a short), with a stop and a target the trader names. |
| `donchian` | stop | No model: each day the code rests a trigger past the high of the last thirty days (over the daily EMA 50) or their low (under it), its stop two daily ATRs away, then trailing three daily ATRs; a trigger more than 10 % from the price waits. |
| `rsi-excess` | stop | In a range only, a long when the hourly RSI is under 30 and a short when it is over 70, back toward the average with a stop and a target the trader names. |
| `funding-fade` | stop | Against the side that pays: a short only when the longs paid 20 % a year or more over the last seven days, a long only when the shorts did, with a stop and a target the trader names. |
| `grid-long` | grid | A grid across the week's range: buys under the price, and over it sells that give back only what is held, never net short; each round trip inside the range pays one step less its fees. Out of the range it holds and waits. |
| `grid-short` | grid | The mirror: sells over the price, and under it buys that give back only what is held, never net long. Past 3 % beyond its range it closes everything at market, since a short held through a rally is liquidated. |
| `grid-neutral` | grid | Buys under the price and sells over it from the start, both sides. Past 3 % beyond its range it closes everything at market, since it would hold the losing side. |
| `range-reversal` | range | Two entries resting just inside the borders of the last six hours' range, the first filled cancelling the other; out at 0.65 of its width or at a stop 2 % beyond the border, never farther than 1.5 times the target. Not in a strong trend. |
| `band-revert` | range | The same on the bands of the last twenty hours, two deviations wide: a buy just inside the lower band, a sell just inside the upper one, out about their average or at the stop. Not in a strong trend. |

## The commands

```text
lpa pilot strategy list
lpa pilot strategy show (--name <name> | --file <path>) [--equity <usd>]
lpa pilot strategy use --name <name> [--equity <usd>] [--preview]
lpa pilot strategy save (--name <name> [--from <name>] [--set "<field>=<value> ..."] | --file <path> [--name <name>]) [--says "<one sentence>"] [--equity <usd>] [--preview]
lpa pilot strategy remove --name <name>
lpa pilot strategy choice [--among <a,b[,...]> [--by model|table] [--table "<Regime>=<name> ..."] | --off] [--today]
lpa pilot strategy draft --message "<what you want, in one sentence>" [--name <name>] [--equity <usd>] [--preview]
lpa pilot calibrate --symbol BTC,ETH --strategy <name> [--starts <n>]
```

* `list` and `show` read and change nothing. `show` says what the trader is told of a strategy, its figures under the charter in use, the smallest account it opens anything on, and what the policy and the mandate would refuse of it at an equity (1 000 USD unless `--equity`).
* `use` puts a strategy in use; `--preview` says the effect and writes nothing.
* `save` writes one of yours, from another with figures changed (`--set "gridLevels=6 gridOutOfRange=stop"`) or read whole from a file, never under a shipped name; every figure is read by the charter's rules and its bounds. Its answer says the strategy as `show` does, before anything is written.
* `remove` removes one of yours, never a shipped one nor the one in use.
* `choice` lets the pilot choose its strategy each day among two to five, by the model in one brief call or by a table of the leading market's regime; a day that cannot choose plays the strategy in use, and says so. `--today` says what today would choose and writes nothing.
* `draft` has the model start from the strategy nearest to one sentence of yours and change the figures you ask for; `lpa` reads every figure, says the strategy and what the limits would refuse, and writes it only when you confirm it in your terminal. Its answer gives the figures changed as `save --set` takes them.
* `lpa pilot calibrate --strategy <name>` measures any strategy over the venue's history without a model: by steps as one account, a grid, a range or a stop by its own measure, market by market, from one or several starting days.

## Two days that open nothing new

- **The agent's last 24 hours.** On the real account, a day ends `key-ending`, no model asked, and a grid or a range is not set again: once the key ends nothing more is signed, not an exit nor a stop moved. What is held is still followed. A notice asks for `lpa agent renew`; once renewed, the schedule plays the day again.
- **A day the model does not answer.** When every call to the model failed, the day ends `model-down`, what is held still followed. `lpa pilot model-down --code` lets the code's breakout rule decide in its place, on a strategy of that shape only (mode `stop`, `breakoutDays`, a trailing exit, as `breakout`); `--nothing`, the default, opens nothing. Nothing is chosen for you.

`lpa pilot plans` says, for each step of a position by steps on the real account, whether it rests on the venue and, when it does not, why (`refusedBy`: the policy, Hyperliquid's minimum, the funds, the guardian or the venue). `lpa pilot end-grid` and `lpa pilot end-range` take `--preview`, which says what ending would cost and give and does nothing; after `--close`, a close the book filled only in part says what is left (`remaining`).

## Measure before real money

A strategy is a hypothesis until it is measured. The measure reads the venue's past candles and funding, asks nothing of the model and places nothing; a return measured from one starting day says little, so measure from several (`--starts`). Each shipped strategy comes with the measure `lpa` made of it from several starting days, in simulation and without a model: `show` says it with its bounds (the worst, the median and the best return of its runs, the worst fall, the trades, the holding of the same markets beside it), its date, its markets and what it assumes of the entries, and `show --json` and `list --json` give it as `measure`. `show` says it in words, never one figure alone, and names the figures of the charter in use that differ from those measured (`measureEnvelope`). It is a measure of the past, not a promise, and its figures move with the days it reads; they are given by `show` alone, never on this page. A strategy you write is born unmeasured, and `show`, `list` and the charter say so.

## Learn more

* [The security model](security-model.md)
* [Every host `lpa` connects to](network.md)
* [The package README](https://www.npmjs.com/package/@locker-protocol/agent-wallet-hyperliquid-trader), section "The strategies"
