
@[TOC](文章目录)

---

# 前言
补充第一章提到的部分, 

---


# 一、initLifeCycle
`src/core/instance/lifecycle.js`

```javascript
export function initLifecycle (vm: Component) {
  const options = vm.$options

  // locate first non-abstract parent
  let parent = options.parent
  if (parent && !options.abstract) { // 抽象组件如keep-alive, transition特点为不渲染, 这类组件的实现是一个对象, 并且具备abstract属性, 为true时表明这是抽象组件
    while (parent.$options.abstract && parent.$parent) { // 如果父实例不是存在于非渲染组件中的抽象示例, 并且父实例仍有父级
      parent = parent.$parent // 那么parent等于当前组件的最终父级
    }
    parent.$children.push(vm) // 向最终父级的$children内加入当前组件的vm
  }

  vm.$parent = parent
  vm.$root = parent ? parent.$root : vm
  // 如果本组件的最终父级parent存在, 那么本组件根元素就为最终父级组件,如果没有最终父级, 即本组件无父级或直接父级为抽象组件, 那么以自己作为根元素
 //自上到下将根实例的$root属性依次传递给每一个子实例
  vm.$children = []
  vm.$refs = {}

  vm._watcher = null
  vm._inactive = null
  vm._directInactive = false
  vm._isMounted = false
  vm._isDestroyed = false
  vm._isBeingDestroyed = false
}
```


# 二、listeners
`initEvent`负责处理`listeners`, `listeners`的生成:

## 2.1 processAttrs
`src/compiler/parser/index.js`
`processAttrs`方法提取解析标签上的属性:
```javascript
export const onRE = /^@|^v-on:/
export const dirRE = /^v-|^@|^:/

function processAttrs (el) {
  const list = el.attrsList //
  let i, l, name, value, modifiers
  for (i = 0, l = list.length; i < l; i++) {
    name = rawName = list[i].name
    value = list[i].value
    if (dirRE.test(name)) { 
    // 如果list[i].name是指令, 先通过parseModifiers解析出属性修饰符
      modifiers = parseModifiers(name.replace(dirRE, ''))
      if (modifiers) {
        name = name.replace(modifierRE, '')
      }
      if (onRE.test(name)) { 
      // 如果这个属性是v-on事件指令则处理name得到事件名传入addHandler
        name = name.replace(onRE, '')
        addHandler(el, name, value, modifiers, false, warn, list[i], isDynamic)
      }
    }
  }
}
```

## 2.2 addHandler

```javascript
export function addHandler (el,name,value,modifiers) {
  modifiers = modifiers || emptyObject

  // check capture modifier 判断是否有capture修饰符
  if (modifiers.capture) {
    delete modifiers.capture
    name = '!' + name // 给事件名前加'!'用以标记capture修饰符
  }
  // 判断是否有once修饰符
  if (modifiers.once) {
    delete modifiers.once
    name = '~' + name // 给事件名前加'~'用以标记once修饰符
  }
  // 判断是否有passive修饰符
  if (modifiers.passive) {
    delete modifiers.passive
    name = '&' + name // 给事件名前加'&'用以标记passive修饰符
  }

  let events
  if (modifiers.native) {
  // 若当前事件为浏览器原生事件
    delete modifiers.native
    events = el.nativeEvents || (el.nativeEvents = {})
  } else {
  // 若为自定义事件
    events = el.events || (el.events = {})
  }

  const newHandler = rangeSetItem({ value: value.trim(), dynamic }, range)
  if (modifiers !== emptyObject) {
    newHandler.modifiers = modifiers
  }
/* 
  function rangeSetItem ( item, range ) {
    if (range) {
      if (range.start != null) {
        item.start = range.start
      }
      if (range.end != null) {
        item.end = range.end
      }
    }
    return item
  }
*/
  const handlers = events[name] 
    // name是事件名, 以自定义事件为例, 从el.events中依据name事件名选出当前事件的所有回调函数, 若回调函数复数个就为数组
  if (Array.isArray(handlers)) {
  // 若handlers存在且为数组
    important ? handlers.unshift(newHandler) : handlers.push(newHandler)
  } else if (handlers) {
  // 若handlers存在但不为数组
    events[name] = important ? [newHandler, handlers] : [handlers, newHandler]
  } else {
  // handlers不存在
    events[name] = newHandler
  }

  el.plain = false
}
```

## 2.3 genData
现在el.events上有事件和它们的回调函数, 根据事件类型传入`genHandlers`加工成字符串.
```javascript
export function genData (el state) {
  let data = '{'
  // event handlers
  if (el.events) { // genHandlers第二个参数isNative分别传布尔值, 浏览器自带事件传true
    data += `${genHandlers(el.events, false)},`
  }
  if (el.nativeEvents) { // 
    data += `${genHandlers(el.nativeEvents, true)},`
  }
  return data
}
```

## 2.4 genHandlers
返一个字符串, 比如浏览器原生事件解析出的格式为`nativeOn + _d + 事件名 + 回调函数, []`.
```javascript
export function genHandlers (
  events: ASTElementHandlers,
  isNative: boolean
): string {
  const prefix = isNative ? 'nativeOn:' : 'on:'
  let staticHandlers = ``
  let dynamicHandlers = ``
  for (const name in events) {
    const handlerCode = genHandler(events[name])
    if (events[name] && events[name].dynamic) {
      dynamicHandlers += `${name},${handlerCode},`
    } else {
      staticHandlers += `"${name}":${handlerCode},`
    }
  }
  staticHandlers = `{${staticHandlers.slice(0, -1)}}`
  if (dynamicHandlers) {
    return prefix + `_d(${staticHandlers},[${dynamicHandlers.slice(0, -1)}])`
  } else {
    return prefix + staticHandlers
  }
}
```
返回值外部再由`genData`的对象容纳.
`genData`的返回值被用于创建虚拟组件节点, 组件挂载通过`createComponent`生成虚拟组件节点， 即createComponent的data参数.
由上推知data数据格式：

```javascript
{
  on/nativeOn:{
    '事件名': 回调函数
  }
}
```

---

## 2.5 createComponent

```javascript
export function createComponent (
  Ctor: Class<Component> | Function | Object | void,
  data: ?VNodeData,
  context: Component,
  children: ?Array<VNode>,
  tag?: string
): VNode | Array<VNode> | void {
  const listeners = data.on // 非浏览器原生事件交付initEvents处理, 在子组件实例化时处理

  data.on = data.nativeOn // 浏览器原生事件在本处处理, 在父组件实例化时处理

  // return a placeholder vnode
  const name = Ctor.options.name || tag
  const vnode = new VNode( // 生成虚拟组件节点
    `vue-component-${Ctor.cid}${name ? `-${name}` : ''}`,
    data, undefined, undefined, undefined, context,
    { Ctor, propsData, listeners, tag, children },
    asyncFactory
  )

  return vnode
}
```

---

# 三、initEvents
`src/core/instance/events.js`
`vm._events`不在此过程中处理, 这里仅仅是准备收集.
listeners
```javascript
export function initEvents (vm: Component) {
  vm._events = Object.create(null)
  // 创建一个原型为null的空对象, vm._events用于存放事件, 此处仅指当前组件的父组件绑定在当前组件上的事件, 即.
  // 即<son @close="xxx" @show="xxx">, 此时会有close和show在_events内
  vm._hasHookEvent = false 
  // 父组件是否通过@hook把钩子函数绑定在当前组件上, 即以@hook:钩子函数名="函数"的形式
  // init parent attached events
  const listeners = vm.$options._parentListeners 
  // 将父组件在本组件上注册的事件赋值给listeners
  if (listeners) {
    // 若父组件在当前子组件上绑定了事件, 那么执行updateComponentsListeners
    updateComponentListeners(vm, listeners)
  }
}
```

---

## 3.1 updateComponentListeners
只是负责调用`updateListeners`, target维持对vm的引用, 不用太关心这个.
```javascript
export function updateComponentListeners (
  vm: Component,
  listeners: Object,
  oldListeners: ?Object
) {
  // 保留对vm实例的引用, 保证在执行updateListeners时依旧可以访问到vm(remove和add需要访问vm)
  // oldListeners: 绑定在当前组件上的旧事件对象
  // listeners: 绑定于当前组件上的事件对象
  // 这里只是把add 和 remove传过去, 并没有调用, updateListeners内部使用其进行事件的注册和销毁
  updateListeners(listeners, oldListeners || {}, add, remove, createOnceHandler, vm)
}
```

### 3.1.1 add

```javascript
function add (event, fn) {
  target.$on(event, fn)
}
```

```javascript
Vue.prototype.$on = function (event: string | Array<string>, fn: Function): Component {
  // 若events为数组, 那么进入递归(如果里面还有子数组再进), 把每个事件单独选取出来传入$on, 如此循环直到不满足条件进入else
  const vm: Component = this
  if (Array.isArray(event)) {
    for (let i = 0, l = event.length; i < l; i++) {
      vm.$on(event[i], fn)
    }
  } else { // 将一个事件和它的回调方法加到_events对象中, 事件名对应方法
    (vm._events[event] || (vm._events[event] = [])).push(fn)
    // optimize hook:event cost by using a boolean flag marked at registration
    // instead of a hash lookup
    if (hookRE.test(event)) {
      vm._hasHookEvent = true
      // _hasHookEvent表示父组件有没有直接绑定钩子函数在当前组件上(即@hook:created="hookFormParent"式)
    }
  }
  return vm
}
```
### 3.1.2 remove

```javascript
function remove (event, fn) {
  target.$off(event, fn)
}
```

```javascript
Vue.prototype.$off = function (event?: string | Array<string>, fn?: Function): Component {
  const vm: Component = this
  // array of events
  if (Array.isArray(event)) { // 如果事件名为数组形式, 那么递归直到拿到具体的事件名进来销毁
    for (let i = 0, l = event.length; i < l; i++) {
      vm.$off(event[i], fn)
    }
    return vm
  }
  // specific event
  const cbs = vm._events[event] // 拿到该事件名对应的所有回调函数
  let cb
  let i = cbs.length
  while (i--) {
    cb = cbs[i]
    // updateListeners调用时, fn是oldOn[name]即该事件名曾经对应的事件函数, 如果当前事件名对应的所有回调函数cbs内有oldOn[name]即cb === fn, 就从当前vm._events[event]中去除这个回调函数.
    if (cb === fn || cb.fn === fn) {
      cbs.splice(i, 1)
      break
    }
  }
  return vm
}
```

---

## 3.2 updateListeners
事件回调函数更新卸载增加.
```javascript
export function updateListeners (
  on: Object, // listeners
  oldOn: Object, // oldListeners
  add: Function,
  remove: Function,
  createOnceHandler: Function,
  vm: Component
) {
  // 如果listeners对象中存在某个key（即事件名）而oldListeners中不存在，
  // 说明这个事件是需要新增的；反之如果oldListeners对象中存在某个key（即事件名）而listeners中不存在
  // 说明这个事件需要销毁
  let name, def, cur, old, event
  for (name in on) {
    // 遍历on(即listeners)单独处理每个事件名
    def = cur = on[name] // 新listener中的一个事件对应的所有回调函数, 多个的话为数组
    old = oldOn[name] // 旧listener中的同名事件对应的所有回调函数, 多个的话为数组
    event = normalizeEvent(name) // 处理时间名(见下)
    /* istanbul ignore if */
    if (isUndef(cur)) { 
    // 判断事件名对应的值是否存在, 不存在则警告(就是有事件没回调函数时候的警告)
      process.env.NODE_ENV !== 'production' && warn(
        `Invalid handler for event "${event.name}": got ` + String(cur),
        vm
      )
    } else if (isUndef(old)) {
      if (isUndef(cur.fns)) {
        cur = on[name] = createFnInvoker(cur, vm) // 见2.3
      }
      if (isTrue(event.once)) {
        cur = on[name] = createOnceHandler(event.name, cur, event.capture)
      }
      // 如果oldListener中不存在该方法则调用add注册新方法, 即$add
      add(event.name, cur, event.capture, event.passive, event.params)
    } else if (cur !== old) { // 第二次执行updateListeners时如果cur !== old
      // 用cur中当前事件名对应的所有回调函数覆盖掉createFnInvoker规定并赋值给上一轮cur的invoker
     // 注意上一轮invoker的fns属性就是createFnInvoker设置的invoker, 是oldListener中这个事件对应的所有回调函数
     // 现在用这个事件对应的最新的所有回调函数来覆盖掉这个事件对应的所有旧回调函数
     old.fns = cur
      on[name] = old
      // 通过 on[name] = old 保留引用关系, 保证事件回调只添加一次，之后仅仅去修改它的回调函数的引用
    }
  }
  for (name in oldOn) {
    // 遍历oldOn每一个事件名, 如果在on中不存在说明新的事件回调中没有该函数, 需要卸载
    if (isUndef(on[name])) {
      event = normalizeEvent(name)
      //根据不同的修饰符给事件名前面添加不同的符号以作标识，其实这个normalizeEvent 函数就是个反向操作，根据事件名前面的不同标识反向解析出该事件所带的何种修饰符
      remove(event.name, oldOn[name], event.capture)
    }
  }
}
```

---

## 3.3 createFnInvoker

```javascript
export function createFnInvoker (fns: Function | Array<Function>, vm: ?Component): Function {
  // fns参数为一个事件对应的所有回调函数, 即cur
  function invoker () {
    const fns = invoker.fns
    if (Array.isArray(fns)) {
      const cloned = fns.slice()
      //一个事件可以对应多个回调函数, 所以需要遍历
      for (let i = 0; i < cloned.length; i++) {
        invokeWithErrorHandling(cloned[i], null, arguments, vm, `v-on handler`)
      }
    } else {
      // return handler return value for single handlers
      return invokeWithErrorHandling(fns, null, arguments, vm, `v-on handler`)
    }
  }
  invoker.fns = fns // invoker.fns = cur
  return invoker
}
```


---

# 总结
-