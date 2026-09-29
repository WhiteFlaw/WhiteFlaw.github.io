---
title: 读Vue 2源码三
date: 2022-10-09
cover: /img/d1.webp
desc: 读Vue 2源码三
tags: [CSS, 前端]
sticky: false
---

@[TOC](文章目录)

---

# 前言
首篇提到`initProvide`和`initInjections`中间为何调用`initState`, 那么`initState`里做了什么?
这篇因为函数调用很多所以篇幅长, 但因为只是一个子模块, 所以函数的复杂性不及上篇.

思路的话, 这些函数的大部都是在处理数据格式问题, 核心基本就是最后的一两次调用.
比如`initData`和`initProps`的`observe`和`Observer`判断和处理数据格式问题, 响应式核心依靠`defineReactive()`(核心也是defineProperty), `initComputed`核心`defineProperty()`.

规范了一下结构, 第一篇感觉写的很乱, 这次采用了多级标题, `子标题函数`为`父标题函数`的内部调用.

不用自己写例子, Vue源码`example`目录下的页面基本能满足本章的输出测试需求, 记得修改引入的`vue.min.js`为`dist`下的`vue.js`, 打包完用`LiveServer`打开页面即可.

---

# 一、initState
初始化`Props`, `methods`, `data`, `computed`, `watch`
```javascript
export function initState (vm: Component) {
  vm._watchers = []
  const opts = vm.$options
  
  if (opts.props) initProps(vm, opts.props) 
  // 初始化props
  if (opts.methods) initMethods(vm, opts.methods)
  // 初始化methods
  if (opts.data) { 
  // 如果data存在, 那么初始化data
    initData(vm)
  } else { 
  // data不存在则返回defineReactive({})的返回值
    observe(vm._data = {}, true /* asRootData */)
  }
  if (opts.computed) initComputed(vm, opts.computed)
  // computed存在则初始化computed
  if (opts.watch && opts.watch !== nativeWatch) {
  // watch存在则初始化watch
    initWatch(vm, opts.watch)
  }
}
```

---

# 二、支线
## 2.1.initProps
```javascript
function initProps (vm: Component, propsOptions: Object) { // vm, vm.$options.props
  const propsData = vm.$options.propsData || {}
  /*
    propsData :[
      todoList: [
        0: {
          id: 0,
          text: '工作'
        },
        1: {
          id: 1,
          text: '早饭'
        }
      ]
    ]
  */
  const props = vm._props = {}
  
  const keys = vm.$options._propKeys = []
  const isRoot = !vm.$parent
  if (!isRoot) {
    toggleObserving(false)
  }
  for (const key in propsOptions) {
  /* 
    propsOptions: {
      color: { type: null },
      visible: { type: null }
    }
 */
    keys.push(key) // keys内为所有props参数名
    const value = validateProp(key, propsOptions, propsData, vm) // 所有遍历的props的新值
	/* value: [
	  0: {
	    id: 1,
	    text: 'Hello',
	  },
	  0: {
	    id: 2,
	    text: 'World',
	  }
	] */
    if (process.env.NODE_ENV !== 'production') {
      // 生产模式略
    } else {
    // 上面提到如果没有data就直接将data设为defineReactive({}), 现在有的话将每个值设置为响应式
      defineReactive(props, key, value)
    }
    if (!(key in vm)) { // 如果指定的属性在指定的对象或其原型链中, in运算符返回true
      proxy(vm, `_props`, key) // // 代理key到vm
    }
  }
  toggleObserving(true)
}
```

---

### 2.1.1.initProps---defineReactive

```javascript
/**
 * 在一个对象上定义响应式属性
 */
export function defineReactive (
  obj: Object,
  key: string, // 当前遍历的props属性名
  val: any, // 当前遍历的props值, 不一定最新
  customSetter?: ?Function,
  shallow?: boolean
) {
  const dep = new Dep() // 实例化Dep
  // Dep接收Observer的变化通知并向订阅它的Watcher分发变化通知
  const property = Object.getOwnPropertyDescriptor(obj, key)
  if (property && property.configurable === false) {
    return
  }

  // cater for pre-defined getter/setters
  const getter = property && property.get // getter setter这俩在很多时候是undefined, 也可以是undefined
  const setter = property && property.set
  if ((!getter || setter) && arguments.length === 2) {
    val = obj[key]
  }

  let childOb = !shallow && observe(val) // val每次是data中的一个属性值
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter () {
      const value = getter ? getter.call(obj) : val 
      // props情况和computed情况因为有更新值的需求所以有set和get方法, 由sharedPropertyDefinition所设, 参考2.1.2和2.4.1
      if (Dep.target) {
        dep.depend() // depend()加入依赖
        if (childOb) {
          childOb.dep.depend()
          if (Array.isArray(value)) {
            dependArray(value)
          }
        }
      }
      return value
    },
    set: function reactiveSetter (newVal) { // 现在不清楚怎么拿到的新值
      const value = getter ? getter.call(obj) : val
      /* eslint-disable no-self-compare */
      if (newVal === value || (newVal !== newVal && value !== value)) {
        return
      }
      /* eslint-enable no-self-compare */
      if (process.env.NODE_ENV !== 'production' && customSetter) {
        customSetter()
      }
      // #7981: for accessor properties without setter
      if (getter && !setter) return
      if (setter) {
        setter.call(obj, newVal) // 如果有setter就将当前newVal更新到当前key上
      } else { 
      // 没有setter那就不是props或者computed情况, data之类直接设置当前值为最新值
        val = newVal
      }
      childOb = !shallow && observe(newVal) // 见2.3.2.1
      dep.notify() // 见2.4.1.1
    }
  })
}
```

---

### 2.1.2.initProps---proxy 
将`props`属性名定义到`vm`上并且挨个对应他们自己的`set`和`get`, `sharedPropertyDefinition`全局数组. 
```javascript
const sharedPropertyDefinition = {
  enumerable: true,
  configurable: true,
  get: noop,
  set: noop
}
export function proxy (target: Object, sourceKey: string, key: string) { // vm, `_props`, 当前props名
  sharedPropertyDefinition.get = function proxyGetter () {
    return this[sourceKey][key] // sharedPropertyDefinition[_`props`][props名]
  }
  sharedPropertyDefinition.set = function proxySetter (val) {
    this[sourceKey][key] = val // sharedPropertyDefinition[_`props`][props名] = val
  }
  Object.defineProperty(target, key, sharedPropertyDefinition)
}
```
这种情况下`defineReactive`中的`property.get`和`set`就不是`undefined`了.

---

### 2.1.3.initProps---dependArray
特殊的 用于收集数组元素依赖的方法.
```javascript
/**
 * Collect dependencies on array elements when the array is touched, since
 * we cannot intercept array element access like property getters.
 */
function dependArray (value: Array<any>) {
  for (let e, i = 0, l = value.length; i < l; i++) {
    e = value[i]
    e && e.__ob__ && e.__ob__.dep.depend()
    if (Array.isArray(e)) { 
    // 如果还有数组就继续重来, 不是就到上一行三个值纳入依赖depend()结束
      dependArray(e)
    }
  }
}
```

---

## 2.2. initMethods
前面都在判重, 核心是最后的`bind()`.
```javascript
function initMethods (vm: Component, methods: Object) { // vm, vm.$options.methods
  const props = vm.$options.props
  /* props
  {
    color: {
      id: 1,
      text: 'Hello'
    },
    text: {
      id: 2,
      text: 'World'
    }
  },
  */
  for (const key in methods) {
    if (process.env.NODE_ENV !== 'production') {
      if (typeof methods[key] !== 'function') {
        warn(
          `Method "${key}" has type "${typeof methods[key]}" in the component definition. ` +
          `Did you reference the function correctly?`,
          vm
        )
      }
      if (props && hasOwn(props, key)) {
        warn(
          `Method "${key}" has already been defined as a prop.`,
          vm
        )
      }
      if ((key in vm) && isReserved(key)) {
        warn(
          `Method "${key}" conflicts with an existing Vue instance method. ` +
          `Avoid defining component methods that start with _ or $.`
        )
      }
    }
    vm[key] = typeof methods[key] !== 'function' ? noop : bind(methods[key], vm)
    // vm[key]即当前遍历的key对应的methods函数, 判定其是否为函数类型并判重
    // 重的话直接vm[key] = noop, 不重的话
  }
}
```

---

### 2.2.1.initMethods----bind
`src/core/observer/index.js`

```javascript
export const bind = Function.prototype.bind ? nativeBind : polyfillBind

function nativeBind (fn: Function, ctx: Object): Function { // methods函数, vm
  return fn.bind(ctx)
}

function polyfillBind (fn: Function, ctx: Object): Function {
  function boundFn (a) {
    const l = arguments.length
    return l
      ? l > 1
        ? fn.apply(ctx, arguments)
        : fn.call(ctx, a)
      : fn.call(ctx)
  }

  boundFn._length = fn.length
  return boundFn
}
```

---

## 2.3.initData
完整代码:

```javascript
function initData (vm: Component) { // vm
  let data = vm.$options.data // 函数mergedInstanceDataFn ()
  data = vm._data = typeof data === 'function'
    ? getData(data, vm)
    : data || {}
  /* data格式: {
	   options: [
		 { id: 0, name: 'color' },
		 { id: 1, name: 'color' }
	   ],
	   selected: 0
     }
  */
  if (!isPlainObject(data)) { // !true
    data = {}
    process.env.NODE_ENV !== 'production' && warn(
      'data functions should return an object:\n' +
      'https://vuejs.org/v2/guide/components.html#data-Must-Be-a-Function',
      vm
    )
  }

  const keys = Object.keys(data) // data中的属性名构成数组keys
  const props = vm.$options.props
  /* props
    {
      color: {
        id: 1,
        text: 'Hello'
      },
      text: {
        id: 2,
        text: 'World'
      }
    },
  */
  const methods = vm.$options.methods
  /* methods:
    {
  	  handleClick: function () {},
  	  handleBlur: function() {}
  	  ...
	}
  */
  let i = keys.length
  while (i--) { // 挨个检查data中的属性名有没有和props或者methods重名
    const key = keys[i]
    if (process.env.NODE_ENV !== 'production') {
      if (methods && hasOwn(methods, key)) {
        warn(
          `Method "${key}" has already been defined as a data property.`,
          vm
        )
      }
    }
    if (props && hasOwn(props, key)) {
      process.env.NODE_ENV !== 'production' && warn(
        `The data property "${key}" is already declared as a prop. ` +
        `Use prop default value instead.`,
        vm
      )
    } else if (!isReserved(key)) {
      proxy(vm, `_data`, key)
    }
  }
  // observe data
  observe(data, true /* asRootData */)
  /*
    data最终被传入new Obsever(value), 然后因为是一个对象走了else线this.walk(value),
    内部属性被循环defineReactive() 
  */
}
```

---

### 2.3.1.initData---observe
需要过一遍这里基本是因为格式可能不能直接处理, 需要判定.

```javascript
export function observe (value: any, asRootData: ?boolean): Observer | void {
/* value格式: 
  {
    options: [
	  { id: 0, name: 'color' },
	  { id: 1, name: 'color' }
	],
	selected: 0
  }
*/
// asRootData: true
  if (!isObject(value) || value instanceof VNode) { 
  // 这一句导致进到下面的只有对象数组
    return
  }
  let ob: Observer | void
  if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
    // 如果value上有__ob__说明该value已经进行过观察, 直接返回value.__ob__
    ob = value.__ob__
  } else if (
    shouldObserve &&
    !isServerRendering() &&
    (Array.isArray(value) || isPlainObject(value)) &&
    Object.isExtensible(value) &&
    !value._isVue
  ) {
    // 如果没被观察过, 那么创建观察者实例, 劫持监听所有属性并向Dep通知变化
    ob = new Observer(value)
  }
  if (asRootData && ob) {
    ob.vmCount++
  }
  return ob
}
```

---

### 2.3.2.1.initData---observe---Observer类
```javascript
export class Observer {
  value: any;
  dep: Dep;
  vmCount: number; // number of vms that have this object as root $data

  constructor (value: any) {
    this.value = value
    this.dep = new Dep() // 实例化一个Dep
    this.vmCount = 0
    def(value, '__ob__', this) // 为value defineProperty: __ob__
    /* value格式:
      {
        input: "Hello"
        __ob__: { 
          value: {
            input: "Hello",
            dep: Dep,
            vmCount: 1 
          }
        }
      }
    */
    if (Array.isArray(value)) { // 由上不是value
      if (hasProto) {
        protoAugment(value, arrayMethods)
      } else {
        copyAugment(value, arrayMethods, arrayKeys)
      }
      this.observeArray(value)
    } else {
      this.walk(value) 
      // 提取value全部键组成数组, 然后循环将每个值传入defineReactive(obj, keys[i])做响应式处理(见下walk)
    }
  }

  walk (obj: Object) {
    const keys = Object.keys(obj)
    for (let i = 0; i < keys.length; i++) {
      defineReactive(obj, keys[i])
    }
  }

  observeArray (items: Array<any>) { 
  /* 为数组的每一项new Observer()设置观察, 如果数组内部不是对象就继续到这再来一次, 看着像个递归, 这步只是不停的依靠循环不断深入提取数据, 最终目的还是达到walk()的执行条件去执行walk(), 只有walk()里面有defineReactive(). */
    for (let i = 0, l = items.length; i < l; i++) {
      observe(items[i])
    }
  }
}
```

---

## 2.4.initComputed
```javascript
const computedWatcherOptions = { lazy: true } // watcher类的options, 有lazy的话会懒执行

function initComputed (vm: Component, computed: Object) { // vm, vm.$options.computed

  const watchers = vm._computedWatchers = Object.create(null) // 创造一个没有原型的干净空对象

  const isSSR = isServerRendering() // 是否为后端渲染(SSR)决定computedWatcher的创建

  for (const key in computed) { // 遍历computed对象
  /* computed
    {
      clickPermission: function() {},
      submitPermission: function() {},
      ...
    } 
  */
    const userDef = computed[key] // clickPermission函数, 内部有get和set
    const getter = typeof userDef === 'function' ? userDef : userDef.get
    // 似乎是getter可以省略的原因? 如果写了get()就不是函数类型那么就将get()作为getter, 是函数类型就将整个函数作getter
    if (process.env.NODE_ENV !== 'production' && getter == null) {
      warn(
        `Getter is missing for computed property "${key}".`,
        vm
      )
    }

    if (!isSSR) { // 非后端渲染情况
      watchers[key] = new Watcher( // 空对象内创建与计算属性函数同名的key对应自己的watch实例
        vm,
        getter || noop,
        noop,
        computedWatcherOptions
      ) // 懒执行的watcher
    }

    if (!(key in vm)) { // 如果vm里有当前这个key
      defineComputed(vm, key, userDef)
      // 将这个计算属性的名字和函数定义到vm里, 最终依靠还是Object.defineProperty()
    } else if (process.env.NODE_ENV !== 'production') {
    // 非生产环境判重
      if (key in vm.$data) {
        warn(`The computed property "${key}" is already defined in data.`, vm)
      } else if (vm.$options.props && key in vm.$options.props) {
        warn(`The computed property "${key}" is already defined as a prop.`, vm)
      } else if (vm.$options.methods && key in vm.$options.methods) {
        warn(`The computed property "${key}" is already defined as a method.`, vm)
      }
    }
  }
}
```

---

### 2.4.1.initComputed---defineComputed
```javascript
export function defineComputed (
  target: any, // vm
  key: string, // 计算属性名
  userDef: Object | Function // 计算属性函数
) {
  const shouldCache = !isServerRendering() // SSR就赋值false
  if (typeof userDef === 'function') { // 如果是函数, 里面不分get()和set()
    sharedPropertyDefinition.get = shouldCache 
    // 如果该缓存就以createComputedGetter(计算属性名)的返回值作为sharedPropertyDefinition.get
      ? createComputedGetter(key)
      : createGetterInvoker(userDef)
    sharedPropertyDefinition.set = noop // 这个空函数, 防止undefined造成报错
  } else {
  // 如果不是个函数, 分为get()和set()两部分
    sharedPropertyDefinition.get = userDef.get
      ? shouldCache && userDef.cache !== false
        ? createComputedGetter(key)
        : createGetterInvoker(userDef.get)
      : noop
      // 如果userDef.get为true就判断shouldCache && userDef.cache !== false, 如果还为true就将createComputedGetter(key)返回值赋值到sharedPropertyDefinition.get
    sharedPropertyDefinition.set = userDef.set || noop //然后这时候因为有set就不能给set赋noop了, 将userDef的set()赋值到set
  }
  if (process.env.NODE_ENV !== 'production' &&
      sharedPropertyDefinition.set === noop) {
    sharedPropertyDefinition.set = function () {
      warn(
        `Computed property "${key}" was assigned to but it has no setter.`,
        this
      )
    }
  }
  Object.defineProperty(target, key, sharedPropertyDefinition)
  // Object.defineProperty(需定义或修改属性的对象, 需要定义或者修改的属性名, 含存取描述符和数据描述符的对象)
  // Object.defineProperty(vm, 计算属性名, { get: xxx, set: xxx })
}
```

---

#### 2.4.1.1.initComputed---defineComputed---createComputedGetter与缓存

```javascript
function createComputedGetter (key) { // 计算属性名
  return function computedGetter () { // return watcher.value
    const watcher = this._computedWatchers && this._computedWatchers[key]
    if (watcher) {
      if (watcher.dirty) { 
      /* 
        前面new Watcher()的时候传入的配置里有lazy, 那么options.lazy为true, options.dirty为lazy取反(见new Watcher), 为false 
      */
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

两个计算属性会输出两次, 每次处理一个计算属性:
计算属性名`compiledMarkdown`, `this._computedWatchers`:

![在这里插入图片描述](../../../../img/前端/2022年/10月/读Vue%202源码三/1.png)
`Dep`是根据`Observer`的通知来了解页面状况从而通知`Watcher`的, 观察到`Dep`内正好有个`notify`通知函数:
`src/core/observer/dep.js`
```javascript
notify () {
  // stabilize the subscriber list first
  const subs = this.subs.slice()
  if (process.env.NODE_ENV !== 'production' && !config.async) {
    // subs aren't sorted in scheduler if not running async
    // we need to sort them now to make sure they fire in correct
    // order
    subs.sort((a, b) => a.id - b.id)
  }
  for (let i = 0, l = subs.length; i < l; i++) {
    subs[i].update()
  }
}
```
另外看到`defineReactive()`内的`set()`最后也会调用这个进行通知.
看起来收到一次`Observer`的通知, 它会将所有订阅Dep的`Watcher`都调用一次`update()`, 那么去到`Watcher`的`update()`, `lazy`有判断, 应该可以看出一点`computed`缓存的原理, 主要是控制`get()`的执行, 只要`get()`不执行就不会获取新值, 栈也不会改变, 而只要`lazy`为`true`, `get()`就不会被执行, `update()`中两个调用`get()`的途径都受到`lazy`控制, `constructor`中的直接调用途径也受到`lazy`控制.
但是`lazy`其实只是规定需要懒更新, 以此来启动`dirty`的更新判定机制.

`Watcher`的`constructor`末有这一项:
```javascript
this.value = this.lazy ? undefined : this.get()
```
结合以下:
```javascript
/**
 * Subscriber interface.
 * Will be called when a dependency changes.
 */
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
  /**
   * Scheduler job interface.
   * Will be called by the scheduler.
   */
run () {
  if (this.active) {
    const value = this.get()
    if (
      value !== this.value ||
      // Deep watchers and watchers on Object/Arrays should fire even
      // when the value is the same, because the value may
      // have mutated.
      isObject(value) ||
      this.deep
    ) {
      // set new value
      const oldValue = this.value
      this.value = value
      if (this.user) {
        const info = `callback for watcher "${this.expression}"`
        invokeWithErrorHandling(this.cb, this.vm, [value, oldValue], this.vm, info)
      } else {
        this.cb.call(this.vm, value, oldValue)
      }
    }
  }
}
/**
 * Evaluate the value of the watcher.
 * This only gets called for lazy watchers.
*/
evaluate () {
// 每次成功更新完值将dirty设置为false, 产生了误导让我觉得是dirty在直接控制懒更新, 实际上是辅助
  this.value = this.get()
  this.dirty = false
}
```
`evaluate()`完`dirty`绝对为`false`, 然后`createComputedGetter`里调`evaluate()`之前判定了一下`watcher.dirty`, `dirty`是`true`才调`evaluate()`.
`watcher.lazy`只要在`new Watcher()`的时候规定了`true`就不会变`false`, 在`watcher.lazy`为`true`的情况下, `watcher.dirty`只有在`evaluate()`执行完, `update()`还没执行的时间段是`false`, 那么此处:
首次`evaluate()`一定会执行.
第二次及后续不好说, 如果每次之前执行了`update()`, 那么会执行, 否则判定为源状态未改变, 不执行.

那么update()什么时候执行, 现在不知道, 没看见有调过, 但是只要懒执行, 值的更新就必须过这里才能进行.

---

##  2.5.initWatch
```javascript
function initWatch (vm: Component, watch: Object) { // vm, vm.$options.watch
/* watch格式:
  {
    currentBranch: fetchData,
    currentBranch1: { user: true, handler: function(){} }
  }
*/
  for (const key in watch) {
    const handler = watch[key] // handler = fetchData
    if (Array.isArray(handler)) { 
    // 若当前handler为数组, 那么为数组内每一个handler函数创建watcher
      for (let i = 0; i < handler.length; i++) {
        createWatcher(vm, key, handler[i])
      }
    } else { // 如果不是数组, 直接对handler创建watcher
      createWatcher(vm, key, handler)
    }
  }
}
```

---

### 2.5.1.initWatch---createWatcher
为一个`watch`对象创建`watcher`.

```javascript
function createWatcher (
  vm: Component, // vm
  expOrFn: string | Function, // watch属性名
  handler: any, // watch对象
  options?: Object
) {
  if (isPlainObject(handler)) { // 第二种, 是对象的情况, 提出对象里的handler函数赋值给handler, 对象直接赋值给options
    options = handler
    handler = handler.handler
  }
  if (typeof handler === 'string') { // 第一种fetchData的情况, 说明方法定义在methods里, 此时initMethods已完成, 那么vm[handler]以获取该方法
    handler = vm[handler]
  }
  return vm.$watch(expOrFn, handler, options)
  //return vm.$watch(watch属性名, watch函数, watch对象)
}
```

---

#### 2.5.1.1.initWatch---createWatcher---$watch()
```javascript
Vue.prototype.$watch = function (
  expOrFn: string | Function, // watch属性名
  cb: any, // watch函数
  options?: Object // watch对象
): Function {
  const vm: Component = this
  if (isPlainObject(cb)) { 
  // 若cb为对象, 返回一个watcher
    return createWatcher(vm, expOrFn, cb, options)
  }
  options = options || {} // 没watch对象就给个空对象
  options.user = true // 如果watch是Fun不是Str的话, options里本来就有个user属性 
  const watcher = new Watcher(vm, expOrFn, cb, options)
  if (options.immediate) { // 如果watch的时候添加了immediate, 那么直接回调
    const info = `callback for immediate watcher "${watcher.expression}"`
    pushTarget() // 底层函数, 对一个数组型栈push()
    invokeWithErrorHandling(cb, vm, [watcher.value], vm, info) 
    /* 这个错误捕获函数捕获[watcher.value] ? cb.apply(vm, [watcher.value]) : handler.call(vm)中的错误报给handleError(), 它也可以捕获Promise操作中的错误 */
    popTarget() // 底层函数, 对一个数组型栈pop()
  }
  return function unwatchFn () { // 返回unwatchFn解除监听
    watcher.teardown()
  }
}
```

```javascript
teardown () {
  if (this.active) {
  // 从vm的watcher列表中清除自己
    if (!this.vm._isBeingDestroyed) {
    // 如果vm被销毁, 那么清除vm上的watcher
      remove(this.vm._watchers, this)
    }
    let i = this.deps.length
    while (i--) {
      this.deps[i].removeSub(this)
    }
    this.active = false
  }
}
```

---

# 总结
快吐了...这篇先到这吧.
这篇写到一半才想起来上面好像还调了`initLifeCycle()`, 第二篇只能等下周补上.
因为组织一整篇要的时间比较长, 放在工作日会有点难受, 所以每轮休息日更一下, 然后工作日用来完善...
上一篇: [Vue 2.6.13 源码解析(二) initLifeCycle && initEvents](https://blog.csdn.net/qq_52697994/article/details/127474258)
下一篇: [Vue 2.6.13 源码解析(四) Observer、Dep、Watcher与订阅](https://blog.csdn.net/qq_52697994/article/details/127336684)