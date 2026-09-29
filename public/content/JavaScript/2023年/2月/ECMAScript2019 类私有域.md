@[TOC](文章目录)

---

# 前言
呃, 被只读属性绊了一跤误打误撞去了解了它. 
我需要深拷贝一个对象, 但这个对象内有一个`position`属性, 每次尝试更改它的值都会报错：
```
Uncaught (in promise) TypeError: Cannot assign to read only property 
'position' of object '#<Group>'
```
不得不说这个"`#`"彻彻底底的误导了我, 让我觉得这是私有属性造成的(但其实只要用`Object.defineProperty`处理一下`writable`就好了.)
但在我发现之前还是去研究了一下.

---

# 一、私有属性&私有方法
```
类属性在默认情况下是公有的，但可以使用增加哈希前缀 # 的方法来定义私有类字段，
这一隐秘封装的类特性由 JavaScript 自身强制执行。
```
学`TypeScript`的时候想过, JavaScirpt内可否也实现`TypeScript`那样的私有属性, 像是这样:

```typescript
class Person {
  private name: string
  public constructor(name: string) {
    this.name = name
  }
  public speak(val: string) {
    this.name = val;
    console.log(`${this.name} is speaking`)
  }
}
```
我得到的答案是不能实现完全的私有, 我看到过有人介绍在属性前加`#`以标识为私有属性的用法, 但据说只是一种约定俗成的规矩, 执意要改也能直接修改这种属性的值.

现在看来这句话没错, 但仅限非类条件(比如声明一个全局变量`#obj`).

如果用`new`类生成一个对象, 类内部的属性如果以`#`开头, 就是一个仅能在类内访问的属性.
尝试在类外部访问:

```javascript
class Obj {
  #privateField;
  constructor () {
    this.#privateField = 42;
  }
  #Group = {
     position: { a: 1 }
  };
  #rotations = 3;
  #fun = function() {
     console.log('private method.');
  }
}
const obj = new Obj();
console.log(obj.#rotations); // 标红
console.log(obj.#privateField ); // 标红
console.log(obj['#privateField'] ); // undefined
console.log(obj.#fun); // 标红
console.log(obj.rotations); // undefined
```
你可以看到忽略`#`尝试访问属性的结果是`undefined`, 这个`#`符号实际上是名称的一部分.
```
Property '#rotations' is not accessible outside class 'Obj'
because it has a private identifier.javascri
```
除了类外部无法访问之外, 类的内部如果在不经声明情况下引用, 或者尝试`delete`删除该属性也将导致错误:
```
// 未声明的引用
Uncaught SyntaxError: Private field '#privateField' must be declared in an enclosing class
```
```
// 尝试 delete 删除
Uncaught SyntaxError: Private fields can not be deleted (at index.html:16:29)
```

```
Like public fields, private fields are added before the constructor runs in a base class, or immediately after super() is invoked in a subclass.
```



---

# 二、静态私有属性&静态私有方法
静态属性只能被静态方法调用.
静态方法只能从类内部或者类外部对该类, 类实例化为对象后将无法从该对象中访问该静态方法.

```
私有静态字段在解析类结构时被添加到类的构造方法（constructor）中.
静态变量只能被静态方法调用的限制仍然成立.
```

```javascript
class StaticPrivate {
  static #private_static; // 静态私有属性
  static private_static = 3; // 静态公有属性
  static publicStaticMethod() { // 静态公有方法
    StaticPrivate.#private_static = 42;
    return StaticPrivate.#private_static;
  }
  static #publicStaticMethod = function() { // 静态私有方法
    StaticPrivate.#private_static = 42;
    return StaticPrivate.#private_static;
  }
}

const staticPrivate = new StaticPrivate();

console.log(StaticPrivate.publicStaticMethod()); // 42
console.log(StaticPrivate.private_static); // 3
console.log(staticPrivate.publicStaticMethod()); // Uncaught TypeError: staticPrivate.publicStaticMethod is not a function
console.log(staticPrivate.private_static); // undefined
```

---

# 三、如何解除私有
用`Object.defineProperty`, 在该对象内重新将该属性定义一次, 将原属性覆盖:
```javascript
class Obj {
  #fun = function () {
     console.log('private method.');
  }
}
const obj = new Obj();
Object.defineProperty(obj, '#fun', {
  value: function () {
     console.log('public method');
  },
  writable: true // 如果不想每次都来这么一下的话
})

console.log(obj['#fun']); // f () {...}
obj['#fun'] = 3
console.log(obj['#fun']); // 3
```

# 总结
又办了个蠢事啊...

--