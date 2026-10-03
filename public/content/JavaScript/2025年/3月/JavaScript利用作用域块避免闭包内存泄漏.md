---
title: JavaScript利用作用域块避免闭包内存泄漏
date: 2025-03-19
cover: /img/d8.webp
desc: JavaScript利用作用域块避免闭包内存泄漏
tags: [JavaScript]
sticky: false
---

出自《你不知道的JavaScript》上卷
以下是本书给出的反例:
```javascript
function process (data) {...}
var bigdata={...}
process(bigdata);
var btn = document.getElementById('x');
btn.addEventListener('click', function click{...});
```
click会被回调在其他位置, 在addEventListener函数内作为闭包函数.
但其原作用域为全局,其会保留对原作用域的引用, 故全局作用域一直存活.
以下为本书给出的正例:
```javascript
function process(data) {...}
{
    var bigdata = {}
    process(bigdata)
} ∥ 子作用域块会被回收
var btn = document.getElementById('x');
btn.addEventListener('click', function click(ev){..});
```
如此，使用显式创建的作用域块将需要回收的部分包裹，但注意不要将闭包函数需要使用的结构包裹进去，回收后会导致闭包函数无法正常工作..

以下放我自己写的示例:
```javascript
function outside(){
    let data1=[];
    {
        const data0=[1,2,3,4,5];
        data1 = data0.filter(num){
            return num > 2;
        });
     }
    return function inside(){
        return data1;
    }
}
const a = outside()();
console.log(a);
```
注意要用let和const.
以上把闭包需要的data1留下，其他的哪怕是用于生产data1的结构都可以放到子作用域块回收.