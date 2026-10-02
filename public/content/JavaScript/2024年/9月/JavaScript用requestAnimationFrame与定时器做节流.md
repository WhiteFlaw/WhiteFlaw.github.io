---
title: JavaScript用requestAnimationFrame与定时器做节流
date: 2024-09-27
cover: /img/d1.webp
desc: JavaScript用requestAnimationFrame与定时器做节流
tags: [JavaScript, 前端]
sticky: false
---

# 一、为何优化
requestAnimationFrame每次调用都把其参数函数推入重绘回调的函数队列.
在两次重绘间多次调用同一个更新页面视觉效果的函数, 只有最后且最新一次的结果会被绘制，之前调用结果都被覆盖，浪费性能.

---

# 二、如何优化
二者互相补充对方的缺陷. 

## requestAnimationFrame的缺陷
通过requestAnimationFrame递归地向队列中加入应在重绘回调的函数，可以保证每次重绘最多只调用一次回调函数(一次性回调队列中所有的函数).
这可以用来做节流，但缺陷是requestAnimationFrame会执行函数队列里的所有函数, 推多少就执行多少.
有时候开发者并不能控制函数的调用次数，比如页面滚动事件处理程序，那要是推多了不还是浪费性能吗? 推入函数还需要其他结构加以控制.

---

## 计时器的缺陷
你可能问控制重绘为什么不只用计时器. 《Javascript高级程序设计》中提到以前确实有人用. 
但JavaScript中的计时器时间数值一直存在较小的误差，虽然只有十几甚至几毫秒但也足以影响控制页面重绘，所以用计时器控制重绘更新的尝试不稳定.
而且计时器只会把任务推入队列,但任务不一定会被立即执行，这意味着可能会出现多次连续重绘都未执行更新视图的任务，这将导致掉帧甚至卡顿. 
而由计时器来控制推入频率则不需要那么小的误差.

---

## 缺陷互补方案
二者结合一下, 用计时器限制两次重绘之间时段同一函数的推入数量，用requestAnimationFrame确保稳定的更新.

举例一般屏慕的刷新率60Hz, 即每秒60次即11毫秒1次.这是屏幕的极限, 但大多数时候不冲击极限可得到够好的效果了.

30毫秒推入一次已经不会受到计时器误差影响了，对于requestAnimationFrame，每间隔一次重绘一次：

```javascript
let enabled = true;

function expensiveOperation () { 
  console.log(Date.now());
}

window.addEventListener('scroll', () => { 
  if(enabled) { 
    enabled =true;
    window.requestAnimationFrame(expensiveOperation);
    window.setTimeout(() => { 
      enabled = true, 30);
    }
  }
});
```

---

# END
如有疏漏，请为我指正，谢谢. 