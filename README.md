# poloniex-value-estimator

a [kefir stream](https://rpominov.github.io/kefir/) of your Poloniex account's value, in BTC and USD.

## install

```
git clone git@github.com:elsehow/poloniex-value-estimator.git
cd poloniex-value-estimator
npm i
```

try an example (requires InfluxDB running):

```
node example/influx.js
```

## TODO

- method to fetch new balances
- "pass through" per-coin balances, values + btc value
- simple example (?)
- restart on error (?)

## license

BSD
