---
title: JavaScript变量提升的作用
date: 2022-06-22
cover: /img/d1.webp
desc: JavaScript变量提升的作用
tags: [JavaScript, 前端]
sticky: false
---

@[TOC](文章目录)

---

# 前言
复习一下变量提升机制, 本来是打算做个错题集来着...扯的有点多了)
我以前写过一篇JavaScript预解析机制, 哈, 刚才去看了一下差距还是有的.

不同于在编译后可以直接运行的编译型语言, JavaScript作为一门解释型语言, 在执行之前要先由解释器进行转换, 形成机器可以理解阅读的机器语言, 要说的变量提升属于这个转换过程中的一步.

---

## 预解析时期
变量提升存在于这个时期.
变量声明后还未初始化, 默认值undefined, 经过预解析步骤中的变量提升, 引擎解析的时候就能够最先遇到这些声明, 也就提前在内存中分配空间, 让变量和函数最先在内存中存在, 提前分配空间或许出于一些对于性能上的考虑吧. 
所以变量提升在交付引擎进行正式执行之前就完成了, 提升和扫描寻找变量这步并不是在正式执行时间段完成(是不是由引擎完成也还不知道...)

---

## 正式执行时期
变量提升对引擎正式执行JavaScript的影响.

依照v8引擎对JavaScript的解析流程, 先对预解析后代码进行词法分析, 将代码分解为词元(token), 之后引擎对词元(token)进行语法分析, 生成抽象语法树(Abstract Syntax Tree).

引擎每遇到一个声明, 就会将这个声明绑定到一个作用域, 同时内存中会为这个变量开辟一份空间(分配一份内存).

我还是希望知道变量的默认值为什么会是`undefined`而不是甚麽别的值, 还有undefined的出现是不是与内存有关系;

之后引擎翻译器会将代码翻译生成字节码, 所有变量已经绑定到各自的作用域, 所以执行过程中引擎每遇到需要使用这些变量或者函数的情况, 就会沿着作用域链(Scope Chain)向外寻找.

最后字节码解释器生成机器可直接阅读的机器码交付执行.

---

# 一、举例
主要是预解析步骤的操作.

## 1. 函数提升-求以下代码执行结果
```javascript
(function() {
  var x = foo();
  var foo = function() {
    return "foobar"
  };
  return x;
})();
```
x在foo前面定义, 此时foo为Undufined, 所以`x=foo()`会报错TypeError.
1.提升阶段
```javascript
var x;
var foo;
```
2.解析阶段

```javascript
var x = foo()
//"foo()" is not defined;
var foo = function() {...}
```

---

## 2. 函数提升-求以下代码执行结果

```javascript
var foo = function() {
  return x - y;
}

function() foo(x, y) {
  return x + y;
}

var num = foo(1, 2);
```
结果为-1,第一个赋值式函数, 匿名函数需要通过变量引用指向函数的运行结果.
具名函数可以单独定义, 但其实这个题目主要问题在于哪个函数会被赋值到foo
num和foo会被优先提升, 但不会赋值, 之后函数会得到提升, 那么第一阶段就是两个未赋值变量和一个函数.
第二阶段foo变量被赋值了一个表达式, 从此这个表达式foo覆盖了具名函数foo.
之后num赋值, 调用foo, 自然会是调用最新的foo, 即foo变量(对应的表达式)

1. 提升阶段
```javascript
var foo;
var num;
function foo(x, y) { return x + y }
```

2. 执行阶段
```javascript
var foo = function(x, y) { return x - y }
var num = foo(1, 2);
```

---

## 3.函数提升-求以下代码的结果
```javascript
var a = 100;
function a() {
  var a = 200;
  console.log(a);
}
a();
```

抛出异常, 函数提升在变量提升之前进行, 函数提升完毕后的空间位置也在变量a的前面, 但是之后a的赋值操作将a赋值为100, 而不是一个函数表达式, 所以无法执行.

1.提升阶段
```javascript
function a(){...} 
var a;
```

2.执行阶段
```javascript
function a(){...}
var a = 100;  //最后a根本不再是一个函数;
a();
```

---

## 4.变量提升-求以下代码的结果

```javascript
function f() {
  console.log(x);
  var x = 200;
  console.log(x);
}
f(a = 100);
console.log(a);
```
函数内的变量值还好, 主要是外面这个a输出完是甚麽, 100, 或者undefined?

解析过程中向f()传入`a = 100`, 其实相当于全局声明`a = 100`之后将a作为形参传入f().
所以结果为100, 200, 100

---

## 5.class类不提升-求以下代码的运行结果

```javascript
var a = 1;
function() {
  console.log(a);
  class a {}
  console.log(a);
}
```
class类和let一样具有暂时性死区, 也就是在一个区块内, let, const, class这些暂时性死区的命令声明的变量从一开始就形成了封闭作用域(比如块级作用域);
所以就是按序执行, 第一次输出为

---

## 6.函数提升-求以下函数的输出结果

```javascript
var a = 1;
function fn() {
  var a = 2;
  function a() {
    console.log(3);
  }
  return a;
  function a() {
    console.log(4);
  }
}
var b = fn();
console.log(b);
```

1.提升阶段
```javascript
function fn() {
 function a() { console.log(3); }
 function a() { console.log(4); }
 var a
}
var a;
var b;
```

2.执行阶段
```javascript
function fn() {
 function a() { console.log(3); }
 function a() { console.log(4); }
 var a = 2;
 return a;
}
var a = 1;
var b = fn();
console.log(b);
```

---

# 总结
正好也提到undefined和内存了, 纠正一下自己以前的一个错误思想, 我以前错误的把undefined认为成等同于"not defined", 很多时候在处理报错问题上, 两者雀食也可以混用, 但要知道两者表达的并不是同一种意思, 一个变量是undefined说明这个变量存在, 在内存里也存在了, 但没有值, 而`not defined`意思是这个变量还没被声明, 在内存里也不存在.

期末了...最近的时间真的是被拆的零零碎碎, 很难完成一些系统性的工作...