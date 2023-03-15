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
import service from 'hrc-debug/server';

service({
  port: 3000,
});
```

```typescript
// CLIENT
import HRC from 'hrc-debug';
import { appear } from 'hrc-debug/appears/browser';

new HRC({
  server: 'http://127.0.0.1:3000',
  appear,
});

// 会在服务端和客户端同时输出
console.log('996');
```

## 名称由来

其实是从IPC通信抄来的，HRC就是 `HTTP Remote Communication`，HTTP远端通信。
