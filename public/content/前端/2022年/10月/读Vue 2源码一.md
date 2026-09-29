
@[TOC](文章目录)

---

# 前言
Vue 2.6.13 源码分析 (一)

你需要有Vue 2.6.13的包.

```
https://github.com/vuejs/vue/releases/tag/v2.6.13
```

---


# 一、入口
## 1.index.js
`src/core/instance/index.js`

负责Vue配置对象的直接接收, 即
```javascript
new Vue({})
```
需要传入`options`配置对象:
也就是`el`, `data`之类的.
```javascript
import { initMixin } from './init'

function Vue (options) {
  /* if (process.env.NODE_ENV !== 'production' && !(this instanceof Vue)) {
    warn('Vue is a constructor and should be called with the `new` keyword')
  } */
  this._init(options) // 该处this指向Vue构造函数
  // _init确实定义于构造函数Vue上, 只不过并非现在而是在构造函数Vue带着参数传入initMixin之后
}

initMixin(Vue) // 构造函数Vue与initMinxin建立联系以将option传入initMixin
```

---

## 2.init.js
`src/core/instance/init.js`

 `initMixin()`所在文件, 先看`options`传值, `initMixin`接受构造函数Vue后将`_init`方法定义到Vue构造函数原型上, 并接受参数.
 
```javascript
export function initMixin (Vue: Class<Component>) {
  Vue.prototype._init = function (options?: Object) {
    // ...函数体
  }
}
```
将外层`initMixin`剥离:

```javascript
Vue.prototype._init = function (options?: Object) {
  const vm: Component = this // vm: Component为ts类型注释写法, 忽略看作const声明变量即可.
  // vm: ViewModel, vm = new Vue({??})
  // this指向Vue.prototype即本作用域对应函数
  vm._uid = uid++
  // 每个ViewModel都有一个自己的uid编号

  if (options && options._isComponent) {
    //如果options存在且存在于一个子组件中
    initInternalComponent(vm, options) // 支线
  } else {
    // 如果配置对象存在且存在于根组件中
    vm.$options = mergeOptions( // 支线
      resolveConstructorOptions(vm.constructor), // 支线
      options || {},
      vm
    )
  }
  // 以下放至后续篇
  initLifecycle(vm)
  initEvents(vm)
  initRender(vm)
  callHook(vm, 'beforeCreate')
  initInjections(vm) // resolve injections before data/props
  initState(vm)
  initProvide(vm) // resolve provide after data/props
  callHook(vm, 'created')
}
```
最后这几个函数的调用次序问题, 现在先记一下`initInjections`和`initState`以及`initProvide`:
provide注入的值作为data, props, computed等的入口, provide注入, inject负责接收, 而接受到的依赖(比如`axios`), 假设被`inject`接收到之后在`methods`里`axios.post(xxx)`, 这时候要是还没有`methods`这个东西就不好了, 所以`initState`必须在`initinject`之前进行, 而接收机制应该在发送之前就做好, 就像天然气建好管路后才能开闸.
我会在第三章说到这些.

---

### 1.2.1.`vm`与`options`
`this`(即vm):

![在这里插入图片描述](../../../../img/前端/2022年/10月/读Vue%202源码一/1.png)

options, 本处指传入`_init``的`options`:

![在这里插入图片描述](../../../../img/前端/2022年/10月/读Vue%202源码一/2.png)

`options`中有诸多属性, `new Vue()`传入的配置只是更改了其中一部分属性的值.

---

# 二、支线
##  2.1.initInternalComponent
一堆赋值操作

参数: 
vm: `Vue.prototype`
options: `_init()参数options`

完整函数:
```javascript
export function initInternalComponent (vm: Component, options: InternalComponentOptions) {
  const opts = vm.$options = Object.create(vm.constructor.options) // opts
  // 将以Vue构造函数对象作为原型生成的对象挂载到组件实例vm.$options的__proto__
  const parentVnode = options._parentVnode
  opts.parent = options.parent // 组件根实例挂载到组件实例
  opts._parentVnode = parentVnode

  const vnodeComponentOptions = parentVnode.componentOptions
  opts.propsData = vnodeComponentOptions.propsData
  opts._parentListeners = vnodeComponentOptions.listeners
  opts._renderChildren = vnodeComponentOptions.children
  opts._componentTag = vnodeComponentOptions.tag

  if (options.render) { // 如果有render, 把render相关挂载到$options
    opts.render = options.render
    opts.staticRenderFns = options.staticRenderFns
  }
}
```
指定组件`$options`原型, 把组件依赖于父组件的`props`、`listeners`挂载到`options`上，方便子组件调用.

---

## 2.resolveConstructorOptions
函数全貌, `Ctor`是`vm.constrator`即Vue构造函数.

```javascript
export function resolveConstructorOptions (Ctor: Class<Component>) {
  let options = Ctor.options // `vm.constructor = Vue.prototype.constructor = Vue`
  if (Ctor.super) { // 有super属性，说明Ctor是Vue.extend构建的子类, 进入递归
  // Vue.extend构建的子类为何会有super属性见下
    const superOptions = resolveConstructorOptions(Ctor.super) // sub
    const cachedSuperOptions = Ctor.superOptions
    if (superOptions !== cachedSuperOptions) {
      Ctor.superOptions = superOptions
      const modifiedOptions = resolveModifiedOptions(Ctor)
      if (modifiedOptions) {
        extend(Ctor.extendOptions, modifiedOptions)
      }
      options = Ctor.options = mergeOptions(superOptions, Ctor.extendOptions)
      if (options.name) {
        options.components[options.name] = Ctor
      }
    }
  }
  return options // 如果Ctor.super不存在就直接返回options, 比如new Vue()创建的情况
}
```

---

### 2.1.1.什么情况下会有super
可见当`Ctor.super`存在时才会进行`resolveConstructorOptions`的递归操作, 而使用`new extend()`创建组件的时候`vm.constructor`才会有`super`.
`new extend()`使用基础Vue构造器创建子类, 参数是一个组件配置对象.

`src/core/global-api/extend.js`

完整函数:

```javascript
Vue.extend = function (extendOptions: Object): Function {
  extendOptions = extendOptions || {}
  const Super = this
  const SuperId = Super.cid
  const cachedCtors = extendOptions._Ctor || (extendOptions._Ctor = {})
  if (cachedCtors[SuperId]) {
    return cachedCtors[SuperId]
  }

  const name = extendOptions.name || Super.options.name
  if (process.env.NODE_ENV !== 'production' && name) {
    validateComponentName(name)
  }

  const Sub = function VueComponent (options) {
    this._init(options)
  }
  Sub.prototype = Object.create(Super.prototype)
  Sub.prototype.constructor = Sub
  Sub.cid = cid++
  Sub.options = mergeOptions(
    Super.options,
    extendOptions
  )
  Sub['super'] = Super

  if (Sub.options.props) {
    initProps(Sub)
  }
  if (Sub.options.computed) {
    initComputed(Sub)
  }
    
  Sub.extend = Super.extend
  Sub.mixin = Super.mixin
  Sub.use = Super.use

  ASSET_TYPES.forEach(function (type) {
    Sub[type] = Super[type]
  })

  if (name) {
    Sub.options.components[name] = Sub
  }

  Sub.superOptions = Super.options
  Sub.extendOptions = extendOptions
  Sub.sealedOptions = extend({}, Sub.options)

  // cache constructor
  cachedCtors[SuperId] = Sub
  return Sub
}
```

```javascript
function initProps (Comp) {
  const props = Comp.options.props
  for (const key in props) {
    proxy(Comp.prototype, `_props`, key)
  }
}

function initComputed (Comp) {
  const computed = Comp.options.computed
  for (const key in computed) {
    defineComputed(Comp.prototype, key, computed[key])
  }
}
```

`Sub['super'] = Super`定义`super`属性, 而此时`this`指向Vue构造函数.

```javascript
Vue.extend = function (extendOptions: Object): Function {
  extendOptions = extendOptions || {}
  const Super = this
  console.log(this)
  console.log(Vue)
```
![在这里插入图片描述](../../../../img/前端/2022年/10月/读Vue%202源码一/3.png)

---

### 2.1.2.构造函数Sub
仍旧`src/core/global-api/extend.js`
简化版:
```javascript
Vue.extend = function (extendOptions: Object): Function {
  extendOptions = extendOptions || {} // vm.constructor
  const Super = this // 将Super指向构造函数Vue, 为后面建Sub子类准备资源
  
  const Sub = function VueComponent (options) { // 组件构造函数Sub
    this._init(options)
  }
  Sub.prototype = Object.create(Super.prototype)
  Sub.prototype.constructor = Sub
  Sub.options = mergeOptions( // 记住这个Sub.options
    Super.options,
    extendOptions
  )
  Sub['super'] = Super
  Sub.extend = Super.extend
  Sub.mixin = Super.mixin
  Sub.use = Super.use
  Sub.superOptions = Super.options
  Sub.extendOptions = extendOptions // 用作子类变化对照组
  Sub.sealedOptions = extend({}, Sub.options)
  return Sub
}
```
构造函数`Sub`我抽出来写了一下, `_init()`并不像`new Vue()`那样可以在`initMixin`里定义, 会报`undefined`, 而且这个`Sub`现在什么都没有就是个空函数一样的东西.
所以`Sub`构造函数定义之后的下一步立马就是把`Super`的原型, 也就是`Vue.prototype`拿过来当自己的`prototype`用, `Object.create()`基于Vue构造函数的原型创建一个对象, 作为组件构造函数Sub的原型, 这样Sub就是一个Vue构造函数复制品, 其内部也会拥有`_init()`方法可以进入`initMixin()`执行从而到达`Ctor.super`判定.
`Sub.prototype`刚赋值完和Vue构造函数一模一样, `constructor`要指向`Sub构造函数`才好, 所以接着把`Sub.prototype`指向`Sub`构造函数.
之后就是往`Sub`上挂载属性了.

---

### 2.1.3.super存在, resolveConstructorOptions如何执行
`Ctor.super`初始为构造函数Vue, 从最开始首次调用的父类构造函数Vue开始, 每轮递归都把父类最新的`options`赋值给`superOptions`.

演示: `Vue.extend()`情况下的输出, `new Vue()`情况下判定无法通过, 不会发生以下.
`Vue.extend()`的`vm.constructor`在开始`_init`之前已经在`extend.js`中处理过, 所以它的super属性会是自己的父类.

```javascript
let options = Ctor.options
console.log(Ctor.super)
if (Ctor.super) {
  const superOptions = resolveConstructorOptions(Ctor.super) // 调自己, 返回父类的options
  const cachedSuperOptions = Ctor.superOptions // 将extend时父类的options赋值给缓存
  console.log(superOptions)
  console.log(cachedSuperOptions)
```
![在这里插入图片描述](../../../../img/前端/2022年/10月/读Vue%202源码一/4.png)
这是一个父子类都没有变化的情况. 所以`superOptions`和`cachedSuperOptions`相同.

---

`Vue.extend()`使用Vue构造器创建一个子类, 这个子类有一大部分基于构造函数Vue这个父类.
这其中牵扯到一个比较, 先用`Ctor.super`拿到父构造函数传入`resolveConstructorOptions`拿到父类的`options`存下来, 然后再`Ctor.superOptions`直接将自己的`options`存下来, 然后父子`options比较`, 如果不同的话就是父类的`options`发生了改变, 由于`extend`里说`sub`的时候说到子类大部基于父类所以子类需要伴随父类的更新而做出更新.
子类直接被赋值更新, 完成之后使用`resolveModifiedOptions`检测子类是否发生变化.
```javascript
export function resolveConstructorOptions (Ctor: Class<Component>) {
  let options = Ctor.options
  if (Ctor.super) { // 继续递归的前提是有super, 没有就直接返回.
    const superOptions = resolveConstructorOptions(Ctor.super) // 传入Ctor.Super即父类构造函数拿到父options
    const cachedSuperOptions = Ctor.superOptions // 将自身的options存下
    if (superOptions !== cachedSuperOptions) { // 如果superOptions不等于最新的superOptions
      Ctor.superOptions = superOptions 
      // 那么更新子类, 更新完super必存在必定还要递归一次所以不用担心构造函数的问题

      const modifiedOptions = resolveModifiedOptions(Ctor) // 父子类变动校验

      if (modifiedOptions) { 
      // 如果resolveModifiedOptions返回正常值, 那么将子类对照与Ctor.extendOptions与存异项合并
        extend(Ctor.extendOptions, modifiedOptions)
      }
      options = Ctor.options = mergeOptions(superOptions, Ctor.extendOptions) // 新版子类与子类对照合并
      if (options.name) {
        options.components[options.name] = Ctor
      }
    }
  }
  return options
}
```

递归演示, 本处递归由`resolveConstructorOptions`在`src/sore/vdom/create-component`的调用完成, 执行Vue.extend()会对该文件内`createComponent`调用进而调用`resolveConstructorOptions`, 每次调用返回一个虚拟节点, 本处`v-for`生成3个子组件加一个父组件共执行4次`resolveConstructorOptions`, 每次返回两个不同的`Ctor.options`, 分别为父类构造函数Vue和自身:

```javascript
var todoItem = Vue.extend({
  template: `<li>{{ text }}</li>`,
  props: ['text']
})

// 构建一个父组件
var todo = Vue.extend({
  template: `
    <ul>
      <todo-item v-for="(item, index) in todoData" :keys="index" v-text="item.text"></todo-item>
    </ul>
  `,
  props: ['todoData'],
  // 局部注册子组件
  components: {
    todoItem: todoItem
  }
})

Vue.component('todo', todo)

new Vue({
  el: '#app',
  data: {
    todoList: [
      { id: 0, text: 'text1' },
      { id: 1, text: 'text2' },
      { id: 2, text: 'text3' }
    ]
  }
})
```
输出情况:

```javascript
export function resolveConstructorOptions(Ctor: Class<Component>) {
  let options = Ctor.options
  console.log(Ctor.options) // 101行
  if (Ctor.super) {
```

执行结果:
父组件:

![在这里插入图片描述](../../../../img/前端/2022年/10月/读Vue%202源码一/5.png)

子组件(输出3次每次相同):

![在这里插入图片描述](../../../../img/前端/2022年/10月/读Vue%202源码一/6.png)

---

## 2.2.resolveModifiedOptions
一个校验方法, 校验双方相同时则不执行`extend(Ctor.extendOptions, modifiedOptions)`
```javascript
function resolveModifiedOptions (Ctor: Class<Component>): ?Object {
  let modified
  const latest = Ctor.options // 自己, 或者说子类的options
  const sealed = Ctor.sealedOptions // Ctor.sealedOptions是执行extends.js时封的options, 用来对照子类自身变化
  for (const key in latest) {
    if (latest[key] !== sealed[key]) { 
      if (!modified) modified = {} // 他这个modifined在完全相同的时候是个`undefined`, 不同的时候会用对象形式列出第一个不同的项
      modified[key] = latest[key]
    }
  }
  return modified
}
```

测试demo:

```javascript
function resolveModifiedOptions() {
  let modified
  const latest = {
    a: 2,
    b: 3,
    c: 8
  } // 自己, 或者说子类的options
  const sealed = {
    a: 1,
    b: 4,
    c: 3
  } // 执行extends时封的options, 没有变化过, 专门用来对照子类自身变化
  for (const key in latest) {
    if (latest[key] !== sealed[key]) {
      if (!modified) {
        if (!modified) modified = {}
          modified[key] = latest[key]
       }
     }
   }
   console.log(modified)
   return modified
}
resolveModifiedOptions()
```
时刻同步父子类的变化, 以确保vm内的变动能够实时得到反馈.

---

## 2.3.mergeOptions
合并两选项, 出现相同配置项, 那么子类中的选项会覆盖父类中的选项.
子类最初直接源自Vue构造函数对象, 它需要尽可能发展自己的特色, 能用自己的就用自己的.

参数: 
`parent`: 父类构造函数对象
`child`: 子类构造函数对象
`vm`: (可选)组件实例

完整函数:
```javascript
export function mergeOptions (
  parent: Object,
  child: Object,
  vm?: Component
): Object {

  normalizeProps(child, vm) // 标准化props
  normalizeInject(child, vm) // 标准化inject
  normalizeDirectives(child) // 标准化directive

  if (!child._base) {
    if (child.extends) { //处理子类对象上的extends, 将继承而来的选项合并到parent
      parent = mergeOptions(parent, child.extends, vm)
    }
    if (child.mixins) { //处理子类对象上的mixins, 将继承而来的选项合并到parent
      for (let i = 0, l = child.mixins.length; i < l; i++) {
        parent = mergeOptions(parent, child.mixins[i], vm)
      }
    }
  }

  const options = {}
  let key
  for (key in parent) {
    mergeField(key)
  }
  for (key in child) {
    if (!hasOwn(parent, key)) {
      mergeField(key)
    }
  }
  function mergeField (key) {
    const strat = strats[key] || defaultStrat // strats受引入的合并策略集
    // strat函数, 履行特定合并合并策略的合并函数
    options[key] = strat(parent[key], child[key], vm, key)
  }
  return options
}
```

---

### 2.3.1.normalizeProps
规范化`props`准备`initState`.
```javascript
function normalizeProps (options: Object, vm: ?Component) { // options, vm
  const props = options.props
  if (!props) return // 如果没写props直接返回
  const res = {}
  let i, val, name
  if (Array.isArray(props)) { 
    i = props.length
    while (i--) {
    // 由末至首遍历props数组,val为当前被遍历的props属性名
      val = props[i]
      if (typeof val === 'string') {
        name = camelize(val) // 将驼峰命名化的props属性名赋值给name
        res[name] = { type: null } // 向res空对象内定义name属性并赋值
      } else if (process.env.NODE_ENV !== 'production') { // 若props属性名非字符串则警告
        warn('props must be strings when using array syntax.')
      }
    }
  } else if (isPlainObject(props)) { // 如果props是个对象
    for (const key in props) {
      val = props[key] // 正向遍历, val为当前props属性值
      name = camelize(key) // 同上, 驼峰, 赋值
      res[name] = isPlainObject(val)
        ? val
        : { type: val }
    }
  } else if (process.env.NODE_ENV !== 'production') { // 不是数组也不是对象还是生产模式就警告
    warn(
      `Invalid value for option "props": expected an Array or an Object, ` +
      `but got ${toRawType(props)}.`,
      vm
    )
  }
  options.props = res // 将定义了各个props属性及其值的键值对的res对象赋值给options.props
  /*
  res: {
    pro1: { type: null },
    pro2: { type: null },
    ...
  }
}
```

---

### 2.3.2.normalizeInject
初始化`inject`注入功能, 将`inject`中的数据解析为键值对的赋值给result, 正常情况下Vue支持数组, 对象和字符串形式的`inject`, 而`initInjections`仅能处理对象形式的`inject`并将其转为键值对形式, 所以这个函数执行之前还需要进行`normalizeInject`, 这是在`mergrOptions`中进行的:

```javascript
function normalizeInject (options: Object, vm: ?Component) {
  const inject = options.inject
  if (!inject) return // 如果没有inject就直接停下
  const normalized = options.inject = {}
  if (Array.isArray(inject)) { 
  /* 如果inject是数组形式, 那么把
  var Child = {
    依赖名: {
      ['依赖']
    }
  } 变为 
  var Child = {
    from: '依赖'
  }*/
    for (let i = 0; i < inject.length; i++) {
      normalized[inject[i]] = { from: inject[i] }
    }
  } else if (isPlainObject(inject)) { /* 如果inject是数组形式, 那么
  var Child = {
       依赖名: {'依赖'}
  } 变为 
  var Child = {
    inject: {
      from: '依赖'
    }
  }*/
    
    for (const key in inject) {
      const val = inject[key]
      normalized[key] = isPlainObject(val)
        ? extend({ from: key }, val)
        : { from: val }
    }
  } else if (process.env.NODE_ENV !== 'production') {
    warn(
      `Invalid value for option "inject": expected an Array or an Object, ` +
      `but got ${toRawType(inject)}.`,
      vm
    )
  }
}
```
可以看到里面是针对三种不同格式的`inject`给出了对应的处理方法, 最终均处理为对象形式.


# 总结
-
下一篇: [Vue 2.6.13 源码解析(二) initLifeCycle && initEvents](https://blog.csdn.net/qq_52697994/article/details/127474258)