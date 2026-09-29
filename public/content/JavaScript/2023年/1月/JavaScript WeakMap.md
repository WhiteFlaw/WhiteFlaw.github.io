@[TOC](文章目录)

---

# 前言
我在处理一个复杂对象的深拷贝方法时接触到`WeakMap`, 其作为缓存结构以解决对象内部的循环引用问题. 为了改造这个方法, 决定研究`WeakMap`.

---


# 一、为何选用WeakMap
`WeakMap`和`Map`都可以使用对象作为键, `Map`也可以使用基本数据类型作为键, 在特殊的情况下(都使用对象作为键), 两者看起来并无差别.

## 1. Map
`Map`会阻止`JavaScript`的内存回收机制对 `以一个已经被回收的对象作为键的元素` 进行回收.
与`Map`内存储元素的方式有关:
```
A map API could be implemented in JavaScript with two arrays (one for keys, one for values) shared by the four API methods.
`map`在JavaScript内可通过使两个数组被4种方法共享来实现, 向`Map`内设置元素时分别将键和值`push`进这两个数组.
Setting elements on this map would involve pushing a key and value onto the end of each of those arrays simultaneously.
访问`Map`取值时需要遍历, 从两个数组内找到匹配的值.
```

```javascript
var sayings = new Map();
sayings.set('dog', 'woof');
sayings.set('cat', 'meow');
sayings.set('elephant', 'toot');
sayings.size; // 3
sayings.get('fox'); // undefined
sayings.has('bird'); // false
sayings.delete('dog');
sayings.has('dog'); // false

for (var [key, value] of sayings) {
  console.log(key + ' goes ' + value);
}
// "cat goes meow"
// "elephant goes toot"

sayings.clear();
sayings.size; // 0
```

首先`Map`内部基于数组实现, 取值赋值需要遍历, 时间复杂度上来了:

```
The first one is an O(n) set and search (n being the number of keys in the map)
首先设置和查找的时间复杂度都是O(n), n是Map内键的数量.
since both operations must iterate through the list of keys to find a matching value.
因为两个操作都必须遍历每一个键以找到匹配的值.
```

其次数组会一直保留着对元素的引用, 这跟元素是否为引用类型无关, 只要数组不被销毁, 元素的引用也不会被销毁:

```javascript
let ele1 = 'ele1';
let ele2 = { key: 'value' };

let arr = [ ele1, ele2 ];

ele1 = null; // 设置为null脱离当前执行环境, 以便回收机制回收
ele2.key = null;

console.log(arr);
// [ 'ele1', { key: 'null' } ]
```

前面提到`Map`内部可以通过两个数组实现, 那么意味着在`Map`需要销毁前, `Map`内的键和值都无法被`JavaScript`垃圾回收机制回收, `Map`可能会变得臃肿庞大导致内存不足(内存泄漏).

```
持有原始对象引用的映射实际上意味着对象不能被垃圾回收, 这可能会导致意外的内存问题.
如果你希望存储在映射中的对象具有与原始对象相同的生命周期, 请考虑使用 WeakMap.
```

---

## 2. WeakMap
`WeakMap`同`Map`是键值对的集合, 但它的键被弱保持, 即当键所指的对象未在其他地方被引用时, 将被垃圾回收机制回收.
其键必须是对象, 值可以是任意数据类型.

也由于这种弱引用实现的垃圾回收可执行, `WeakMap`内元素的存在变得不可预知(可能垃圾回收机制目前没有回收至此处, 但此处应当回收.), 为了防止执行时出现意外, `WeakMap`没有提供枚举方法.

```
正由于这样的弱引用, WeakMap的key是不可枚举的(没有方法能给出所有的 key).
如果key可枚举, 其列表将受垃圾回收机制的影响, 从而得到不确定的结果。
```

但是`WeakMap`提供的接口与`Map`相同, 可以通过接口稳定的访问元素.

```javascript
let ele1 = { key: "value" };

let weak = new WeakMap();
weak.set(ele1, "ele1");

ele1 = null;

console.log(weak); // WeakMap { <items unknown> } 不赋值null此处结果相同
console.log(weak.get(ele1)); // undefined 销毁 不赋值null此处为'ele1'
```

总之, 相比`Map`, 它更干净利落, 更节约内存.
但是你如果有枚举需求, 或者就是需要一直保存着key不回收, 那就用`Map`.

---

# 二、WeakMap原型方法
指明需要何种操作, 并指明需要操作的键值对的`key`, 直接传变量即可.

| 方法 | 描述 |
|--|--|
| WeakMap.prototype.`delete(key)` | 删除`WeakMap`中与key相匹配的`value`.|
| WeakMap.prototype.`get(key)` | 返回`WeakMap`中与`key`相关联的值, 如果`key`不存在则返回`undefined`. |
| WeakMap.prototype.`has(key)` | 返回布尔值, 断言`WeakMap`对象中该`key`是否存在. |
| WeakMap.prototype.`set(key, value)` | 向`WeakMap`中设置一组新的键值对, 返回设置完毕后的`WeakMap`对象. |

---

# 总结
--