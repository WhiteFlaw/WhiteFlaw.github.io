---
title: 对Vue生命周期的简单见解
date: 2021-04-14
cover: /img/d5.webp
desc: 对Vue生命周期的简单见解
tags: [Vue, 前端]
sticky: false
---

# 前言
升学，找工作，失业，找工作，买房，成家，一些人甚至至死都没能跑完这条人生的长路，他们的一生在奔波中度过，却不曾看到过一丝沿途的风景。

Vue是一个这样的人，在他短暂而被安排的明明白白的人生路途中，只剩下奔波，沿途的风景未能让他驻足一瞬，他创造的诸多美好，却从无法看哪怕是一眼。 狗头)
# 一、甚麽是[Vue的生命周期]？
Vue的每个组件都是独立的，正因如此，Vue的每个组件也都有各自的生命周期（就像人的肺和肾都有自己的寿命），他们共同组成了[Vue的生命周期]。

Vue并不像人的生命周期一样有生老病死，如果Vue对象不被销毁，Vue会一直在那里，所以“生命周期”这个词在此处大可不必完全解读为“生命周期”原本的意思，知道是Vue创立后固定要做的那么些事儿就好了。

# 二、生命周期函数
有时我们需要在Vue执行到某一步时，执行某些操作，那么可以利用这些生命周期函数来完成，把要执行的命令写进这些生命周期函数里，在Vue执行到这些函数的所在时，就会顺带完成你需要的操作，而我们首先要知道这些周期函数在什么时候会被执行、他们都是哪些。

## 1.beforeCreate
在示例初始化、data observer配置和事件配置完成之间调用
## 2.created
初始化依赖和注入，data初始化完毕，计算属性和event/watch事件进行回调后，DOM树挂载前。
通常会在此处进行一部分网络请求。
## 3.beforeMount
挂载前，创建虚拟el前，生成模板template后。
## 4.mounted
挂载完成，DOM树渲染完毕后。
## 5.beforeDestory
Vue实例销毁前。
## 6.destoryed
Vue所有子组件销毁后。
##  7.beforeUpdate
数据data有更新，已被调用后。
##  8.updated
虚拟DOM重新渲染发生变化的数据。

```javascript
  Vue.prototype._update = function (vnode: VNode, hydrating?: boolean) {
    const vm: Component = this
    const prevEl = vm.$el
    const prevVnode = vm._vnode
    const restoreActiveInstance = setActiveInstance(vm)
    vm._vnode = vnode
    // Vue.prototype.__patch__ is injected in entry points
    // based on the rendering backend used.
    if (!prevVnode) {
      // initial render
      vm.$el = vm.__patch__(vm.$el, vnode, hydrating, false /* removeOnly */)
    } else {
      // updates
      vm.$el = vm.__patch__(prevVnode, vnode)
    }
    restoreActiveInstance()
    // update __vue__ reference
    if (prevEl) {
      prevEl.__vue__ = null
    }
    if (vm.$el) {
      vm.$el.__vue__ = vm
    }
    // if parent is an HOC, update its $el as well
    if (vm.$vnode && vm.$parent && vm.$vnode === vm.$parent._vnode) {
      vm.$parent.$el = vm.$el
    }
    // updated hook is called by the scheduler to ensure that children are
    // updated in a parent's updated hook.
  }
```

# 三、Vue的一生要做些甚麽？
## 1.Vue对象创立，Vue出生。
构造函数生成Vue实例；

```javascript
new Vue();
```

## 2.初始化
原步骤Init Event&Lifecycle;
初始化事件相关：Event;
初始化各生命周期函数：Lifecycle（也叫钩子函数）；

```javascript
import { initEvents } from './events'
import { mark, measure } from '../util/perf'
import { initLifecycle, callHook } from './lifecycle'
```

```javascript
//src/core/instance/lifecycle.js
export function initLifecycle(vm: Component) {
  const options = vm.$options

  // locate first non-abstract parent
  let parent = options.parent
  if (parent && !options.abstract) {
    while (parent.$options.abstract && parent.$parent) {
      parent = parent.$parent
    }
    parent.$children.push(vm)
  }

  vm.$parent = parent
  vm.$root = parent ? parent.$root : vm

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
以上为对生命周期函数lifecycle的初始化
```javascript
//src/coreinstance/event.js
export function initEvents (vm: Component) {
  vm._events = Object.create(null)
  vm._hasHookEvent = false
  // init parent attached events
  const listeners = vm.$options._parentListeners
  if (listeners) {
    updateComponentListeners(vm, listeners)
  }
}
```
以上为对事件Event的初始化
```javascript
export function callHook(vm: Component, hook: string) {
  // #7573 disable dep collection when invoking lifecycle hooks
  pushTarget()
  const handlers = vm.$options[hook]
  const info = `${hook} hook`
  if (handlers) {
    for (let i = 0, j = handlers.length; i < j; i++) {
      invokeWithErrorHandling(handlers[i], vm, null, vm, info)
    }
  }
  if (vm._hasHookEvent) {
    vm.$emit('hook:' + hook)
  }
  popTarget()
}
```
以上为调用钩子函数Hook

## 2.5BeforeCreated函数调用
生命周期函数BeforeCreated被调用。

```javascript
//src/core/instance/init.js
   callHook(vm, 'beforeCreate')
   ```

## 3.继续初始化
原步骤Init injections & reactivity & state
初始化依赖提供：provide；
初始化依赖注入：injections；
初始化Vue响应式的核心：reactivity ；
provide提供依赖，提供的依赖可以是一个对象，或者是一个能返回对象的函数。依赖内包含了属性和属性值，属性值可以是一个对象。
injections 注入依赖，在后代组件里使用 inject 选项来为其注入需要添加在这个实例上的属性，包含from和default默认值。
reactivity系列是Vue响应式的核心。
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/e0b6f977769d62a4e694d0eaf979b07b.jpeg)
需要调用以上函数
```javascript
//src/core/instance/inject.js
export function initProvide (vm: Component) {
  const provide = vm.$options.provide
  if (provide) {
    vm._provided = typeof provide === 'function'
      ? provide.call(vm)
      : provide
  }
}

export function initInjections (vm: Component) {
  const result = resolveInject(vm.$options.inject, vm)
  if (result) {
    toggleObserving(false)
    Object.keys(result).forEach(key => {
      /* istanbul ignore else */
      if (process.env.NODE_ENV !== 'production') {
        defineReactive(vm, key, result[key], () => {
          warn(
            `Avoid mutating an injected value directly since the changes will be ` +
            `overwritten whenever the provided component re-renders. ` +
            `injection being mutated: "${key}"`,
            vm
          )
        })
      } else {
        defineReactive(vm, key, result[key])
      }
    })
    toggleObserving(true)
  }
}
```
以上为初始化依赖提供provide与依赖注入injections
```javascript
//src/core/instance/state.js
export function initState (vm: Component) {
  vm._watchers = []
  const opts = vm.$options
  if (opts.props) initProps(vm, opts.props)
  if (opts.methods) initMethods(vm, opts.methods)
  if (opts.data) {
    initData(vm)
  } else {
    observe(vm._data = {}, true /* asRootData */)
  }
  if (opts.computed) initComputed(vm, opts.computed)
  if (opts.watch && opts.watch !== nativeWatch) {
    initWatch(vm, opts.watch)
  }
}
```
以上为初始化state
## 3.5Create函数调用
生命周期函数Create被调用。
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/33c3d0ec47d0327c66c133e6b9649033.jpeg)
此段出自Vue源码文件"init.js"
## 4.判断el是否挂载了DOM
没有挂载就挂载一个。
有就直接下一步。
watch事件回调
this._init末的$mount函数运作。

```javascript
//src/platform/web/runtime/index.js
Vue.prototype.$mount = function (
  el?: string | Element,
  hydrating?: boolean
): Component {
  el = el && inBrowser ? query(el) : undefined
  return mountComponent(this, el, hydrating)
}
```
以上为$mount函数的基本模型
```javascript
//src/platform/web/entry-runtime-with-compiler.js
Vue.prototype.$mount = function (
  el?: string | Element,
  hydrating?: boolean
): Component {
  el = el && query(el)

  /* istanbul ignore if */
  if (el === document.body || el === document.documentElement) {
    process.env.NODE_ENV !== 'production' && warn(
      `Do not mount Vue to <html> or <body> - mount to normal elements instead.`
    )
    return this
  }

```
以上为Vue中的$mount函数被调用

```javascript
  Vue.prototype.$watch = function (
    expOrFn: string | Function,
    cb: any,
    options?: Object
  ): Function {
    const vm: Component = this
    if (isPlainObject(cb)) {
      return createWatcher(vm, expOrFn, cb, options)
    }
    options = options || {}
    options.user = true
    const watcher = new Watcher(vm, expOrFn, cb, options)
    if (options.immediate) {
      try {
        cb.call(vm, watcher.value)
      } catch (error) {
        handleError(error, vm, `callback for immediate watcher "${watcher.expression}"`)
      }
    }
    return function unwatchFn () {
      watcher.teardown()
    }
  }
```
$watch被调用
## 5.判断是否有模板
模板template作为模板占位符，用来包裹HTML元素，其不会被渲染到页面上，可以有三种写法：作为option属性写在Vue对象里、直接作为HTML标签、写在script标签里（第三个官方推荐写法,为script标签里的type属性赋值"x-template"）。
有template模板
把模板template转换为render函数（render函数会在后续渲染DOM中发挥作用）。
无template模板
将el挂载的对象的外层HTML作为模板template。
没有对象就new一个啊（不是）
this._init末的$mount函数运作完毕。

```javascript
//src/platform/web/entry-runtime-with-compiler.js
  const options = this.$options
  // resolve template/el and convert to render function
  if (!options.render) {
    let template = options.template
    if (template) {
      if (typeof template === 'string') {
        if (template.charAt(0) === '#') {
          template = idToTemplate(template)
          /* istanbul ignore if */
          if (process.env.NODE_ENV !== 'production' && !template) {
            warn(
              `Template element not found or is empty: ${options.template}`,
              this
            )
          }
        }
      } else if (template.nodeType) {
        template = template.innerHTML
      } else {
        if (process.env.NODE_ENV !== 'production') {
          warn('invalid template option:' + template, this)
        }
        return this
      }
    } else if (el) {
      template = getOuterHTML(el)
    }
    if (template) {
      /* istanbul ignore if */
      if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
        mark('compile')
      }

      const { render, staticRenderFns } = compileToFunctions(template, {
        outputSourceRange: process.env.NODE_ENV !== 'production',
        shouldDecodeNewlines,
        shouldDecodeNewlinesForHref,
        delimiters: options.delimiters,
        comments: options.comments
      }, this)
      options.render = render
      options.staticRenderFns = staticRenderFns

      /* istanbul ignore if */
      if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
        mark('compile end')
        measure(`vue ${this._name} compile`, 'compile', 'compile end')
      }
    }
  }
  return mount.call(this, el, hydrating)
}

```
判断是否具有模板template，若是无模板template就将外层HTML转换为template;
## 5.5beforeMount函数调用
生命周期函数beforeMount被调用。
## 5.6前面生成的render函数被调用
render函数被调用来生成虚拟DOM，虚拟DOM是渲染好的。

```javascript
  Vue.prototype._render = function (): VNode {
    const vm: Component = this
    const { render, _parentVnode } = vm.$options

    if (_parentVnode) {
      vm.$scopedSlots = normalizeScopedSlots(
        _parentVnode.data.scopedSlots,
        vm.$slots
      )
    }

    // set parent vnode. this allows render functions to have access
    // to the data on the placeholder node.
    vm.$vnode = _parentVnode
    // render self
    let vnode
    try {
      vnode = render.call(vm._renderProxy, vm.$createElement)
    } catch (e) {
      handleError(e, vm, `render`)
      // return error render result,
      // or previous vnode to prevent render error causing blank component
      /* istanbul ignore else */
      if (process.env.NODE_ENV !== 'production' && vm.$options.renderError) {
        try {
          vnode = vm.$options.renderError.call(vm._renderProxy, vm.$createElement, e)
        } catch (e) {
          handleError(e, vm, `renderError`)
          vnode = vm._vnode
        }
      } else {
        vnode = vm._vnode
      }
    }
    // if the returned array contains only a single node, allow it
    if (Array.isArray(vnode) && vnode.length === 1) {
      vnode = vnode[0]
    }
    // return empty vnode in case the render function errored out
    if (!(vnode instanceof VNode)) {
      if (process.env.NODE_ENV !== 'production' && Array.isArray(vnode)) {
        warn(
          'Multiple root nodes returned from render function. Render function ' +
          'should return a single root node.',
          vm
        )
      }
      vnode = createEmptyVNode()
    }
    // set parent
    vnode.parent = _parentVnode
    return vnode
  }
```
以上为对render函数的调用
## 6.虚拟el创建，DOM替换
原步骤Create vm $el and replace "el" with it.
Vue实例下的虚拟el创建，虚拟DOM替换原本的DOM。
 -render方法在此处运作生成虚拟DOM对象。
## 6.5.DOM树渲染至页面完毕
虚拟DOM挂载完毕，DOM树已经成功渲染至页面，页面已经具有样式，可以进行正常DOM操作。
## 7.Mounted函数调用。
生命周期函数Mounted调用。

## 8.准备完毕Mounted状态
如果在这个状态出现了数据更新需要再次渲染来更新页面：
生命周期函数BeforeUpdate调用；
虚拟DOM重新渲染，但仅以最小的DOM开支渲染发生变化的部分，其他部分复用，节省工作量。
## 9.Vue实例被请求销毁
## 9.5BeforeDestory函数调用
生命周期函数BeforeDestory调用。
## 10.清除各Vue组件
清除watchers、child子组件、components和eventlistener事件监听 等等......
```javascript
  Vue.prototype.$destroy = function () {
    const vm: Component = this
    if (vm._isBeingDestroyed) {
      return
    }
    callHook(vm, 'beforeDestroy')
    vm._isBeingDestroyed = true
    // remove self from parent
    const parent = vm.$parent
    if (parent && !parent._isBeingDestroyed && !vm.$options.abstract) {
      remove(parent.$children, vm)
    }
    // teardown watchers
    if (vm._watcher) {
      vm._watcher.teardown()
    }
    let i = vm._watchers.length
    while (i--) {
      vm._watchers[i].teardown()
    }
    // remove reference from data ob
    // frozen object may not have observer.
    if (vm._data.__ob__) {
      vm._data.__ob__.vmCount--
    }
    // call the last hook...
    vm._isDestroyed = true
    // invoke destroy hooks on current rendered tree
    vm.__patch__(vm._vnode, null)
    // fire destroyed hook
    callHook(vm, 'destroyed')
    // turn off all instance listeners.
    vm.$off()
    // remove __vue__ reference
    if (vm.$el) {
      vm.$el.__vue__ = null
    }
    // release circular reference (#6759)
    if (vm.$vnode) {
      vm.$vnode.parent = null
    }
  }
}
```
$destory清除实例里的方法
## 11.组件销毁完毕
## 12.Destory函数调用
生命周期函数Destory调用。



至此Vue的一段生命周期便执行完成，它完成了它的使命，暂时。
# 总结
今天先告一段落...
终于考完试了！打算下面几天都拿来肝文了！
已经加入一些Vue源码片段来展示各个生命周期函数：~），我依然在完善这篇文章，部分代码尚未找到，所以后续还会有增加...