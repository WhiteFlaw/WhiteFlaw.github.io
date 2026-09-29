
@[TOC](文章目录)

---

# 前言
Vue2 `computed`中`setter`的使用方法, 在什么情况下使用`setter`, 对于`setter`的一些个人见解.

---


# 一、可写计算属性setter
> 计算属性默认仅能通过计算函数得出结果。当你尝试修改一个计算属性时，你会收到一个运行时警告。

`computed`计算属性内直接写的话是默认编辑`getter`, 但是`getter`部分严格遵守`computed`最佳实践风格(见第二章), 在这种限制下可能会使需求的完成受阻.
我的理解是, `setter`的存在并非为了在最佳实践规则上开个口子退而求其次的妥协以完成目标, 而是通过对`setter`的使用可以实现在最佳实践风格的基础上达到目的, 比如在计算属性被赋值的解决方案中使用`setter`, 可以在操作`data`数据的情况(即违反不产生副作用规则的情况)下避免标红.
呃, 计算属性被 "赋值" 这个说法对我造成过一些误导, 就个人而言, 我感觉这更像是在 "传参", 虽然这看起来的确是赋值操作.

看起来是这样的: 

```javascript
// 在某个函数里
this.计算属性 = '参数'
```

但是`computed`对此的应对: 

```javascript
computed: {
  计算属性: {
    get() {},
    // setter
    set(newValue) { // newValue为赋的值
      // 函数体
    }
  }
}
```
是作为参数传入`setter`函数中执行, 而不是直接把这个计算属性变成变量那样的随意重赋值的东西.

---

# 二、为何使用setter
Vue中有些`computed`属性使用的不推荐方案, 但是有时为了完成需求又需要这些不推荐的方案.
`setter`可以解决这些情况, 让`computed`在那几种特殊情况下依旧能以最佳实践方案运作.

##  1.需要修改计算属性值
Vue并不推荐 并且 不建议直接修改计算属性值:

> 从计算属性返回的值是派生状态。可以把它看作是一个“临时快照”，每当源状态发生变化时，就会创建一个新的快照。更改快照是没有意义的，因此计算属性的返回值应该被视为只读的，并且永远不应该被更改——应该更新它所依赖的源状态以触发新的计算。

我的理解是, 我们应该通过主动改变那些源状态(就是影响本次`computed`计算结果的源)以驱动`computed`去计算需要的值, 而不是在不断变动并不稳定的`computed`返回值上直接做更改.
这点的体现是如果去除`computed`中的`setter`后依旧直接为计算属性赋值, 那么将会触碰这条红线引发报错:

```javascript
 Computed property "xxx" was assigned to but it has no setter.
```

---

## 2.不可避的计算属性副作用
我逐渐习惯`Eslint`了.
`Eslist`下的`computed`(我是说它的`getter`内)禁止进行对`data`数据的赋值操作, 会标红计算属性不应有副作用, 这里的副作用也包括DOM更改和网络请求等等.

> 计算属性的计算函数应只做计算而没有任何其他的副作用，这一点非常重要，请务必牢记。举例来说，不要在计算函数中做异步请求或者更改 DOM！一个计算属性的声明中描述的是如何根据其他值派生一个值。因此计算函数的职责应该仅为计算和返回该值。在之后的指引中我们会讨论如何使用监听器根据其他响应式状态的变更来创建副作用。

如果在`setter`中进行则不会有这种报错情况, 不过我还是不会在`computed`里给`data`赋值的.

---

# 三、使用setter

```html
<template>
  <div id="demo">
    <button @click="changeComputed">changeComputed</button>
    <input type="text" v-model="firstName" />
    <input type="text" v-model="lastName" />
  </div>
</template>

<script>
export default {
  data() {
    return {
      firstName: "John",
      lastName: "Doe",
    };
  },
  computed: {
    fullName: {
      get() {
        return this.firstName + " " + this.lastName;
      },
      set(newValue) {
        this.firstName = newValue;
        this.lastName = newValue.split(" ");
      }
    }
  },
  methods: {
    changeComputed() {
      this.fullName = 'bai X'
    }
  }
};
</script>
```
在这个过程中通过`setter`修改源状态驱动`computed`的`getter`再次触发生成了新的值, 遵循了避免直接修改计算属性值的建议.
但是如果`setter`并没有对计算属性`getter`中的源状态造成影响, `getter`将不会重新执行, 即 并非触发`setter`就一定会触发`getter`, 他们两个是相互独立的, 对应计算属性的两种用法, 如果你对计算属性进行写入操作, 那就先过`setter`, 如果本次`setter`对源状态有影响, 那么也过一次`getter`, 如果只是调用计算属性, 那么只过`getter`.

至于"计算函数不应有副作用", 我们的确在`computed`中对`data`数据进行了修改, 这似乎并未能避免...


---

# 总结
-