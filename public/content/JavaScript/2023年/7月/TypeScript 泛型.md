---
title: JavaScript for与forEach结束本轮循环与跳出循环
date: 2023-07-17
cover: /img/d1.webp
desc: JavaScript for与forEach结束本轮循环与跳出循环
tags: [CSS, 前端]
sticky: false
---

@[TOC](文章目录)

---

# 前言
TypeScript泛型

---

# 一、何时用到?
举例, 一个函数必须接受两个同类型的参数, 然后会将二者组成数组返回, 基本是这样:

```typescript
function toArray(zero: Number, first: Number): Number[] {
   return [zero, first];
}
```
但这样是不是存在问题呢, 规则是该函数应该接受两个同类型参数, 上面的函数能接受两个String吗?
接受不能吧, 很蓝的啦, 除非你写AnyScript:
```typescript
function toArray(zero: any, first: any): any[] {
   return [zero, first];
}
```
或者JavaScript, 但那又无法保证两参数类型一致了.

使用泛型可以解决这个问题, 让这个函数的功能达到预期.
所以说泛型创建可重用的, 不仅能支持目前的数据类型, 也能支持将来的数据类型的结构.

---

# 二、泛型写法
## 1.函数Function + 泛型
所以你可以简单理解泛型就是泛用类型, 某不确定类型需要被泛用, JavaScript内有'魔术字符串'的概念, 为了避免该现象会将魔术字符串存到变量内, 这样以后需要修改字符串的话只需修改一个变量即可了.
同样的你要在各处使用类型, 就把类型看成魔术字符串, 如果你要统一控制到这些类型, 就把类型存进变量.
比如用变量T来存储Number类型, 然后在需要表明类型的地方使用变量T, 就可以在多处统一表明Number类型, 同样的如果T是其他类型, 也可以做到各处的类型统一.

先看看官方介绍的泛型写法:
```typescript
function identity<T>(zero: T, first: T): T[] {
    return arg;
}
identity<string>("myString"); 
```
把T看作变量, 这个变量由调用identity函数时尖括号内的值赋值, 上例中T被赋值为String.
然后两参数zero和first都是T类型, 即都是String类型.

那么就可以做到两参数的类型统一.

也难免会遇到需要多个像T这样的变量的情况:
```typescript
const test = function <T, U>(zero: U, first: T): (U | T)[] {
  return [zero, first];
};

test<string, number>(1, '啊');
```
那么增加一个类型变量U.
尖括号内的T, U, 和形式参数T, U不需要在顺序方面有对应关系.
但是调用函数时尖括号内的类型和函数尖括号内的类型变量是对应的, 不要搞错.

---

## 2.接口interface + 泛型
仍旧把泛型看作变量, getFullName函数的返回值由checkFullName进行检测, 必须存在T类型的namea, 和C类型的nameb.

```typescript
interface checkFullName<A, B> {
  namea: A;
  nameb: B;
}

function getFullName<T, C>(firstName: T, lastName: C): checkFullName<T, C> {
  return { namea: firstName, nameb: lastName };
}

getFullName<string, number>("a", 3);
```
如果需要泛型也遵循接口约束, 可以如下:
```typescript
interface CheckFullName {
  namea: string,
  nameb: number
}

function getFullName<T extends CheckFullName, C>(firstName: T, lastName: C) {
  return { namea: firstName.namea, nameb: lastName };
}

getFullName<CheckFullName, number>({ namea: "10", nameb: 3 }, 3);
```
即T类型的值必须符合CheckFullName格式.

如果firstName的要求是符合checkFullName的类型, 那getFullName调用的时候就要在尖括号内传入checkFullName, 此处即便实际传入了一个对象, 也不能填Object, 用断言也不行.
```typescript
// 两种错误的调用方法
getFullName<object as checkFullName, Number>({ namea: "10", nameb: 3 }, 3);
getFullName<object, number>({ namea: "10", nameb: 3 }, 3);
```

---

## 3.类Class + 泛型
这个例子写的我血压飙升, 我想看完前面之后泛型类该不难理解, 这就是一个普通的类, 你尽可以在里面注册方法, 只是有泛型可以用了.
```typescript
interface HasToString {
  toString: Function;
}

interface ValueObject<A, B> {
  data?: A;
  list?: B
}

class minClass<T extends HasToString, U> {
  constructor(data: T) {
    (this as ValueObject<T, U[]>).data = data; // 此处在下文优化
    // console.log(this.data); // 标红
  }

  // list: U[] = ['a'];
  list: U[] = [];

  add(value: T): void {
    const text = value.toString();
    this.list.push(text);
  }
}

const m1 = new minClass<number, string>(1);
```
实例化minClass, 传入两个泛型T和U, 但是注意, 你需要传入的参数依然是由constructor决定的, 和有几个泛型无关, 这是两套体系.

---

中间有个小插曲, 我将list变量定义为`U[]`类型, 即字符串数组:
```typescript
list: U[] = ['a'];
```
然后数组元素标红了, 我想了好久, 我觉得不该有问题, 确实, 在本次实例化操作里的确不会有问题.

去群里问才知道U也只是本次实例化传入了string导致`U[]`是字符串数组, 这个写法在本次实例化内是合理的, 但这种做法, 我说的是直接将字符串数组`['a']`赋值给list的做法, 将会导致这个类的可重用性降低.
我们并没有限制U的可选类型, 如果在某处进行的下次实例化对U传入Object, 那么此处将会变为:
```typescript
list: Object[] = ['a'];
```
从而出现问题, 所以最终这段代码写作:
```typescript
list: U[] = [];
```

---

另一个小插曲是在完成:
```typescript
const text = value.toString();
```
这几乎是同样的问题, TS表示value内没有toString方法.

它要是说这个value内 `可能` 没有toString方法, 我也就明白了.
因为同样最开始我也没有定义接口去约束 value的类型T 的可选类型, 所以, 当T为某些类型的时候, 的确不会有toString方法, 但在这次实例化中这样写是没问题的, 最后写了个接口去解决.

---

最后, 为constructor内的this定义新的属性也有发生了令人讨厌的事情,  刚开始我这样写:
```typescript
this.data = data;
```
这会有问题, 在TS执行代码检查时, this内是没有data的.
当然可以通过把this设置为any类型来解决, 或者定义一个约束this的接口:
```typescript
(this as any).data = data;
// or
(this as ValueObject<T, U[]>).data = data;
```

但即便这样操作过一次之后, 还是不能直接通过this.data获取:
```typescript
this as ValueObject<T, U[]>
this.data = data;
```
这还是很烂的方案.

---

最后又去找TS里怎么写constructor, 我发现别人都是这么写的:
```typescript
data: T
constructor(dataw: T) {
  this.data = dataw;
  console.log(this.data);
}
```
往this里定义属性的时候都会先定义一下, 也是, data在constructor前面定义完, this里就有data了, constructor内就只是单纯的赋值, 不再需要做无法完成的创建属性操作了, 所以最后是这样的:
```typescript
interface HasToString {
  toString: Function;
}

class minClass<T extends HasToString, U> {
  data: T
  constructor(dataw: T) {
    this.data = dataw;
    console.log(this.data);
  }

  // list: U[] = ['a'];
  list: U[] = [];

  add(value: T): void {
    const text = value.toString();
    this.list.push(text);
  }
}

const m1 = new minClass<number, string>(1);
```
只有在constructor内加入到this的变量才需要提前定义, 像list, 它就不需要提前定义.

---

## 4.泛型接口约束泛型类
你当然也可以用加了泛型的接口去约束一下这个加了泛型的类, 其实就和用普通接口约束普通类一样, 只是有泛型可以用了.

```typescript
interface HasToString {
  toString: Function;
}

interface ValueObject<A, B> {
  data: A;
  list: B;
  add: (value: A) => void; // 至少要表明这是个接受什么返回什么的函数
}

class minClass<T extends HasToString, U> implements ValueObject<T, U[]>{
  data: T
  constructor(dataw: T) {
    this.data = dataw;
    console.log(this.data);
  }

  list: U[] = [];

  add(value: T): void {
    const text = value.toString();
    this.list.push(text);
  }
}

const m1 = new minClass<number, string>(1);
```
在接口内规定的属性, 是否在constructor之前定义不重要, 只要出现即可, 上面代码中接口规定list必要, list不论在constructor前后定义都可以满足接口.

---

## 5.泛型默认值
直接看作ES6默认参数就行了, 参数上写个等号等于默认参数:
```typescript
interface ValueObject<A = string, B = number> {
  data: A;
  list: B
}
```
如此, 只要你不手动传入泛型, 就使用默认泛型:
```typescript
interface ValueObject<A = string, B = number> {
  data: A;
  list: B
}

class minClass<T extends HasToString, U> implements ValueObject {}
```

# 总结
近期最长的一篇吧...
前段时间发生了好多事情, 折腾的确实有点疲惫了, 这几天休息, 会多写几篇吧...