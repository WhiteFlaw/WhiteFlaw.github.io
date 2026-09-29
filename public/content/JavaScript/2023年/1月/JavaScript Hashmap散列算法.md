@[TOC](文章目录)

---

# 前言


---


# 一、什么是散列表
散列表是`字典(Dictionary)`的一种实现.
集合以`[值, 值]`形式存储, 字典则以`[键, 值]`对形式, 其中键名用于查询, 字典也称作`映射`, `符号表`或`关联数组`.

`JavaScript`中允许使用方括号获取对象的属性, 将属性名作为"位置"传入即可, 常见的用法:

```javascript
const obj = {
  key: 'val';
}

console.log(obj[key]);
```

在`ECMAScript2015`也就是`ES6`中实现了`Map`, 即此处字典结构.
虽然`ES6`的`Map`可以使用`String`以外的类型作键(因为`Map`可以基于分别存储键和值的两个数组及其方法实现, 内部的结构是可预测的, 这也是它`iterable`的原因), 但是理想的字典结构应该使用`String`类型作键, 这会让查找变得更简单.

参考现实中的字典, 应当具备单词及其释义, 还有一套查找目录, 为了在字典中快速检索值, 将一个`key`(单词)作为索引, 为了保存信息依旧需要原始的`key`(单词), 因此他不能只是一个简单的对象的结构, 不能是这样:
```javascript
{
  key1: 'val1',
  key2: 'val2',
  key3: 'val3',
  key4: 'val4'
}
```

应为:

```javascript
{
  key1: { key1: 'val1' },
  key2: { key2: 'val2' },
  key3: { key3: 'val3' },
  key4: { key1: 'val4' }
}
```
table作为字典：

![在这里插入图片描述](../../../../img/JavaScript/2023年/1月/JavaScript%20Hashmap散列算法/1.png)

字典中解释单词的视觉体验基本是一个大写的单词后面跟着释义.
你可以把最外层的`key`看作用来给目录查找的索引, 找到之后, 这个对象的`key`作为单词大写, 后面值作为释义.

---

# 二、为何使用散列算法
要在数据结构中找到一个值, 采用迭代整个数组来应对, 时间复杂度为`O(n)`, `n`为键值对的数量, 需要检查每一个键值对的匹配情况. 
而如果使用散列函数就知道值的具体位置, 快速检索到该值. 散列函数的作用是给定一个键值, 然后返回该值在表中的位置, 参考上方典型的`Dictionary`数据结构.

在关系型数据库(比如MySQL)中创建一个新的表时, 也可以通过创建索引来更快的查询到记录的`key`.
`JavaScript`语言内部也使用散列表来表示每个对象, 此时对象上的方法和属性被存储为`key`对象类型, 每个`key`指向对应的对象成员
我大胆猜测是这样的:

```javascript
{
  pro: { pro: 'val' },
  add: { add: f() },
  peek: { peek: f() }
}
```

参考第一章典型字典结构的举例.

---

# 三、实现散列算法
目标是建立一个人名与邮箱对应的散列表, 索引会是人名字母转ASCII之和, 但是为了保存数据, 内部的键仍需为人名, 会是这样的结构: 

```javascript
{
  '685': { 'Gandalf': 'gandalf@email.com' },
  '399': { 'John': 'johnsnow@email.com' },
  '645': { 'Tyrion': 'tyrion@email.com' },
}
```

这里直接采用理想化的模式, 键都用`String`, 那么先搞一个转`String`的方法:

```javascript
function defaultToString(item) {
  if (item === null) {
    return 'NULL';
  } else if (item === undefined) {
    return 'UNDEFINED';
 } else if (typeof item === 'string' || item instanceof String) {
   return `${item}`;
 }
 return item.toString();
}
```
仅示例, 这并不是一个完美的方法, 用`toString()`处理复杂类型很糟糕.

---

## 1.字典结构
将会以`table`作为表体.
```javascript
class HashMap {
  constructor (toStr = defaultToString) {
    this.toStr = toStr;
    this.table = {};
  }
}
```

---

## 2.散列函数
指明一个索引，然后返回值在表中的地址, 仅返回地址, 不是返回对应的值.
需要完成人名到ASCII的转换.
```javascript
getHashCode (key) {
  if (typeof key === 'unmber') return key;
  const tableKey = this.toStr(key);
  let hash = 0;
  for (let i = 0; i < tableKey.length; i++) {
    hash += tableKey.charCodeAt(i);
  }
  return hash % 37;
}

hashCode(key) {
  return getHashCode (key);
}
```
在此处它需要返回的地址即该人名的ASCII码之和.

---

## 3.put 设置/更新
大多数编程语言会将对`HashMap`进行`set操作`的函数命名为`put`, 此遵循相同的命名方式.
```javascript
put(key, value) {
  if (key != null && value != null) {
    const position = this.hashCode(key);
    this.table[position] = new ValuePair(key, value);
    return true;
  }
  return false;
}
```
```javascript
class ValuePair {
  constructor(key, value) {
     this.key = key;
     this.value = value;
  }
  toString() {
    return `[#${this.key}: ${this.value}]`;
  }
}
```

---

## 4. 获取值
用人名ASCII之和, 即`hashCode`提供的地址, 获取对应值.
```javascript
get(key) {
  const valuePair = this.table[this.hashCode(key)]; // this.table['685'];
  return valuePair == null ? undefined : valuePair.value;
}
```

---

# 四、使用HashMap处理冲突
## 1.分离链接
这种方法为散列表的每一个位置创建一个链表, 并将索引匹配的元素存放在内部, 如果该索引对应的位置受到了多次添加(即会存在冲突, 值覆盖的情况), 那么将这些该被添加的值全部加入该位置的链表, 而非直接覆盖原值, 缺点是多出的大量链表会占用额外的存储空间, 结构大概如此:

```javascript
{
  '685': [{ 'Gandalf': 'gandalf@email.com' }],
  '10': [{ 'Nathan': 'Nathan@email.com' }, { 'Sargeras': 'Sargeras@email.com' }],
  '7': [{ 'Jack': 'Jack@email.com' }, { 'Athelstan': 'tyrion@email.com' }]
}
```
放在本处, 有些人名不同但是ASCII之和相同, 会出现冲突.

分离链接法需要在原`HashMap`的操作方法上做出改动:
增加方法需要在该位置为`null`即首次添加时添加一个链表, 再把值放进去, 如果不是第一次添加那么直接加入到链表内.
```javascript
put (key, value) {
  if (key !== null && value !== null) {
    const position = this.hashCode(key);
    if (this.table[position] !== null) {
      this.table[position] = new LinkedList(); // 可以看作一个带有自己操作方法的数组
    }
    this.table[position].push(new ValuePair(key, value));
    return true;
  }
  retrun false;
}
```
获取方法需要在该位置存在多个值时将多个值都返回:
```javascript
get (key) {
  const position = this.hashCode(key);
  const linkedList = this.table[position];
  if (linkedList !== null && linkedList.isEmpty()) {
    let current = linkedList.getHead(); // 获取链表表头引用
    while (current !== null) { // 迭代链表
      if (current.element.key === key) { // 寻找匹配键(人名)
        return current.element.value;
      }
      current = current.next;
    }
  }
  return undefined;
}
```

总的来说通过链表避免值覆盖, 将冲突部分用不冲突的方式保留下来了.

---

## 2.线性探查
不借助链表, 在`HashMap`上做线性探查, 找到一个未被占用的位置将冲突值插入.
缺点也显而易见, 放在本例来说, `get`值的时候不能再直接使用索引的ASCII取值了, 因为值冲突时会找到合适的位置插进去, 而索引不能相同, 所以本该属于同一索引下的元素会被插入到其他位置.
```javascript
put(key, value) {
  if (key != null && value != null) {
    const position = this.hashCode(key);
    if (this.table[position] == null) { // 首次添加, 直接加
      this.table[position] = new ValuePair(key, value);
    } else {
      let index = position + 1; // 看看下个位置能不能加
      while (this.table[index] != null) { // 不能加就再往下看
        index++;
      }
      this.table[index] = new ValuePair(key, value); // 有空位, 加
    }
    return true;
  }
  return false;
}
```
而这种不正确的位置占用发生的太靠前将会导致一连串的错误索引出现, 你需要去挨个校对元素的`key`以确保获取到正确的值.
```javascript
get(key) {
  const position = this.hashCode(key);
  if (this.table[position] != null) { // 原始位置不为空, 先看看是不是要找的
    if (this.table[position].key === key) {
      return this.table[position].value; // 原始位置就是要找的, 那么直接返回
    }
    let index = position + 1; // 原始位置只能再往下找
    while (this.table[index] != null && this.table[index].key !== key) {
      index++;
    }
    if (this.table[index] != null && this.table[index].key === key) { // 找着了, key也是正确的, 返回
      return this.table[index].value;
    }
  }
  return undefined; // 找到头了没有, 返回undefined
}
```
找的话用数组`Hashmap`也可以, 但是这个例子的索引是数字`String`, 所以也可以`index++`这样子找.

---

# 总结
--