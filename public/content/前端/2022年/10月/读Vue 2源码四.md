---
title: 读Vue 2源码四
date: 2022-10-16
cover: /img/d8.webp
desc: 读Vue 2源码四
tags: [Vue, 前端]
sticky: false
---

@[TOC](文章目录)

---

# 前言
我还是感觉看了个寂寞, 一直分析代码执行, 但是忽略了比较宏观的一些事, 比如`Dep`如何将变化通知到`Watcher`, `Watcher`是怎么订阅`Dep`的, 缺乏这种意识.

---


# 一、由initData整理思路
## 1.1 initData()到observe()
从`vm`提取`data`数据对象, 传给`observe`
```javascript
function initData (vm: Component) {
  let data = vm.$options.data
  data = vm._data = typeof data === 'function'
  ? getData(data, vm)
  : data || {}
  
  observe(data, true)
}
```

---

## 1.2 observe()
检查该`data`数据对象是否已受观察, 即检查该数据对象内是否具备`__ob__`属性, 若有则说明已受观察不做处理, 若无则设置观察者`new Observer(value)`.
可能因为是初始化, 所以只对没有被观察的设置观察.
```javascript
export function observe (value: any, asRootData: ?boolean): Observer | void {
  if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
    ob = value.__ob__
  } else if (
    shouldObserve &&
    !isServerRendering() &&
    (Array.isArray(value) || isPlainObject(value)) &&
    Object.isExtensible(value) &&
    !value._isVue
  ) {
    ob = new Observer(value)
  }
  if (asRootData && ob) {
    ob.vmCount++
  }
  return ob
}
```

---

## 1.3 new Observer()
将`Dep`, 数据对象, `vmConunt`传入`def()`
```javascript
export class Observer {
  value: any;
  dep: Dep;
  vmCount: number;

  constructor (value: any) {
    this.value = value
    this.dep = new Dep()
    this.vmCount = 0
    def(value, '__ob__', this) // 数据对象, Dep, vmCount

    this.walk(value)

    walk (obj: Object) {
      const keys = Object.keys(obj)
      for (let i = 0; i < keys.length; i++) {
        defineReactive(obj, keys[i])
      }
    }

  }
}
```

---

## 1.4 def()
核心`defineProperty()`为数据对象`value`设置`__ob__`属性, 至此该对象被Dep劫持
`Object.defineProperty(value, '__ob__', { Dep, 数据对象, vmCount })`
```javascript
export function def (obj: Object, key: string, val: any, enumerable?: boolean) {
  Object.defineProperty(obj, key, {
    value: val,
    enumerable: !!enumerable,
    writable: true,
    configurable: true
  })
}
```
完成后`value`上具备`__ob__`属性.

```javascript
// value
{
  xxx: 'xxx',
  x: 'xxx',
  __ob__: {
    dep: {
      ...
      subs: [
        订阅者0,
        订阅者1,
        ...
      ]
    }
  }
}
```

此时`Observer`又调用了`walk(value)`

---

##  1.5 walk()
`def`完成后`value`会带着`Dep`来执行`walk()`
提取数据对象的key构成数组, 遍历数组对其内部元素`defineReactive(数据对象, 属性名)`将数据对象中每个属性都执行`defineReactive()`.
```javascript
walk (obj: Object) {
  const keys = Object.keys(obj)
  for (let i = 0; i < keys.length; i++) {
    defineReactive(obj, keys[i])
  }
}
```

---

## 1.6 defineReactive()
`defineReactive(数据对象, 属性名)`, 内部`Object.property(数据对象, 属性名, {..., get, set})`为数据对象设置`get`和`set`方法, 在初始化的时候会触发`get`, 后期更新数据会触发`set`.

`get`即初始化时检查`Dep.target`, 这个变量就是订阅该`Dep`的`一个Watcher`, `new Watcher()`时会触发`Watcher`类的`get()`执行`dep`的`pushTarget(this)`, 这个`this`指向一个`Watcher`, 随后`pushTarget()`内`Dep.target = 这个Watcher`, 从而检索成功放行.

放行后执行`dep.depend()`调用该`dep`的`depend()`方法进而将这个`dep`加入到Dep.Target对应的`Watcher`的`newDeps`数组内, 表示这是该`Watcher`订阅的`Dep`, 同时`Dep`也会调用`addSub()`将这个`Watcher`加入自己的`Subs`数组表示这是自己的订阅者.
每个属性对应一个负责劫持的`Observer`, 每个`Observer`通知一个`Dep`, 一个`Dep`可以由多个`Watcher`订阅, `Dep`也通知变化到多个`Watcher`.

数据更新时会触发`set`进而调用`Dep`的`notify()`通知函数, 通知订阅该`Dep`的所有`Watcher`执行`update()`, 下面会说到.
```javascript
export function defineReactive (
  obj: Object,
  key: string,
  val: any,
  customSetter?: ?Function,
  shallow?: boolean
) {
  const dep = new Dep()

  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter () {
      const value = getter ? getter.call(obj) : val
      if (Dep.target) {
        dep.depend()
      }
      return value
    },
    
    set: function reactiveSetter (newVal) {
      const value = getter ? getter.call(obj) : val
      if (setter) {
        setter.call(obj, newVal)
      } else {
        val = newVal
      }
      dep.notify()
    }
  })
  
}
```

## 1.7 new Dep() && depend()
`defineReactive()`中`defineProperty()`定义的`get()`内部由`Observer`实例调用`Dep`的`depend()`, 在`depend()`会调用`Watcher`类的`addDep()`方法, `Watcher`借此拿到`Dep`.
`addDep`还调用`Dep`的`addSub()`, `Dep`借此拿到`Watcher`, 此时双方订阅与被订阅关系构成.
`Dep`的`Subs`数组用来存放所有订阅者`Watcher`.
```javascript
export default class Dep {
  static target: ?Watcher;
  id: number;
  subs: Array<Watcher>;

  constructor () {
    this.id = uid++
    this.subs = []
  }

  addSub (sub: Watcher) {
    this.subs.push(sub)
  }

  depend () {
    if (Dep.target) {
      Dep.target.addDep(this)
    }
  }

  notify () {
    const subs = this.subs.slice()
    for (let i = 0, l = subs.length; i < l; i++) {
      subs[i].update()
    }
  }
  
}
```
### 1.7.1 pushTarget()
```javascript
Dep.target = null // 全局
const targetStack = [] // 全局

export function pushTarget (target: ?Watcher) {
  targetStack.push(target)
  Dep.target = target
}
```

---

## 1.8 Watcher
`Watcher`实例化先调用`get()`里的`pushTarget()`(这个函数也在dep.js中但不属于Dep中)传自己过去, 然后`pushTarget`将`Watcher`赋值给`Dep.target`, 此时`defineReactive()`里的`dep.depend()`能够执行.
直到`newDep()`发生, `Dep`的`depend(this)`执行`Dep.target.addDep()`(`addDep()`是`Watcher`的方法, 两者借此建立联系), 双方各自把对方加进自己的数组`newDep`和`Sub`, 订阅算是完成.
```javascript
export default class Watcher {
  get () {
    pushTarget(this) // dep里的pushTarget
  }

  addDep (dep: Dep) {
    const id = dep.id
    if (!this.newDepIds.has(id)) {
      this.newDepIds.add(id)
      this.newDeps.push(dep) // Watcher拿到Dep
      if (!this.depIds.has(id)) {
        dep.addSub(this) // Dep拿到Watcher
      }
    }
  }
  
  update () {
    /* istanbul ignore else */
    if (this.lazy) {
      this.dirty = true
    } else if (this.sync) {
      this.run()
    } else {
      queueWatcher(this)
    }
  }
  
  run () {
    if (this.active) {
      const value = this.get()
    }
  }
  
}
```

---

## 1.9 initData图示
![在这里插入图片描述](../../../../img/前端/2022年/10月/读Vue%202源码四/1.png)

---

# 二、由initComputed整理思路
## 2.1 由initComputed()到defineComputed()
整个主体在一个loop完成, 为每个计算属性实例化`Watcher`, `vm._watchers.push(this)`将该Watcher存入vm的诸多`Watcher`中.
然后对每个计算属性执行`defineComputed(vm, 计算属性名, 计算属性值)`
```javascript
const sharedPropertyDefinition = { // 全局
  enumerable: true,
  configurable: true,
  get: noop,
  set: noop
}

function initComputed (vm: Component, computed: Object) {
  const watchers = vm._computedWatchers = Object.create(null)
  const isSSR = isServerRendering()

  for (const key in computed) {
    const userDef = computed[key]
    const getter = typeof userDef === 'function' ? userDef : userDef.get

    if (!isSSR) {
      watchers[key] = new Watcher(
        vm,
        getter || noop,
        noop,
        computedWatcherOptions
      )
    }

    if (!(key in vm)) {
      defineComputed(vm, key, userDef)
    }
  }
}
```

---


## 2.2 defineComputed()
针对`computed`属性值的不同书写方式组成`sharedPropertyDefinition`作为该计算属性的描述符参数.
```javascript
export function defineComputed (
  target: any,
  key: string,
  userDef: Object | Function
) {
  const shouldCache = !isServerRendering()
  
  if (typeof userDef === 'function') {
  
    sharedPropertyDefinition.get = shouldCache
      ? createComputedGetter(key)
      : createGetterInvoker(userDef)
    sharedPropertyDefinition.set = noop
    
  } else {
  
    sharedPropertyDefinition.get = userDef.get
      ? shouldCache && userDef.cache !== false
        ? createComputedGetter(key)
        : createGetterInvoker(userDef.get)
      : noop
    sharedPropertyDefinition.set = userDef.set || noop
    
  }
  Object.defineProperty(target, key, sharedPropertyDefinition)
}
```

---

## 2.3 createComputedGetter()
在上一步为每个计算属性实例化了`Watcher`, 拿到当前计算属性的`Watcher`, 执行`Watcher`的`evaluate()`调用`Watcher`的`get()`和Dep的`pushTarget`, 导致`Dep.target = 当前Watcher`
`Dep.target`存在后由`Watcher`调用Dep的`depend()`, 然后就回到1.8的`addDep()`订阅了.
```javascript
function createComputedGetter (key) {
  return function computedGetter () {
    const watcher = this._computedWatchers && this._computedWatchers[key]
    if (watcher) {
      if (watcher.dirty) {
        watcher.evaluate()
      }
      if (Dep.target) {
        watcher.depend()
      }
      return watcher.value
    }
  }
}
```

---

## 2.4 initComputed图示
![在这里插入图片描述](../../../../img/前端/2022年/10月/读Vue%202源码四/2.png)

---

# 总结
每次到`addDep()`, 也就是每次`Watcher`调用`Dep`的`depend()`, 都会进行双向数据收集, Watcher和Dep互相同步数据, Dep的数据更新后通知订阅自己的每个Watcher调用`notify()`进而调用`update()`更新数据, `computed计算属性在接受`defineProperty()`之后会拥有`set()`和`get()`方法, 更新调`set()`之后`Dep`通知.

上一篇: [Vue 2.6.13 源码解析(三) 初始化](https://blog.csdn.net/qq_52697994/article/details/127169469)
下一篇: [Vue 2.6.13 源码解析(五) 感知变化以发起通知](https://blog.csdn.net/qq_52697994/article/details/127695534)