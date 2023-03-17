# hrc-debug

🇨🇳[中文](https://github.com/hiNISAL/hrc-debug#hrc-debug) | [ENGLISH](https://github.com/hiNISAL/hrc-debug/blob/main/readme-en.md)

`hrc-debug`可以理解成运行在服务端的console面板，把客户端使用`console`输出的内容同步输出到服务端。

目的是为了提升无控制台场景的轻量调试体验，如小程序、手机端浏览器。

原理很简单，就是把console.log/console.error等方法要输出的内容以HTTP的形式发送到服务端，由服务端来输出，也可以做到收集多个客户端的日志数据到服务端。

## 安装

```shell
npm i hrc-debug -D
```

## 使用

```typescript
// SERVER
// 是一个node服务，需要手动用node执行
const service = require('hrc-debug/release/server.js').default;

service({
  port: 3000,
  // 默认可以不传
  route: '/proxy/console',
  // 输出前调用, 可以不传
  beforeOutput: (...args) => {},
});
```

```typescript
// CLIENT
import HRCDebug from 'hrc-debug';
import { appear } from 'hrc-debug/release/appears/browser';
// 微信小程序使用
// import { appear } from 'hrc-debug/release/appears/miniprogram.wx';

new HRCDebug({
  // /proxy/console这个接口是默认实现的
  server: 'http://127.0.0.1:3000/proxy/console',
  // 上报时调用的方法，本质就是个函数，完全可以自己实现，会传递过来每一批要上报的数据
  appear,
  // 可以不传递，修改item里的内容，输出到服务端的也会被修改
  beforeEachQueuePost(chunk) {},
  // 如果配置了，会匹配log/warn/error等第一个参数，完全匹配才会发送
  filterMatcher: '__hrc',
});

// 会在服务端和客户端同时输出
// 目前代理了 log/warn/error
console.log('996');
console.warn('996');
console.error('996');
```

上报会按照166毫秒节流，理论上讲可以保证时序。

## 数据类型支持

客户端和服务端交互才用JSON，非JSON标准的类型是会被JSON过滤的，所以在数据添加到上报队列前会做处理。

目前对以下数据做了处理：

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

非标准JSON的数据会被加上`___hrc_$TYPE`的后缀，比如：

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

对象中的属性互递归的做处理。

## 注意

仅用于调试，别带上线，生产环境用肯定会爆炸[狗头]。

## 名称由来

其实是从IPC通信抄来的，HRC就是 `HTTP Remote Communication`，HTTP远端通信。
