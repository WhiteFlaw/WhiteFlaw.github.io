@[TOC](文章目录)

---

# 前言
这是一个基于原生`JavaScript`+Three.js的系统, 我需要在里面增加撤销恢复的功能, 这并非针对一个功能, 而是各种操作.
主要记录思路.

---


# 一、初期设想
栈似乎很合适, 用栈存储状态. 
最近的一次操作入栈存在于栈顶, 而撤销操作只需要对栈顶的状态进行操作, 这遵循栈的后进先出原则(LIFO).
然后再设置一系列方法去操作栈, 增加一点安全性.

首先是各种功能应该在什么地方发起出入栈操作, 这里有一大堆js文件.
其次对于不同的功能需要收集什么参数来组织状态入栈.
不同的功能出栈应该分别进行什么操作, 回撤出栈肯定要调这堆文件里的方法来把老状态填回去.

# 二、如何收集状态
先写个demo，我建了一个数组栈放在`class Manager`, 设置了入栈方法`push`, 出栈方法`pop`以及查看栈顶的`peek`方法.
```javascript
class Manager {
    constructor() {
        this.stats= [];
    }
    push(action) {
        this.stats.push(action);
    }
    pop() {
        const nowAction = this.doActions.pop();
    }
    peek(which) {
        return this.doActions[this.doCount];
    }
}

export { Manager }
```
收集状态就不得不去满地的找了, 操作都写好了, 还是不要乱动.
除非单独写一套独立的逻辑, 执行系统的同时也执行我自己的, 但这基本是要重写一套系统了(

---

## 1.通信尝试
但还是要想办法把各处的数据都划拉到`Manager`里.
呃, 老实说我并没有什么原生开发的经验, 我在多个文件里引入了`Manager`类并且期望着这些文件可以基于`Manager`建立联络实现数据共享, 比如在a.js和b.js内:
只是举个例子, 不要用一个字母去命名文件.

```javascript
// a.js
import { manager } from "./backup/manager.js";

const manager = new Manager();

const action = {
  name: 'saveWorldList',
  params: {
    target: '108',
    value: [
      world: {
        psr: {},
        annotation: {}
      }
    ]
  }
}

for (let i = 0; i < 3; i++) {
  manager.push(action);
}
```

```javascript
// b.js
import { manager } from "./backup/manager.js";

const manager = new Manager();

const undoAction = manager.pop();
console.log(undoAction);
```
然而这样做并不能实现数据共享, 每一个刚刚实例化出来的对象都是崭新的.
```javascript
const manager = new Manager();
```
只是使用原始干净的`class Manger`实例化了一个仅存在于这个模块里的对象`manager`.

---

## 2.如何通信
如果将一个对象放在公用的模块里, 从各个文件触发去操作这一个对象呢...公用模块里的数据总不至于对来自不同方向的访问做出不同的回应吧?

```javascript
class Manager {
    constructor() {
        this.stats= [];
    }
    push(action) {
        this.stats.push(action);
    }
    pop() {
        const nowAction = this.doActions.pop();
    }
    peek(which) {
        return this.doActions[this.doCount];
    }
}

const manager = new Manager();

export { manager }
```

之后分别在各个js文件引入`manager`, 共同操作该模块内的同一个`manager`, 可以构成联系, 从不同位置向`manager`同步数据.
`manager`几乎像服务器里的数据库, 接受存储从各处发送的数据.

---

# 三、管理者与执行者
现在入栈方案基本确定了, 一个入栈方法`push`就能通用, 那出栈怎么办呢.
不同的操作必须由不同的出栈方法执行.

最初设想是写一个大函数存在`class manager里`, 只要发起回撤就调这个函数, 至于具体执行什么, 根据参数去确定.
但是这方法不太好.
首先, 我会在用户触发`ctrl + z`键盘事件时发起回撤调用回撤函数, 但是我只在这一处调用, 如何判定给回撤函数的参数该传什么呢? 如果要传参, 我怎么在`ctrl + z`事件监听的地方获取到该回撤什么操作以传送正确的参数呢?
另外, 如果这样做, 我需要在manager.js这一个文件里拿到所有回撤操作需要的方法和它们的参数, 这个项目中的大部分文件都以一个巨大的类起手, 构造函数需要传参, 导出的还是这个类, 我如果直接在`manager`里引入这些文件去`new`它们, 先不说构造函数传参的问题, 生成的对象是崭新的, 会因为一些方法没有调用导致对象里的数据不存在或者错误, 而我去使用这些数据自然也导致错误.

我最好能拿到回撤那一刻的数据, 那是新鲜的数据, 是有价值的.

另外`manager`会在许多地方引入, 它最好不要太大太复杂.

---

## 1.数据驱动
传参的方案十分不合理, 最好能用别的方法向回撤函数描述要执行怎样的回撤操作.
在入栈的时候直接于数据中描述该份数据如何进行回撤似乎也行, 但是以字符串描述出来该如何执行?
用`switch`吗, 那需要在回撤函数内写全部处理方案, 哪怕处理方案抽离也需要根据`switch`调取函数, 就像这样:

```javascript
class Manager {
  constructor () {
    this.stats = [];
  }
  pop() {
    const action = this.stats.pop();
    switch (action) {
	  planA: 
        this.planAFun(action.params);
      break;
      planB: 
        this.planBFun(action.params);
      break;
      // ...
    }
  }
}
```
将来万一要加别的功能的回撤, 一个函数百十行就不太好看了, 还是在类里面的函数.
那...把`switch`也抽出去? 似乎没必要.

---

## 2.管理者
参考`steam`, 嗯, 就是那个游戏平台)
`steam`可以看作游戏的启动器吧, 抛开人工操作, 如果需要启动游戏,那么先启动steam, steam再去启动游戏, steam可以看作一个管理者.
管理者只需要去决定, 并且调用分派事项给正确的执行者就好, 管理者自己不执行.
参考你老板.

然后`Manager`可以作为这样一个角色, 它只负责维护状态和分配任务:

```javascript
import { Exec } from './exec.js';
import { deepCopy } from "../util.js";

const executors = new Exec(); // 执行者名单

class Manager {
  constructor() {
    this.editor = null;
    this.doCount = 0;
    this.doActions = [];
    this.undoCount = 0;
    this.undoActions = [];
    this.justUndo = false;
    this.justRedo = false;
  }
  do(action) { // 增加状态
    if (this.justUndo || this.justRedo) { // undo/redo后, world不应立即入栈
      this.justUndo === true && (this.justUndo = false);
      this.justRedo === true && (this.justRedo = false);
      return;
    }
    this.previousWorld = action.params.value;
    this.doActions.push(action);
    this.doCount++
    console.log("Do: under control: ", this.doActions);
  }
  undo() { // 回撤事项分配
    if (this.doActions.length === 1) {
      console.log(`Cannot undo: doSatck length: ${this.doActions.length}.`);
      return;
    }
    const nowAction = this.doActions.pop();
    this.doCount--;
    this.undoActions.push(nowAction);
    this.undoCount++;

    const previousAction = this.peek('do');
    const executor = this.getFunction(`${previousAction.name}Undo`);
    executor(this.editor, previousAction.params)
    this.justUndo = true;
    console.log(`Undo: Stack now: `, this.doActions);
  }
  redo() { // 恢复事项分配
     if (this.undoActions.length === 0) {
       console.log(`Connot redo: redoStack length: ${this.undoActions.length}.`);
       return;
     }
    const nowAction = this.undoActions.pop();
    this.undoCount--;
    this.doActions.push(nowAction);
    this.doCount++;

    const previousAction = nowAction;
    const executor = this.getFunction(`${previousAction.name}Redo`);
    executor(this.editor, previousAction.params);
    this.justRedo = true;
    console.log(`Redo: Stack now: `, this.doActions);
  }
  getFunction(name) {
    return executors[name];
  }
  reset() { // 重置状态
    this.doCount = 0;
    this.doActions = [];
    this.undoCount = 0;
    this.undoActions = []
  }
  peek(which) { // 检视状态
    if (which === 'do') {
      return this.doActions[this.doCount];
    } else if (which === 'undo') {
      return this.undoAction[this.undoCount];
    }
  }
  initEditor(editor) {
    this.data = editor;
  }
}

const manager = new Manager();

export { manager }
```
`justUndo`/`justRedo`, 我的状态收集是在一次请求前, 这个请求函数固定在每次世界变化之后触发, 将当前的世界状态上传. 所以为了避免回撤或恢复世界操作调用请求函数将回撤或恢复的世界再次重复加入栈内而设置.

`undo`或者`redo`这两种事情发生后, 执行者`manager`通过原生数组方法获取到本次事项的状态对象(出栈), 借助`getFunction`(看作它的秘书吧)访问执行者名单, 帮自己选取该事项合适的执行者, 并调用该执行者执行任务(参考`undo`, `redo`函数体).

执行者名单背后是一个函数库一样的结构, 类似各个部门.

这样只需要无脑`undo()`就好, `manager`会根据本次的状态对象分配执行者处理.
`do`这个操作比较简单也没有多种情况, 就没必要分配执行者了...

---

## 3.执行者
执行者名单需要为一个对象, 这样`getFunction()`秘书才能够为`manager`选出合适的执行者, 执行者名单应为如下结构:

```javascript
// 执行者有擅长回撤(undo)和恢复(redo)的两种
{
  planA: planAFun (data, params) {
    // ...
  },
  planAUndo: planAUndoFun (data, params) {
    // ...
  },
  planB: planBFun () {
    // ...
  },
  planBUndo: planBUndoFun (data, params) {
    // ...
  }
  ...
}
```
也好, 那就直接把所有执行者抽离为一个类, 实例化该类后自然能形成这种数据结构:

```javascript
class Exec { // executor
  saveWorldRedo (data, params) {
    // ...
  }
  saveWorldUndo (data, params) {
    // ...
  }
  initialWorldUndo (data, params) {
    // ...
  }
}

export { Exec };
```

实例化后:

```javascript
{
  saveWorldRedo: function (data, params) {
    // ...
  },
  saveWorldUndo: function (data, params) {
    // ...
  },
  initialWorldUndo: function (data, params) {
    // ...
  }
}
```

正是需要的结构.
`getFunction`可以由解析状态对象进而决定枚举`executor`对象中的哪个执行者出来调用:

```javascript
const executor = getFunction (name) {
  return executors[name];
}
```

---

# 总结
好久没有写了, 这段时间遇到的一些零碎知识都扔github了.
啧, 还是再更起来吧)

我会很高兴, 如果这篇文章有帮到你.