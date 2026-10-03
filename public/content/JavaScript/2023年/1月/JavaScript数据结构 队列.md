---
title: JavaScript数据结构 队列
date: 2023-01-08
cover: /img/d1.webp
desc: JavaScript数据结构 队列
tags: [JavaScript, 前端]
sticky: false
---

@[TOC](文章目录)

---

# 前言


---


# 一、队列数据结构
与栈的先进后出原则相反, 队列遵循的是先进先出(FIFO), 在队尾入队, 在队首出队, 新增者必须被添加至队尾.

## 1.创建队列
如果基于对象来实现队列, 那么获取元素操作的时间复杂度会更低.
`item`对象作为队列本体, `count`属性描述队列的大小, `lowestCount`辅助描述第一个元素.
```javascript
class Queue {
  consructor () {
    this.count = 0;
    this.lowestCount = 0;
    this.items = {};
  }
}
```
直接操作这个队列总是不安全的, 还需要一些方法来规范队列的操作标准.

## 2.设置操作方法
1. 增加元素, 按照队列的原则, 必须加到队尾, 由`enqueqe`实现.

```javascript
class Queue {
  consructor () {
    this.count = 0;
    this.lowestCount = 0;
    this.items = {};
  }
  enqueqe (element) { // 由队尾添加元素
    this.items[this.count] = element;
    this.count++;
  }
}
```
由于`items`是`Object`类型, 增加元素需要使用`count`作为键, 每次新增元素完毕`count`加1, 预备下一次元素增加.

2. 移除元素, 参考栈模型出栈, 必须从队首移除, 越早加入队列的元素将越早遭到移除.
不能使用数组`pop`方法的情况下依靠`lowestCount`枚举属性并`delete来移除.`
```javascript
class Queue {
  consructor () {
    this.count = 0;
    this.lowestCount = 0;
    this.items = {};
  }
  dequeqe() { // 由队首移除元素
    if (this.isEmpty()) { // 判定队列当前是否为空, 防止报错;
      return undefined;
    }
    const result = this.items[this.lowestCount]; // 获取队首元素
    delete this.items[this.lowestCount]; // 删除队首元素
    this.lowestCount++;
    return result;
  }
}
```

3. 检查队首元素
返回位于队首的元素.
```javascript
class Queue {
  consructor () {
    this.count = 0;
    this.lowestCount = 0;
    this.items = {};
  }
  peek() {
    if (this.isEmpty()) {
      return undefined;
    }
    return this.items[this.lowestCount];
  }
}
```

4. 检查队列是否为空
```javascript
class Queue {
  consructor () {
    this.count = 0;
    this.losestCount = 0;
    this.items = {};
  }
  isEmpty() {
    return this.count = this.lowestCount === 0;
  }
}
```

5. 获取队列长度
```javascript
class Queue {
  consructor () {
    this.count = 0;
    this.losestCount = 0;
    this.items = {};
  }
  size () {
    return this.count - this.lowestCount;
  }
}
```

6. 清空队列
构造函数数据全部重置为初始值.
```javascript
class Queue {
  consructor () {
    this.count = 0;
    this.losestCount = 0;
    this.items = {};
  }
  clear () {
    this.items = {};
    this.count = 0;
    this.lowestCount = 0;
  }
}
```

使用就不说了, 看得明白方法就能用.

---

# 二、双端队列
双端队列是一种特殊的队列, 它允许队尾队首的添加和撤销操作, 而非普通队列的队尾进队首出.
双端队列同时遵守先进后出和后进先出原则, 可以说是栈和队列的结合数据结构.

## 1.创建双端队列
老样子, 双端队列和普通队列看起来没什么不同, 只是操作原则上更自由.
```javascript
class Deque {
  constructor () {
	this.count = 0;
	this.lowsetCount = 0;
	this.items = {};
  }
}
```

## 2.设置双端队列方法
情况会比普通队列复杂一些:

1. 由队首增加元素
排队, 但是直接插到队首.
```javascript
class Deque {
  constructor () {
    this.count = 0;
    this.lowestCount = 0;
    this.items = {};
  }
  addFront (element) {
    if (this.isEmpty()) { // 空队列, 不考虑队首尾, 直接添加
      this.addBack(element)
    } else if (this.lowestCount > 0) { // 见解释2
      this.lowestCount--;
      thid.items[this.lowestCount] = element;
    } else { // 见解释3
      for (let i = this.count; i > 0; i--) {
        this.items[i] = this.items[i - 1];
      }
      this.count++;
      this.lowestCount = 0;
      this.items[0] = element;
    }
  }
}
```
解释2:
`lowestCount`作为最小键已不为0, 说明调用`addFront`前队首移除过元素, lowestCount作为目前最小`key`应当减1后作为新的最小key加到队首
```javascript
items = {
  3: 'hello',
  4: 'baiX'
}
```
此时`lowestCount`为3, 说明012已遭到移除, 那么增加新的元素于队首, 新`key`应当为2, 故`lowestCount`需要减1.

解释3: 
队首从0开始的队列, 在队首增加元素, 可以直接使`lowestCount`继续减1, 队首key进入负数范围, 但本处希望key依旧从0开始, 那么需要将所有队列元素向队尾移动1位, 为新元素腾出位置.

2. 由队末增加元素
排队, 规规矩矩排到队尾.
```javascript
class Deque {
  constructor () {
    this.count = 0;
    this.lowestCount = 0;
    this.items = {};
  }
  addBack(element) {
    this.count++;
    this.items[this.count] = element;
  }
}
```

3. 由队首移除
排队打饭, 打到了, 走人了.
```javascript
class Deque {
  constructor () {
    this.count = 0;
    this.lowestCount = 0;
    this.items = {};
  }
  removeFront() {
    if (this.isEmpty()) { // 判空防止报错
      return undefined;
    }
    const result = this.items[this.lowestCount];
    delete this.items[this.lowestCount]; // 删除队首元素
    this.lowestCount++; // 更新最小key为曾经倒数第二元素的key.
    return result;
  }
}
```

4. 由队尾移除
排了半年, 等烦了, 跑了.
```javascript
class Deque {
  constructor () {
    this.count = 0;
    this.lowestCount = 0;
    this.items = {};
  }
  removeBack() {
    if (this.isEmpty()) {
      return undefined;
    }
    this.count--;
    const result = this.items[this.count];
    delete this.items[this.count];
    return result;
  }
}
```

5. 获取大小&判空
```javascript
class Deque {
  constructor () {
    this.count = 0;
    this.lowestCount = 0;
    this.items = {};
  }
  isEmpty() {
    return this.size() === 0;
  }
  size() {
    return this.count - this.lowestCount;
  }
}
```

---

# 三、基于双端队列实现回文检查器
```
回文: 正反都能读通的单词, 词组, 数, 或一系列字符的序列, 例如madam.
```

```javascript
function palindromeChecker(aString) {
  if (aString === undefined ||
    aString === null ||
   (aString !== null && 
    aString.length === 0)) {
      return false;
  }
  const deque = new Deque(); // 实例化双端队列, 上面声明过的.
  const lowerString = astring.toLocaleLowerCase().split('').join(''); // 全小写字符串
  let isEqual = true;
  let firstChar, lastChar;
  for (let i = 0; i < lowerString.length; i++) {
    deque.addBack(lowerString.charAt(i)); // 拆解字符串逐个加入队列
  }
  while (deque.size() > 1 && isEqual) { 
  // 首尾同时取, 对称性检查, 一旦不对称isEqual改为flase跳出循环.
  // 该循环会在达到队列中央元素/不再存在元素时停止
    firstChar = deaue.removeFront();
    lastChar = deaue.removeBack();
    if (firstChar !== lastChar) {
      isEqual = false;
    }
  }
  return isEqual;
}

```

---

# 总结
--