# hrc-debug

🇨🇳[中文](https://github.com/hiNISAL/hrc-debug#hrc-debug) | [ENGLISH](https://github.com/hiNISAL/hrc-debug/blob/main/readme-en.md)


`hrc-debug` can print debug info at server from client.

thats for some no `console panel` case like `mobile` or `miniprogram`.

## INSTALL

```shell
npm i hrc-debug
```

## USAGE

```typescript
// SERVER
// nodejs http server, need run this script by `node` command
const service = require('hrc-debug/release/server.js').default;

service({
  port: 3000,
  // not required
  route: '/proxy/console',
  // not required
  beforeOutput: (...args) => {},
});
```

```typescript
// CLIENT
import HRCDebug from 'hrc-debug';
import { appear } from 'hrc-debug/release/appears/browser';
// for wechat miniprogram
// import { appear } from 'hrc-debug/release/appears/miniprogram.wx';

new HRCDebug({
  server: 'http://127.0.0.1:3000/proxy/console',
  // appear method
  appear,
  // not required
  beforeEachQueuePost(chunk) {},
  // if provide this prop, only first arg match this value will be report
  // ☑️ console.log('__hrc', 123);
  // ❌ console.log(123);
  filterMatcher: '__hrc',
});

// will print both at server and client
// support log/warn/error
console.log('996');
console.warn('996');
console.error('996');
```

## DATA TYPE SUPPORT

- NaN
- Infinity / -Infinity
- String
- Number
- Boolean
- BigInt
- Symbol
- Function
- null
- Undefined
- Object

the data type not in JSON standard will append suffix `___hrc_$TYPE`, like:

```js
// CLIENT
console.log({
  a: 123n,
  b: Symbol('88'),
  c: undefined,
  d: 996,
});

// SERVER
{
  a: '123n___hrc_BigInt',
  b: 'Symbol(88)___hrc_Symbol',
  c: 'undefined___hrc_Undefined',
  d: 996,
}
```

## TIP

**do not used at production env***.

## NAMED FROM

HRC mean `HTTP Remote Communication`，tis from `IPC`.
