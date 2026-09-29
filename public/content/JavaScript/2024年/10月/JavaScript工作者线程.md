---
title: JavaScript工作者线程
date: 2024-10-19
cover: /img/d1.webp
desc: JavaScript工作者线程
tags: [CSS, 前端]
sticky: false
---

 

---

# 前言
创建工作者线程来处理繁杂的计算，网络请求或其他花费时间的工作，避免阻滞页面加载. 

但需要注意创建工作者线程也是一个花费较大的行为，去除“成本”能够得到多少收益需要自行斟酌. 

---

# 一、创建工作者线程
创建工作者线程的方式之一是加载Javascript文件，并将文件路径提供给Worker构造函数：
```javascript
// main.js
const worker = new Worker (location.href + './worker.js');
```
安全限制_同源策略: 工作者线程加载的脚本文件只能从与父页面相同的源加载. 
```javascript
const remoteOriWorker = new Worker('https: //untrusted.com/worker.js'); //从非同源地址加载
// 报错
```
也有加载非同源文件的方式: importScripts()，后面会说. 

---

# 二、使用工作者线程
最重要的是主线程和工作者线程通信，工作者线程在主线程外帮处理复杂的事情，但处理完还是要拿给主线程用，或者通知主线程的. 

实例化Worker构造函数返回的worker对象暴露的API可用于在上下文和工作者线程间通讯, 以及捕获工作者线程发出的事件.

onerror: 工作者线程中出错 worker对象发出该事件;该事件可被监听:
```javascript
worker.addEventListener('error', handler);
```

onmessage: 工作者线程中发生 messageEvent类型事件时(工作者线程中向上下文发送消息时), worker对象发出该事件:
```javascript
worker.addEventListener('message', handler);
```

postMessage(): 通过异步消息事件向工作者线程发送信息，这是一个方法.

terminate(): 不为工作者线程提供清理机会,立即中止工作者线程，方法. 

---

# 三、性能
worker对象在该工作者线程终止前不会被回收.

断开worker对象引用后无法恢复引用关系, worker对象也不会被回收.

---

# 四、工作者线程特点
```javascript
// worker.js
console.log('worker:', self);
// main.js:
const worker = new Worker('./ worker.js');
console.log ('worker obj:', worker);
```
工作者线程具有不可忽略的启动延迟, 以上代码工作者线程的打印落后于主线程. 
本例中self.console将两线程的消息序列化后打印，但打印顺序依赖于浏览器自行判断，结果是出乎意料的. 

---

# 五、工作者线程的全局对象
WorkerGlobalScope工作者线程中的全局对象,在工作者线程中通过self关键字暴露，self是window的严格子集, 其中部分同名属性值不同, self中不同：
```javascript
navigator: 返回与工作者线程关联的 WorkerNavigator.

self: 返回WorkerGlobalScope对象 location: 返回与工作者线程关联的 WorkerLocation.

performance: 返回只包含特定属性和方法的performance对象.

console: 返回与工作者线程关联的console对象,对API没有限制.

caches: 返回与工作者线程关联的cacheStorage对象,对API无限制.

indexedDB: 返回IDBFactony对象.

isSecureContext: 返回布尔值, 反映工作者线程上下文是否安全.

origin: 返回workerGlobalSeope的源.
```

---

# 六、工作者线程的类型
每种类型的工作者线程都使用自己特定的全局对象,不过都是WorkerGlobalScope的子类.
```
专用工作者线程: DedicatedworkerGlobalScope
共享工作者线程: SharedworkerGlobalScope
服务工作者线程: ServiceworkerGlobalScope
```
这些将在后续文章中描述. 
这三种子类的使用多于基础的工作者线程. 

---

# END
专用工作者线程等会在下篇完成. 
如有疏漏，请为我指正，谢谢. 