---
title: JavaScript for与forEach结束本轮循环与跳出循环
date: 2023-05-25
cover: /img/d7.webp
desc: JavaScript for与forEach结束本轮循环与跳出循环
tags: [JavaScript, 前端]
sticky: false
---

@[TOC](文章目录)

---

# 前言
我以前一直想尝试一下这个`for`里嵌`switch`来着, 找不到合适的机会, 今天写node脚本刚好遇到, 必须狠狠的尝试一下.

---


# 一、for
## 1.终止当前轮次
我先把正确写法放在这里, 如果循环没有到1, 2, 5中的任何一个数, 那么就不输出这个数, 即不执行`console.log(arr[i]);`.
```javascript
function init() {
  for (let i = 0; i < arr.length; i++) {
    switch (arr[i]) {
      case 1:
      case 2:
      case 5:
        console.log('');
        break;
      default:
        continue;
    }
    console.log(arr[i]);
  }
}

const arr = [1, 2, 3, 4, 5, 6];

init();
```

最开始我是这样写的:
```javascript
function init() {
  for (let i = 0; i < arr.length; i++) {
    switch (arr[i]) {
      case 1:
      case 2:
      case 3:
        console.log('');
        break;
      default:
        return;
    }
    console.log(arr[i]);
  }
}

const arr = [1, 2, 3, 4, 5, 6];

init();
```
结果看起来很正确, 123, 但是很快我意识到这可能是到了4就直接没再循环下去, 4之后的俩数根本都没判定?
所以就不把switch的筛选数弄得那么顺了, 跳着来看看是不是终止执行了:

```javascript
function init() {
  for (let i = 0; i < arr.length; i++) {
    switch (arr[i]) {
      case 1:
      case 2:
      case 5:
        console.log('');
        break;
      default:
        return;
    }
    console.log(arr[i]);
  }
}

const arr = [1, 2, 3, 4, 5, 6];

init();
```
如果5没输出, 说明执行到3就直接打住了.

![在这里插入图片描述](../../../../img/JavaScript/2023年/5月/JavaScript%20for与forEach结束本轮循环与跳出循环/1.png)

果然是有问题的, `return`直接将整个函数都返回了, 连`for`后面的东西都不执行了.
那么需要一个能仅跳过本轮for循环的语法作为`default`的处理方案.
`continue`在`for`里是跳过当前循环.

顺带说, 上面用到了`break`, 但`break`外面首先是`switch`所以循环仍会继续, 如果没有这层`switch`直接在`for`里使用`break`是会直接终止`for`循环的, 参考下面例子.

---

## 2.终止循环
来复现一下上节末尾谈到的情况:
```javascript
function init() {
  for (let i = 0; i < arr.length; i++) {
    switch (arr[i]) {
      case 1:
      case 2:
      case 5:
        console.log('');
        break;
      default:
        return;
    }
    console.log(arr[i]);
    break;
  }
}

const arr = [1, 2, 3, 4, 5, 6];

init();
```
按照我的说法, 这个时候应该是只输出一个1的, 因为第一轮循环输出完之后直接就循环终止了:

![在这里插入图片描述](../../../../img/JavaScript/2023年/5月/JavaScript%20for与forEach结束本轮循环与跳出循环/2.png)

是吧.

`for...in`结束和跳过循环方法同上.

---

# 二、forEach
## 1.终止当前轮次
终止本轮次很简单, 你只要在`forEach`里`return`一下就可以终止本轮次.
```javascript
function init() {
  arr.forEach((item) => {
    if (item === 1) return;
    console.log(item);
  })
  console.log('www');
}

const arr = [1, 2, 3, 4, 5, 6];

init();
```
这会输出23456.
但是可以看到这并不会把整个`forEach`结束掉, 那应该没有数字输出才对.

---
## 2.终止循环
你可以选择抛出错误来终止`forEach`, 但是没有什么手段去好好的, 和平的结束它.
MDN:

![在这里插入图片描述](../../../../img/JavaScript/2023年/5月/JavaScript%20for与forEach结束本轮循环与跳出循环/3.png)

---
# 总结
终于要30w阅读量了, 感谢各位两年多以来的支持, 你们给了我不小的精神支持, 让我在这条路上走下去, 我也会继续走下去.