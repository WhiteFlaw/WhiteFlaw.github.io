---
title: javascript监听鼠标按键的补充
date: 2024-09-21
cover: /img/d2.webp
desc: javascript监听鼠标按键的补充
tags: [JavaScript, 前端]
sticky: false
---

 

# 前言
依据《JavaScript权威指南》和两年间的理解，对以前的文章作出补充. 

2022年文：
[【JavaScript 原型、继承、原型链 】](http://t.csdnimg.cn/So6Oh)

---

# 一、构造函数与对象的关系
构造函数产生对象. 

我们说原型对象原型对象，prototype的值必是对象类型（Javascript里各种类型都可以说是对象，要指名是对象的时候就说对象类型）.

通过new一个构造函数的方式创建对象，对象的原型prototype与构造函数的prototype相同，对象的构造函数constructor为该构造函数.

 Mozilla实现的Javascript暴露了`__prototype__`属性用于直接读写对象的原型，不推荐使用，因为并非所有浏览器都实现. 

---

# 二、何为构造函数
写法上与普通函数没有区别，但构造函数就是用来new实例化对象的，将其作为正常函数调用，通常无法正常工作，而正常的函数能够完成任务.
任何Javascript函数都可以当做构造函数使用（能不能正常工作另说）. 

---

# 三、命名约定
构造函数名应当大写以区别于普通函数和方法，因为定义构造函数相当于定义类. 
因为通过同一个构造函数实例化的所有对象都继承自同一个对象，因此所有的对象都是同一个类的成员.

---

# 四、原型
调用函数需要用到prototype属性，所以每个构造函数自动拥有一个prototype属性（Function.bind()返回的函数没有prototype），其唯一的值为实例化出该原型对象的constructor.

---

# 五、原型链如何形成
原型prototype内有用于实例化它的constructor，前面提到constructor作为函数自动拥有prototype属性，内部有唯一一属性constructor，constructor内又自动有prototype，内部有唯一属性constructor，这是无限的，所以输出一个对象的时候，constructor或者prototype那一行总是能无限展开. 

以上的代码示意，即原型链中各原型对象的构造函数相同
```javascript
const fun = function ab() {}

// fun == fun.prototype.constructor
/* fun.prototype.constructor.prototype.constructor
 == 
fun.prototype.constructor.prototype.constructor.prototype.constructor;
 */
```

---
# 结尾
如有疏漏，请为我指正，谢谢. 