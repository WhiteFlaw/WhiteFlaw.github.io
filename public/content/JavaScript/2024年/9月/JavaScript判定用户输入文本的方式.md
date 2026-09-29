---
title: JavaScript判定用户输入文本的方式
date: 2024-09-21
cover: /img/d1.webp
desc: JavaScript判定用户输入文本的方式
tags: [CSS, 前端]
sticky: false
---

监听`textInput`事件以获取其事件对象event，该事件的事件对象上有`inputMethod`属性，该属性有9个可能的值：
```javascript
1 // 键盘输入
2 // 粘贴
3 // 拖入
4 // IME
5 // 表单中选取
6 // 手写输入
7 // 语音输入
8 // 多方法混合
9 // 脚本赋值
```
监听`textInput`事件以访问`inputMethod`属性，根据其值判断用户的输入手段，以下示例：
```javascript
const ele = document.querySelector("#ele");
ele.addEventListener("textInput", (event) => {
 console.log(event.inputMethod);
}) 
```