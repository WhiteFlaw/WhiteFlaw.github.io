---
title: Vue2 Vuex的使用
date: 2022-07-15
cover: /img/d1.webp
desc: Vue2 Vuex的使用
tags: [Vue, 前端]
sticky: false
---

@[TOC](文章目录)

---

# 前言
Vuex可以更加方便的实现组件之间的数据共享, 大家都把数据集中存储在一个地方(store), 然后大家用数据的时候也都去那一个地方找.
我觉得在数据交流需求比较大的情况下, 这样会更有条理吧, 不用在这里传一次再到另一个组件再接再传.

刚看完教程, 额, 还是决定去看一下官方文档, 虽然这必然意味着更多的时间投入.
但是我也不想以后跟人家说"阿, 我会vuex." 然后就只是会用, 别的一概不知.

---

# 优点
我觉得优点显而易见, 但更多时候我无法组织起很系统的语言来描述它们.

 1. 能够在vuex中集中管理共享的数据, 易于开发和后期维护.
 2. 能够高效的实现组件之间的数据共享, 提高开发效率.
 3. 存储在vuex中的数据都是响应式的, 而且实时更新.
比如我在组件A申请对store中的值B进行改变, 那么改变之后, store中的其他方法、其他组件只要用到值B的都会立即做出改变.

---

# 'State'概念
刚看完教程时候的理解是`State`是一个存储数据的区域, 像是组件里的`data`;
按照文档的意思
Vuex采用"单一状态树", 一个对象包含应用的全部层级状态, Vuex是作为一个"唯一数据源"存在, 一个Vue应用仅会包含一个`store`实例. 

---

# 一、State获取状态
在Vue组件中获得Vuex状态, 即获取`state`中的数据.
官方说`最简单的方法`是在computed里使用`this.store.state.xxx`计算属性基于响应式依赖进行缓存, 这样仅仅在store数据发生变化时返回最新的值.
但这仅仅是最简单的方法, 在其他地方我们依然可以使用这种方法来获取`store`中的数据.

## 1.单个状态-直接获取
组件中获取store中的变量: 
```javascript
//"变量名"指state中存在的变量
this.$store.state.变量名
```
也可以通过这种方法来修改store中的数据, 但这是不被允许的, 以这种方式进行的修改将不被Vuex监控, 做不到响应式和实时同步.

---

## 2.多个状态-通过mapState获取
最简单的使用: 当`mapState`传的变量名已在`state`中存在时, 可以直接采用这种方法: 向`mapState`中传入字符串数组;

```html
<h3>{{state中的变量名}}<h3>
```
```javascript
import { mapState } from 'vuex';
computed: {
    ...mapState(['state中的变量名', 'state中的变量名']);
    //将state中的变量名映射为组件中的计算属性
}
```

---

# 二、Mutation同步存储/修改状态
前面说到更改store中状态的唯一方法是使用mutation.
"Vuex 中的 mutation 非常类似于事件：每个 mutation 都有一个字符串事件类型 (type)和一个回调函数 (handler)。这个回调函数就是我们实际进行状态更改的地方，并且它会接受 state 作为第一个参数."
其中的"事件类型"看起来更像是mutations里的函数名,
比如这个"increment"就是一个事件类型:

## 1.参数型提交
Mutations的提交像是事件驱动型函数, 触发与函数名相同的事件类型(type)就会调用这个函数.

贴近使用环境一点, 用事件处理函数来举例, 点击调用`store.commit()`, 首参传入事件(type), 二参传入载荷(Payload, 官方叫法, 实际上就是参数, 像emits那样)

在大多数情况下，载荷(参数)应该是一个对象，这样可以包含多个字段并且使`mutations`更易读.
```javascript
//store.js
mutations: {
  mutations函数 (state, 参数) {
    ///...
  }
}
```
```javascript
//组件
methods: {
  btnClick(参数) {
    this.$store.commit("mutations函数名", 参数)
  }
}
```

---

## 2.对象风格提交
提交 mutation 的另一种方式是直接使用包含 type 属性的对象;
当使用对象风格的提交方式，整个对象都作为payload载荷传给 mutation 函数，因此mutations的处理函数保持不变：

```javascript
//store.js
mutations: {
  mutations函数 (state, payload) {
    state.count += payload.属性名
  }
}
```

```javascript
//组件
methods: {
  btnClick(参数) {
    this.$store.commit({
    type: 'mutations函数名',
    属性名: 属性值
    })
  }
}
```
我可能会倾向这种方法吧...我觉得这样更好看一些.

注意`mutation`内是不允许异步的, `mutations`调用时往往回调函数未调用, `devtools`也不知道回调函数在什么时候调用, 这不利于Vuex对状态的控制, 状态无法被追踪.

---

# 三、Action异步存储/修改状态
`Action`改造Mutation的调用方式, 以此达到异步更改状态的目的.
`Action`提交的是`mutation`, 而不是直接变更状态.
`Action`可以包含任意异步操作.

## 1.mapActions分发Action
按照笔记顺序来吧, 先说组件中分发Actions的情况.
使用`mapActions`辅助函数将组件的`methods`映射为`store.dispatch`调用.

需要直接调用actions方法时:
```javascript
//store.js
mutations: {
  increment: function(state, payload) {
    console.log(payload);                    //输出4
  }
},
actions: {
  asyncFun: function (context, payload) {
    setTimeout(function () {                 //异步操作
      context.commit("increment", payload);  //调用mutations函数
    }, 2000)
  },
  asyncFun2: function (context, payload) {},
  asyncFun3: function (context, payload) {},
},
```
```javascript
//组件
import { mapActions } from 'vuex';
methods:{
  ...mapActions(['asyncFun', 'asyncFun2', 'asyncFun3']);
  btnClick() {
    this.asyncFun(4);  //直接作为事件处理函数也可以
  }
}
```
`...mapActions`映射`actions`方法:
```javascript
//store.js
mutations: {
  add(state, payload) {
    console.log(payload);   //输出4
  },
},
actions: {
  increment: function (context, payload) {
    setTimeout(function () {
      context.commit("add", payload);
    })
  }
},
```

```javascript
//组件
methods: {
  ...mapActions({
    adr: "increment", // 将 `this.adr()` 映射为 `this.$store.dispatch('increment')`
  }),
  btnClick() {
    this.adr(4)
  },
},
```

---

## 2.dispatch()分发Action

```javascript
//store.js
mutations: {

  increment(state, addValue) {
    state.count += addValue.num;   //这个num待会要作为参数传入
  },
  
},
actions: {

  AsyncFun: function (context, cutValue) {
    setTimeout(function () {
      context.commit("increment", 参数);
    }, 2000)
  },
  
}
```

这里的参数也被称为"载荷(payload)";
函数形式:

```javascript
//组件
methods: {
  btnHandler1(参数) {
  
    this.$store.dispatch("AsyncFun", 参数);
    
  }
}
```

对象风格, 嗯对, 虽然不是辅助函数但是也有对象风格:

```javascript
store.dispatch({
  type: 'AsyncFun',
  num: 10
})
```

---

# 四、Getter
Getter用于对Store中的数据进行操作形成新的数据, 这有点像是组件里的计算属性.
Store中的数据发生变化后, Getter中的数据也会发生变化

```javascript
//store.js
export default new Vuex.Store({
  state: {
    count: 0
  },
  getters: {
  
    showNum: state => {
      let newCount = state.count += 3;
        return newCount;
      }
      
  }
})
```

## 1.通过属性访问getter函数
Getter 会暴露为 store.getters 对象，可以以属性的形式访问getter函数: 
```javascript
//组件
methods: {
  btnClick() {
  
    console.log(this.$store.getters.showNum);
    
  }
}
```

---

## 2.通过方法访问getters函数
直接锁定到getter方法调用, 可以传参, 看起来和通过属性访问很像...
```javascript
//组件
methods: {
  btnClick() {
    console.log(this.$store.getters.showNum(2));
  }
}
```

---

## 3.通过mapGetters辅助函数访问getters函数
把需要用到的函数作为字符串数组传入`mapGetters`
直接引用
```javascript
//组件
methods: {
  ...mapGetters(["showNum1", "showNum2"]);
  btnHandler1() {
    this.showNum1();
  }
}
```
映射到某个方法:
```javascript
//组件
methods: {
  ...mapGetters({
    doneCount: 'showNum1'
  });
  btnHandler1() {
    this.doneCount();
  }
}
```

---

# 五、2022-7-27补
做了一个小demo, 我觉得有必要记录一下Actions, mutations向组件分发的方式, 以及Actions如何提交mutations.
我经常忘记这几句, 在这个过程中, 有好几次在我知道下一步该做什么的情况下想不起来怎么写...

## 1.分发Actions
mapActions法:
```javascript
//引入mapActions
import { mapActions } from 'vuex';
//methods函数内
...mapActions(['asyncFun1', 'asyncFun2', 'asyncFun3']);
```

dispatch法:
```javascript
//methods函数内
this.$store.dispatch("AsyncFun", 参数);
```

---

## 2.分发Mutations
对象风格提交:
```javascript
//methods函数内
this.$store.commit({
    type: 'mutations函数名',
    参数名: 参数值
    })
```

参数型提交: 
```javascript
//methods函数内
this.$store.commit("mutations函数名", 参数);
```

## 3.actions提交mutations
```javascript
context.commit("mutations函数", 参数);
```

## 映射state为计算属性
```javascript
//组件
computed: {
  ...mapState(["list", "inputValue"]), //将inputValue映射为当前组件的一个计算属性
},
```

---

# 总结
13号开始Vuex的时候状态还不错, 我用一天完成了大概一半的进度, 之后两天因为垃圾作息一直精力涣散, 这篇拖拖拉拉一直到了15日下午才完成... 