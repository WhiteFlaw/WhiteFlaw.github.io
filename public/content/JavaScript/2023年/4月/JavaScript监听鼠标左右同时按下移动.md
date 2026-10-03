---
title: JavaScript 基于MutationObserver实现拖拽防抖
date: 2023-04-06
cover: /img/d2.webp
desc: JavaScript 基于MutationObserver实现拖拽防抖
tags: [JavaScript, 前端]
sticky: false
---

@[TOC](文章目录)

---

# 前言
基于原生JavaScript, 在使用`three.js`的`raycaster`模拟瞄准及射击时用到.

---

# 一、提前告知
下面的方法可用，但如果你想用一些更高级的方法可以参考：

[【javascript 关于监听鼠标按键的补充】](http://t.csdnimg.cn/sCfsK)

---
# 二、方案
原理使用数组存储对应的信息，每有一个键按下就压入，释放对应弹出. 
```javascript
const obj = window;

let eventList = [];
let isDouble = false;
        
obj.addEventListener("mouseup", e => { mouseUp(e) });
obj.addEventListener("mousedown", e => { mouseDown(e) });
obj.addEventListener("mousemove", e => { mouseMove(e) });

obj.addEventListener("contextmenu", e => { e.preventDefault() }); // 阻止浏览器默认右键菜单

function mouseDown(e) {
  if (e.button === 1) return; // 中键
  eventList.push(e.button); // e.button 0左键 1中键 2右键
  judge();
}

function mouseUp(e) {
  if (e.button === 1) return;
  if (eventList.length === 2) isDouble = false;
  remove(e.button);
}

function mouseMove(e) {
  if(!isDouble) return;
  if(eventList[0] === 0) {
    console.log('left-right-moving');
  } else {
    console.log('right-left-moving');
  }
}
        
function remove(val) {
  if (eventList[0] == val) {
    eventList.shift();
    return;
  }
  if (eventList[1] == val) {
    eventList.pop();
    return;
  }
}

function judge() {
  if (eventList.length === 2) {
    if (eventList[0] === 0) { // 数组全等不区分元素顺序
      console.log('left-right');
    } else {
      console.log('right-left');
    }
    isDouble = true;
  }
}
```

---

# 总结
---
@[TOC](文章目录)

---

# 前言
基于原生JavaScript, 在使用`three.js`的`raycaster`模拟瞄准及射击时用到.

---

# 一、提前告知
下面的方法可用，但如果你想用一些更高级的方法可以参考：

[【javascript 关于监听鼠标按键的补充】](http://t.csdnimg.cn/sCfsK)

---
# 二、方案
原理使用数组存储对应的信息，每有一个键按下就压入，释放对应弹出. 
```javascript
const obj = window;

let eventList = [];
let isDouble = false;
        
obj.addEventListener("mouseup", e => { mouseUp(e) });
obj.addEventListener("mousedown", e => { mouseDown(e) });
obj.addEventListener("mousemove", e => { mouseMove(e) });

obj.addEventListener("contextmenu", e => { e.preventDefault() }); // 阻止浏览器默认右键菜单

function mouseDown(e) {
  if (e.button === 1) return; // 中键
  eventList.push(e.button); // e.button 0左键 1中键 2右键
  judge();
}

function mouseUp(e) {
  if (e.button === 1) return;
  if (eventList.length === 2) isDouble = false;
  remove(e.button);
}

function mouseMove(e) {
  if(!isDouble) return;
  if(eventList[0] === 0) {
    console.log('left-right-moving');
  } else {
    console.log('right-left-moving');
  }
}
        
function remove(val) {
  if (eventList[0] == val) {
    eventList.shift();
    return;
  }
  if (eventList[1] == val) {
    eventList.pop();
    return;
  }
}

function judge() {
  if (eventList.length === 2) {
    if (eventList[0] === 0) { // 数组全等不区分元素顺序
      console.log('left-right');
    } else {
      console.log('right-left');
    }
    isDouble = true;
  }
}
```

---

# 总结
---