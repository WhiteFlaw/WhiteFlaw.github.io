---
title: JavaScript事件处理的优化
date: 2024-09-27
cover: /img/d1.webp
desc: JavaScript事件处理的优化
tags: [JavaScript, 前端]
sticky: false
---

# 前言
除了事件委托外另一个从事件处理优化的途径即及时清理挂载的事件处理程序. 
事件委托通过限制了浏览器代码与JavaScript之间建立的联系数量以优化性能，那么及时切断这种联系也可达到相同目的. 

---

# 一、如何清理
但仅移除DOM元素是无法达到目的的. 
删除的元素上若有事件处理程序, 该DOM元素对象就不会被正常清理, 就像闭包不被回收一样, 用得上的东西便不会被垃圾回收机制扔掉.有的浏览器还会把元素对象和事件处理程序都留下.
比较保险的方式是先摘除掉事件处理程序:

```javascript
xxx.onclick = null
```
或
```javascript
xx.addEventListener('click', null);
```
而后移除DOM元素对象便不会残留事件处理程序.

---
# 二、另一个清理时刻
此外，页面unload(卸载)后, 事件处理程序也不会被清理.

 "好像所有浏览器都会受这个问题影响”《Javascript高级程序设计》中称. 

意味着用户每前进, 后退或刷新页面, 内存中都会增加残余对象, 所以最好在onunload事件处理程序中卸载挂载到DOM的事件处理程序.

遵循原则即: 在onload里挂载了什么, 就在onunload里摘除什么. 
```javascript
window.onunload = () => {
  xx.addEventListener('click', null);
}
```

# END
:)