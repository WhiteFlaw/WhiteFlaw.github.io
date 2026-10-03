---
title: 《你不知道的JavaScript》再次探讨原型、类与构造函数
date: 2025-04-05
cover: /img/d5.webp
desc: 《你不知道的JavaScript》再次探讨原型、类与构造函数
tags: [JavaScript]
sticky: false
---

我只截取了一些我认为有用的"至理名言"记下来.
加双引号的为书中原话.
这是老生常谈的话题了啊，我在我的博客里不止3次探讨它们3个的关系，每一次都是认知上的迭代.

"JavaScript中的对象有一个特殊的[[Prototype]]内置属性,其实就是对其他对象的引用."
"当你试图引用对象的属性时会触发[[Get]]操作,操作第一步是检查对象自身是否有该属性."
"但如果该属性不在对象中,就需要使用对象的[[prototype]]链."

# 原型链的尽头
所有普通的[[Prototype]]链最终都会指向内置的Object.prototype,
Object.prototype对象包含JavaScript中许多通用的功能，比如toString()这种非特定类型可用的方法.	

“实际上,JavaScript才是真正应该被称为'面向对象'的语言,因为它是少有的可以不通过类,直接创建对象的语言."
在JavaScript中,类无法描述对象的行为,对象直接定义自己的行为".
前面提到JavaScript中并无真正的类,由class定义的'类'也只是对一个对象的抽象描述,是对一个对象结构的描述.

# 类函数
多年以来，JavaScript中有一种奇怪的行为一直在被无耻地滥用,那就是模仿类.
"这种奇怪的类似类的行为利用了函数的一种特殊特性:所有的函数都会默认拥有一个名为prototype的公有的不可枚举属性指向另一个对象,这个属性通常被称作'函数的原型', 这个称呼对我们造成极大的误导,对prototype对象最直接的解释是通过new构造的每个对象将最终被[[prototype]]链链接到这个xxx.prototype对象.
```javascript
function Foo() {}
let a = new Foo();
console.log (Object.getProtoTypeOf(Foo) === Foo); //true;
```
new时会创建a,其中一步即将a内部的[[prototype]]链接到Foo.prototype指向的对象.(即将Foo实例的原型链链到构造函数的原型Foo).
"实例化一个类就意味着把类的行为复制到物理对象中."
"在JavaScript中,并没有类似的复制机制,你不能创建一个类的多个实例,只能创建一个类的多个对象,并把它们的原型链联到'类函数'的原型对象上".
复制后我们得到两个互相关联的对象,我们没有初始化一个类,也从未从'类'中复制任何一个行为到对象中,我们所做的只是让两个对象互相关联,即让new xxx()所得对象关联到xxx.prototype，这是'实例化'工作的一部分,是一个意外的副作用所为.
"这个机制通常被称为原型继承"
"继承意味着复制操作,JavaScript不会复制对象属性,而是在两个对象之间创建一个关联,实现对象A通过委托访问对象B的属性.
用'委托'来描述JavaScript中的对象
关联机制更准确.

下面是在类那一节提过的,我曾认为该在子类中更加明确的表述特殊的事物,而非仍强调与父类同样模糊的概念.
但我以前并不知道这叫什么,这在JavaScript中专业术语名为'差异继承',举例即父类为交通工具的话,你不必在子类Car中再强调这是交通工具,而是该强调专属于Car这种交通工具的特征.

前面也提到new函数时会将实例的[[prototype]]连接到函数的prototype,除此之外,实例的原型上还有一个公有的不可枚举属性constructor指向创建这个对象的函数.
函数的原型上也有.constructor引用函数原型对象所关联的函数:
```javascript
Fun.prototype.constructor = ==Fun; 
fun.constructor === Fun;
```
其实constructor并非"指向创建这个对象的函数"
而是函数原型上的constructor默认指向该函数.
实例上r.constructor只是通过默认的原型链[[prototyro]]指向函数,与"构造"这一步毫无关系,也不能说明就一定是谁构造了谁.

如果在实例化前把函数原型替换为一个新对象,然后访问实例的constructor,那么实例上是没有.constructor属性的,所以其委托[[prototype]]上的函数原型查找,但也不会找到.constructor属性,所以又向上委托,直至委托给委托链顶端的Object.prototype,作为JavaScript内置对象，它有constructor.
如果不替换Foo函数的原型,那么Foo的原型上有constructor，为Foo(具体有没有可以用hasOwnProperty验证,因为这个方法不查找原型链.

而如果直接访问一个实例原型的.constructor，原型上也是没有construtor, 要委托函数原型查找，函数原型上的.constructor是指向函数的,所以返回函数.