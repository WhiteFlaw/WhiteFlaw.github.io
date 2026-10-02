---
title: JavaScript 如何简化代码里的多级判定
date: 2022-10-26
cover: /img/d1.webp
desc: JavaScript 如何简化代码里的多级判定
tags: [JavaScript, 前端]
sticky: false
---

@[TOC](文章目录)

---

# 前言
`JavaScript`用二元运算符和`if`拆分优化多级判定结构, 用`JavaScript`逻辑运算符替换`if-else`结构判定.

正文在2.2

---


# 一、场景
业务代码里, 一次操作可能会前置多个判定, 我以前只是在函数的开头使用`if`语句去做这些事情, 虽然只是拦截一下不需要做`else`, 但是好多个判定堆在一起看着会有点...`low`, 而且, 如果这些东西堆在函数开头的话, 看起来就像这样:
```javascript
xxx () {
  xxx
  xxx
  xxx
  xxx
  xxxxxxxxxxxxxxxxxxxxxxx
  xxxxxxxxxxxxxxxxxxxxxxxxxxx
  xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
  xxxxxxxxxxxxxxxxxxxxxxxxxx
  xxxxxxxxxxxxxxxxxxxxxxxx
  xxxxxxxxxxxxx
}
```
像在竖大拇指 ), 咳...说回这种方法.

这其实是使用二元运算符 "`&&`"完成的一种简化写法, 可以理解为一种没有`else`的三元运算(因为我的逻辑里需要这种没有处理办法的写法), 我原本以为它需要`void`来驱动...的确可以在这种表达式外围包裹`void`, 我的确是这么做的, 整整一天.
```
void 运算符对给定的表达式进行求值，然后返回 undefined。
```
但其实根本没必要, `void`与否并不干扰执行.
在Vue源码(此处仅指Vue2.6版, 我最近在看这个)里有大量的运用逻辑运算符来表达 "那么" 或者 "so" 的写法, 比如
`src/core/vdom/patch.js`中的这个函数.
```javascript
function sameInputType (a, b) {
  if (a.tag !== 'input') return true
  let i
  const typeA = isDef(i = a.data) && isDef(i = i.attrs) && i.type
  const typeB = isDef(i = b.data) && isDef(i = i.attrs) && i.type
  return typeA === typeB || isTextInputType(typeA) && isTextInputType(typeB)
}
```

---

# 二、优化多级判定
最初我在使用这种改进后的`if`结构, 不再使用包裹式, 而是这种像闸口一样的结构.
当然特殊情况也还是要用`if-else`结构, 能优化就优化, 不能也不要强求.
## 1. 优化if-else结构
就像这样:
```javascript
if() {
  if() {

  } else if() {
  
  } else if() {

  }
} else if () {
  if() {

  } else if() {

  } else {

  }
}
```
再复杂一些, 再在内部加入各种逻辑, 就有些头疼了.
完全可以把每个条件单独分出一个`if`, 顺序不变, 比如以上可以优化为:

```javascript
if () {
  if () {

  }
  if () {

  }
  if() {

  }
}
if () {
  if () {

  }
  if () {

  } else { // else一般没什么办法...

  }
}
```
`else if`里的"或"关系也可以单独拆一个 `if` 出来, 在看起来很复杂的情况下, 提升可读性.

图示一下的话, `if-else-if`结构就像深墙老院:

![在这里插入图片描述](../../../../img/JavaScript/2022年/10月/JavaScript%20如何简化代码里的多级判定/1.png)

优化后的`if`结构更像是关隘:

![在这里插入图片描述](../../../../img/JavaScript/2022年/10月/JavaScript%20如何简化代码里的多级判定/2.png)

有一个专有名词`validation gatekeeping(验证守护)`, 即是描述这种验证结构.

但是一定注意判定条件的次序, 有些地方是必须用`else if`的, 否则会出现一个条件同时执行了多套处理方案的情况比如下面这个例子:

```javascript
for (const key in newWorld) {
  if (key === 'webglGroup') {
    this.worldList[oldWorldIndex][key]['children'] = this.worldList[oldWorldIndex][key]['children'].filter((ele) => { return ele.type !== 'Group' });
    this.worldList[oldWorldIndex][key]['children'].push(...newWorld[key]['children'].filter((ele) => { return ele.type === 'Group' }));
    for (const pro in newWorld[key]) pro !== 'children' && pro !== 'position' && pro !== 'rotation' && pro !== 'quaternion' && pro !== 'scale' && (this.worldList[oldWorldIndex][key][pro] = newWorld[key][pro]);
  } else if (key !== 'frameInfo') this.worldList[oldWorldIndex][key] = newWorld[key];
}
```
这里把`else if`替换成`if`就会导致`key`为`webglGroup`时两条逻辑均会被执行.
所以原则还是能优化的优化.

---

## 2.二元运算符简化
嵌套`else-if`结构不太好用这种方式, 对于优化后的`if`结构用二元运算符重写, 个人觉得外层的大判定还是用`if`可读性会更好, 内部小判定用二元符简洁, 但其实你要是用二元运算符做嵌套判定结构的话, 层级问题会难以处理, 多个'`&&`'运算连在一起的时候JavaScript会将其解析为 仅最后一个`&&`为判定, 其他`&&`全表示 '和' 关系.
当然如果你愿意在里面写函数的话是可以解决这个问题的, 用三元运算符做大判定也是可以的, 但是不好...
重写成如下:
```javascript
if (10 > a > 0) {
  a > 1 && b > 3 && console.log('HelloWorld_1');
  (a > 2 && b > 4  ||  a === 100 && b > 10) && console.log('HelloWorld_2')
  // 这句可以再拆一个if出来的, 只是为了说明判定原理, 括号需要加
  // a大于2并b大于4 或 a等于100并b大于10 均可输出HelloWorld_2
}
if (a > 10) {
  // 可以结合三元运算符
  a === 12 ? c === 3 && console.log("a") : (b === 6 || c === 3 && a !== 15) && console.log("b")
  // 如何让前端同事追杀自己
  // 如果a等于12, 判定如果c等于3输出a
  // 如果a不等于12, 判定b等于6或c等于3并且a不为15,输出b
}
```
但是这种逻辑运算符我现在没有找到能在判定完成之后跳出执行的方法, 也就是说你可以用这个方法沿路做一些顺手的操作, 但是不能像在`if`里那样做完判定可以return跳出函数.
```javascript
const a = 3 < 4 && 1
console.log(a)
```

然后, 额, 你可以用这种方法返回值
目的是提升可读性和简洁化代码, 如果一个很长的处理方案或者很长的条件就这样安插在二元运算符中间, 适得其反.

---

# 总结
如果它对你有帮助, 我很高兴.