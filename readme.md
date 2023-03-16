# hrc-debug

`hrc-debug`可以理解成运行在服务端的console面板，把客户端使用`console`输出的内容同步输出到服务端。

目的是为了增加无控制台场景的轻量调试体验，如小程序、手机端浏览器。

原理很简单，就是把console.log/console.error等方法要输出的内容以HTTP的形式发送到服务端，由服务端来输出，也可以做到收集多个客户端的日志数据到服务端。

## 安装

```shell
npm i hrc-debug
```

## 使用

```typescript
// SERVER
const service = require('hrc-debug/release/server.js').default;

service({
  port: 3000,
  // 默认可以不传
  route: '/proxy/console',
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

上报会按照300毫秒节流，在大量请求的情况下暂时不保证时序，所以有可能后发起的LOG比前一批先输出。

## 名称由来

其实是从IPC通信抄来的，HRC就是 `HTTP Remote Communication`，HTTP远端通信。
