---
title: Promise回调地狱优化
date: 2023-09-15
cover: /img/d1.webp
desc: Promise回调地狱优化
tags: [CSS, 前端]
sticky: false
---

 

# 前言
依据《JavaScript高级程序设计》对Promise期约相关进行查缺补漏.

---

# 一、执行器函数的执行顺序
执行器函数虽作为期约的参数, 却是期约的初始化程序在同步队列中执行, 即程序从上到下执行下来碰到期约, 会先在同步任务队列执行完执行器函数再进去期约.

ECMAScript暴露的异步结构中, 任何对象都有then方法, 而有实现了该方法的结构即被认为实现了thenable接口. `Promise`的原型上也实现了`then()`方法:
```javascript
new Promise((resolve, reject) => {
...
}).then();
```
`then()`只接受函数类型参数且最多2个. 

---

# 二、如何在then()中抛出错误
```javascript
then(()=>{
  throw 'baz';
}); 	
then(()=>{
  Error('qux');
}) 
```
两种都正确，前者抛出报错;
后者返回一个包装于Promise对象中的错误对象可以反应调用栈情况, 以正常值输出. 

---

# 三、期约的"非重入"特性
期约"落定"后, 处理程序(即then的参数函数`onResolved`和`onRejected`)仅会加入排期而非立即执行, 而排在处理程序后的同步语句会先执行, 此特性是由Javascript运行时保证的，即then内部语句的输出会晚于then外部更加靠后的语句的输出. 
其原因为在一个落定期约上调用then虽会把then中的处理程序推进消息队列, 但在当前线程上的同步代码执行完成前处理程序依然不会被执行. 更符合常理一些的写法, 对一个已写入处理程序的期约落定后, 也会是这样的输出顺序. 

---

# 四、串行化期约
期约连锁: `then()`内再构建期约, 串行化异步任务即：

```javascript
new Promise((resolve, reject) => { 
  console.log ('P1 executor'); 
  setTimeout (resolve, 1000);
})
.then (() => { 
  new Promise((resolve, reject) => { 
    console.log('P2 executor'); 
    setTimeout(resolve, 1000);
})
.then(() => {
  new Promise((resolve, reject) => { 
    console.log('P3 executor'); 
    setTimeout(resolve, 1000);
});
```
但书中似乎认为这种串行式结构并未解决回调地狱(未明确表明).

---
# 五、应对回调地狱
可见第四节这种串行结构有同质部分，如果将同质部分使用工厂函数调用生产，这种结构可以演化为：

```javascript
function delayedResolve(str) {
  return new Promise((resolve, reject) => { 
    console.log(str);
    setTimeout (resolve, 1000);
  });
}  //工厂函数

delayResolve('P1 executor').then(() => { 
  delayResolve('P2 executor');
})
.then(()=> {
  delayResolve('P3 executor')
})
```

每次调用"生产"返回一块期约对象同质部分，返回后相当于回到了期约串行结构:

```javascript
new Promise().then(() => {
  delayResolve();
}).then()
```

上例期约体同质部分只分为一种，打比方如果上例有一段串行块的期约内还输出了1，这就是另一种同质部分，就要再单独为这段输出了1的期约构建工厂函数.

以上为基础，如果不使用期约，以回调函数形式唤起后续的异步操作就会是这样：

```javascript
function delayedExecute(str, callback = null) { 
  setTimeout(() => { 
    callback && callback();
  }, 1000)
}

delayedExecute('P1callback', () => {
  delayedExecute('P2callback', () => {
    delayedExecute('P3callback', () => { 
      delayedExecute('P4callback');
    });
  });
});
```
《JavaScript高级程序设计》中称这样的一种结构, 破除了回调地狱. 

那么这种结构到实战中，加上ajax请求就不能再每次传一个字面量，因为我们要模仿回调地狱里下个参数为上个结果的情况，就要把上次请求的结果传到下个回调函数内：

```javascript
function delayedExecute(params, callback = null) { 
  $.ajax({
    url: 'xx/xx',
    type:'post',
    data: { a: params.a, b: params.b },
    success (res) { 
      callback && callback(res);
    }
})
}

delayedExecute(data0, (res0) => {
  delayedExecute(res0, (res1) => {
    delayedExecute(res1, (res2) => { 
      delayedExecute(res2);
    });
  });
});
```

# 结语
如有疏漏，请为我指正，谢谢. 