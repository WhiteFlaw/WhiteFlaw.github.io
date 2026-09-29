@[TOC](文章目录)

---

# 前言
上次捋清了通知行为的执行, 但也引出一个问题, 何时需要通知, 何时需要更新.

所以从更早的地方向通知操作捋.

---


# 一、Object.defineProperty()
开始学习Vue时, 就已经听说过, Vue似乎通过通过`Object.defineProperty`为每一个属性设置具备自动反馈机制的读写方法来精确感应属性的变动.


Object.defineProperty -MDN: [Object.defineProperty -MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty)

经过这个方法处理的属性会在受读取时调用`get()`, 受写入时调用`set()`并可取到写入值.
基于这个特性为每个数据执行`Object.defineProperty`并添加写入反馈机制及时通知所有该数据的依赖(该数据的依赖指的是该数据的使用者)做出更新.
做这种响应式处理, 以使该数据成为响应式数据.

---

# 二、观察者Observer
数据经过响应式处理之后会在受写入时执行`set()`, 如果在`set()`时顺带做出可以被观察监听的行为, 就可以将自己的变化告知外界.
外界也需要一个观察者, 实时监控这种反馈并发起操作.
因为数组类型不具备`set`, 所以针对数组和对象两种类型会在此处被交付不同的方法处理, 但是除了数组使用一种特殊方法来发起写入反馈, 他者的最终目的依然是为每个属性执行响应式处理.

这一步还为每个数据创建一个依赖对象`Dep`,(这里的依赖依旧指依赖该数据者)像一个功能不全的用户数据库, 依赖该数据者将被存储于该依赖对象的subs数组, 并且Dep内提供了系列方法, 只要调用就可以完成对依赖的增删改.

```javascript
export class Observer {
  value: any;
  dep: Dep;
  vmCount: number; // number of vms that have this object as root $data

  constructor (value: any) {
    this.value = value
    this.dep = new Dep()
    this.vmCount = 0
    def(value, '__ob__', this)
    if (Array.isArray(value)) {
      if (hasProto) { // 判定浏览器是否支持proto
        protoAugment(value, arrayMethods)
      } else {
        copyAugment(value, arrayMethods, arrayKeys)
      }
      this.observeArray(value)
    } else {
      this.walk(value)
    }
  }

  walk (obj: Object) {
    const keys = Object.keys(obj)
    for (let i = 0; i < keys.length; i++) {
      defineReactive(obj, keys[i])
    }
  }

  observeArray (items: Array<any>) {
    for (let i = 0, l = items.length; i < l; i++) {
      observe(items[i])
    }
  }
}
```

---

# 三、对象类型的响应式处理
## 1.收集依赖
收集所有对该数据依赖有依赖者, 纳入该数据的Dep进行管理, 在依赖者和被依赖者间建立联系.
依赖者一旦访问其依赖的数据必然会触发该数据的`get()`, 那么在数据的`get()`里理所当然也可以获取到依赖者, 此时将该依赖者纳入`Dep`管制比较合适:
`src/core/observer/index.js>defineReactive`

访问者并不会被直接加入依赖, 而是将访问者的Watcher加入依赖:

```javascript
notify () {
  const subs = this.subs.slice()
  if (process.env.NODE_ENV !== 'production' && !config.async) {
    subs.sort((a, b) => a.id - b.id)
  }
  for (let i = 0, l = subs.length; i < l; i++) {
    subs[i].update() // 调的是Watcher方法, 所以subs[i]应当为一个Watcher
  }
}
```

通知的时候通知Dep的所有依赖即所有订阅Dep的所有Watcher, Watcher能接收通知并做出更新.
```javascript
get: function reactiveGetter () {
  const value = getter ? getter.call(obj) : val
  if (Dep.target) { // Watcher执行时会执行get(), 此时调用pushTarget将Dep.target设为该Watcher
  // 以前这步是用window.target完成
  // 将访问者加入依赖
    dep.depend()
  }
  return value
}
```

```javascript
depend () {
  if (Dep.target) {
    Dep.target.addDep(this)
  }
}
```

---

## 2.通知依赖
发生变化后`set`触发, 调用

```javascript
dep.notify()
```
向dep中的所有`Watcher`发起更新通知.

---

# 四、数组类型的响应式处理
## 1.依赖收集
走`observerArray`线:
对每个元素执行`observe`
`src/core/observer/index.js/>Observer`
```javascript
observeArray (items: Array<any>) {
  for (let i = 0, l = items.length; i < l; i++) {
    observe(items[i])
  }
}
```
为数组元素设立观察者Observer并返回Observer实例
```javascript
export function observe (value: any, asRootData: ?boolean): Observer | void {
  let ob: Observer | void
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
  return ob
}
```
如果子元素不再是数组, 就走`defineReactive`, 然后就到了`defineProperty`, 收集依赖依然需要在`get()`时候.
`defineReactive`中尝试创建`childOb`, 如果`defineReactive`传入了数组, 此时通过为数组执行`observe`拿到该数组的观察者对象, 之后数组观察者对象中的`dep`调用`depend`收集该数组的依赖.

---

## 2.通知依赖
需要解决数组类型不能`set`不能感应写入的问题.
为此在数组原型上的方法的基础上进行了改动, 为所有能对原数组产生影响的方法增加通知机制.

```javascript
if (Array.isArray(value)) {
  if (hasProto) { // 判定浏览器是否支持proto
    protoAugment(value, arrayMethods)
  } else {
    copyAugment(value, arrayMethods, arrayKeys)
  }
  this.observeArray(value)
} else {
  this.walk(value)
}
```

改变这个数组类型数据在数组原型上的原生数组方法, 对该数组执行的数组方法实际上都是在给`mutator`传`method`参数, 但是不论传什么, 最后都会发起通知:

```javascript
const ob = this.__ob__ // __ob__即该数据的Observer对象
ob.dep.notify() // 发起通知
```

数组原型上的方法更改:
`src/core/observer/array.js`

```javascript
const arrayProto = Array.prototype
export const arrayMethods = Object.create(arrayProto)

const methodsToPatch = [ // 当前能对原数组造成影响的所有数组方法
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse'
]

/**
 * Intercept mutating methods and emit events
 */
methodsToPatch.forEach(function (method) {
  // cache original method
  const original = arrayProto[method]
  def(arrayMethods, method, function mutator (...args) {
    const result = original.apply(this, args)
    const ob = this.__ob__ // 此即数组的观察者对象
    let inserted
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args
        break
      case 'splice':
        inserted = args.slice(2)
        break
    }
    if (inserted) ob.observeArray(inserted)
    // notify change
    ob.dep.notify() // 数组观察者对象的dep调用notify发起通知.
    return result
  })
})
```


# 总结
-
上一篇: [Vue 2.6.13 源码解析(四) Observer、Dep、Watcher与订阅](https://blog.csdn.net/qq_52697994/article/details/127336684)