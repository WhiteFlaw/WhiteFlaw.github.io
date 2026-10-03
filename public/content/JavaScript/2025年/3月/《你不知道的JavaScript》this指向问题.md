---
title: 《你不知道的JavaScript》this指向问题
date: 2025-03-22
cover: /img/d1.webp
desc: 《你不知道的JavaScript》this指向问题
tags: [JavaScript]
sticky: false
---

我只截取了一些我觉得有必要再看的部分，老生常谈的知识我没有放上来.

调用栈:为了到达当前位置所调用的所有函数.调用位置: 当前执行的函数的前一个调用.

如何调试:在某函数第一行打断点或在首行代码前加保留词"debugger;"运行时,调试器会在此处暂停并显现当前调用栈. this的默认绑定取决于函数调用位置.

在setTimeout等回调时会出现丢失this绑定的情况.
于ES5之前,人们使用硬绑定以解此问题:
```javascript
function foo(somthing) {
    console.log(this.a, something);
    return this.a + something;
}
var obj = { a: 2 };
var bar = function() {
    return foo.apply(obj, arguments);
}
var b = bar(3);
console.log(b);
```
但是在ES5后出现了bind，bind在做什么？
尝试用一个工厂函数说明，bind工厂函数:
```javascript
function bindFac(fn, obj) {
    return function() {
        return fn.apply(obj, arguments);
    }
}
```
以下是我自己写的例子，你也可以用bind改造:
使用例:如何在B中回调A的方法,前提B中取不到A？
```javascript
const Obj0 = function() {
    this.a = 0;
    this cl = function(h) {
        console.log(this.a, h); // 0, 1;
    }
    this fun0 = bindFac(this.cl, this); // 可以优化为this fun0 = this.cl. bind(this);
}
const Obj1 = function() {
    this.a = 1;
    this fun1 = function(callback) {
        callback(this); //实战中obj1无法访问obj0, 这是先决条件.
    }
}
const obj0 = new Obj0();
const obj1 = new Obj1();
obj1.fun1(obj0.fun0);
```
# new绑定
"在Javascript中,构造函数只是一些使用new操作符时被调用的函数,它们并不会属于某个类,也不会实例化一个类. 实际上，它们甚至都不能说是"构造函数"这一特殊的函数类型,它们只是被new操作符调用的普通函数而已."
的确,构造函数与普通函数在声明方法上完全相同.其也可以正常方式调用,碍于函数体结构,正常调用无法工作,仅此而已.
Number(),内置对象函数,它是一种构造函数.
ES5.1: 当Number在new表达式中被调用时它是一个构造函数:它将初始化新创建的对象.
so,包括内置对象函数在内,所有函数都可以new调用,这种调用方式名为构造函数调用.
"实际上并不存在所谓的'构造函数',只有对于函数的构造函数调用'"。
构造函数调用时:
1.构造一个全新对象.
2.该对象被执行[[Prototype]]连接.
3.这个新对象会绑定到函数调用的this.
4.如果函数没有返回其他对象,new表达式中的函数调用会自动返回这个对象
new一个函数时,会构造一个对象并绑定到函数作用域的 this上.

# 判断this指向
现在我们可以根据优先级来判断函数在某个调用位置应用的是哪条规则。可以按照下面的顺序来进行判断:
1.函数在new中调用的话this绑定的是新创建的对象。 var bar = new foo()

2.函数通过 call、apply(显式绑定)或者硬绑定调用的话，this 绑定的是指定的对象。
var bar = foo.call(obj2)

3.函数在某个上下文对象中调用(隐式绑定)的话，this绑定的是那个上下文对象。
var bar = obj1.foo()

4.如果都不是的话，使用默认绑定。如果在严格模式下，就绑定到undefined，否则绑定到全局对象。
var bar = foo()

5.箭头函数的this是其所在的作用域.

就是这样。对于正常的函数调用来说，理解了这些知识你就可以明白this的绑定原理.

另外书中介绍了间接引用和软绑定这两种例外，发生时会导致上述判断准则失效.