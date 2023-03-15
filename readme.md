# hrc-debug

> 项目构建中

`hrc-debug`可以理解成运行在服务端的console面板。

原理很简单，就是把console.log/console.error等方法要输出的内容以HTTP的形式发送到服务端，服务端来输出。

目的是为了增加无控制台场景的轻量调试体验，如小程序、手机端浏览器。

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
});
```

```typescript
// CLIENT
import HRCDebug from 'hrc-debug';
import { appear } from 'hrc-debug/release/appears/browser';

new HRCDebug({
  // /proxy/console这个接口是默认实现的
  server: 'http://127.0.0.1:3000/proxy/console',
  appear,
  // 可以不传递，修改item里的内容，输出到服务端的也会被修改
  beforeEach(item) {},
});

// 会在服务端和客户端同时输出
// 目前代理了 log/warn/error
console.log('996');
console.warn('996');
console.error('996');
```

## 名称由来

其实是从IPC通信抄来的，HRC就是 `HTTP Remote Communication`，HTTP远端通信。
