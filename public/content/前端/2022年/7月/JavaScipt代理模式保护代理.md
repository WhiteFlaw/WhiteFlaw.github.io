@[TOC](文章目录)

---

# 前言
保护代理可以基于筛选条件, 控制抽象对象对真实对象的访问, 藉此真实抽象对象.

比如老板忙, 找了个HR替他招人, HR招个连环鲨人犯进来大伙就危险了, 所以HR要筛查一下.
这也是一种代理模式(Proxy), 在这个过程中HR即是`代理对象`, 保护代理模式下代理还额外负责筛选保护(即筛选求职者), 公司员工则是被保护的`真实对象`, 而求职者是抽象对象.

我认为这是一种在代理模式的基础上进行的业务扩展, 代理, 顺带帮忙保护.

---

# 一、示例说明
我觉得...这个雀食还是看代码来的高效一些.
我们就还是用求职的例子:

```javascript
function Company_reaObj() {       //公司_真实对象
  const join = function () {      //入职函数
    return "Join The Company.";
  }
  return { join };
}

function HRProxy(seeker) {        //HR_代理对象
  this.seeker = seeker;
  
    const interview = function () {   //面试函数
      return (this.seeker.murderer === true) ? "sorry, i cant." : Company_AbsObj().join();
    }
    
    const res = interview();
    return res;
}

console.log(HRProxy({ name: "baiX", murderer: false }));
```
面试函数在起到代理作用的同时兼顾了保护, 筛除掉求职者中的murderer, 如果求职者的`murderer`属性为`false`, 则允许调用入职函数.

从代理模式特点方面来说, `代理对象与真实对象应当具有相同行为.` 
试想一下我是一个代理商, 我代理我的上级卖羊头, 上级前脚刚走我换了个牌子开始卖狗肉(我自己弄一个方法一个新行为), 他那羊头我也不管了反正都是赚钱(也都能达到目的), 这还能叫代理关系吗.

所以`HRProxy`在筛查后将求职者招入时选择了调用`真实对象Company_AbsObj`的`join`方法, 而非自己在代理对象中定义新的方法, 即是为了满足该条.

---

# 总结
上一篇: [JavaScipt设计模式初探-代理模式(一)](https://blog.csdn.net/qq_52697994/article/details/126040222)
下一篇: [JavaScipt设计模式初探-代理模式(三) 虚拟代理](https://blog.csdn.net/qq_52697994/article/details/126066993)
内容有点少, 还没有遇到实战情况.