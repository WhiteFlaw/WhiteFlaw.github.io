---
title: 微信小程序triggerEvent组件传值
date: 2022-06-05
cover: /img/d8.webp
desc: 微信小程序triggerEvent组件传值
tags: [前端]
sticky: false
---

@[TOC](文章目录)

---

# 前言
承上一篇的例子, 记录一下小程序里子组件给父组件传值.
《[微信小程序 组件传值(一) properties 父传子](https://blog.csdn.net/qq_52697994/article/details/125130865)》

---

# 一、子组件暴露事件
只需要来这么一行就可以暴露出一个自定义的事件, 比如这个, 事件名是`up`, 传值传出变量`something`.
这里也是一样的, 下面这条语句其实就像`this.emit("事件名", 值)`

```javascript
//子组件.js
handleTap() {
  var something = "我是值";
  this.triggerEvent("事件名", 要传出的值)
}
```

---

# 二、父组件接收
然后父组件这边就可以在子组件上使用
`bind:事件名="父组件事件处理函数"`
监听这个自定义事件了, 并且负责对这个自定义事件进行处理的函数, 可以接受到子组件triggerEvent传的值:

```html
<!-- 父组件.wxml -->
<!-- handleUp和子组件就没关系了,它是父组件对该事件的处理函数,
   就像bindtap="xxx"的"xxx"一样 -->
<navbar 
  bindtap="handleTap"
  bind:up="handleUp">
</navbar>
```
之后, 我们可以在handleUp里尝试接收一下子组件的传值:

```javascript
//父组件.js
Page({
  handleUp(evt) {  //evt里包含了子组件传来的someThing
    console.log(evt.detail);
  }
})
```

---

# 总结
感觉上一篇父传子里掺杂了太多组件构成的操作, 回去改一下...
想起刚开始学Vue的时候, 学到这里突然有个疑问: 我自定义了事件, 但是如何去触发它(
比如click会由鼠标点击触发, 但是我的`up`呢, 我也没有定义如何触发...
到了后来我还是没弄明白这个问题, 我只知道比如在一个click事件函数里用emit发事件, 这个自定义事件就会在我click的时候被触发....
我还是打算去探究一下这个问题的.