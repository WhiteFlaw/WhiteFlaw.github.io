@[TOC](文章目录)

---

# 前言
昨天拿到一个任务需要自己写组件, 然后就遇到这个问题了. 
父组件中, 我需要在鼠标选中多选表格的一行时将这一行的数据对象传入子组件, 显然这不是个异步操作, 但是子组件那边怎么都拿不到值, 子组件需要在`created`周期调用一堆函数, 函数里面需要用到这个传过来的表格数据对象.
但是在函数里怎么数据对象输出都是`undefined`, 我大概对我的`watch`做了4-5次改进, 都没有解决这个事情, 起初以为是没有深度监听, 然后认为是需要深度监听里把新对象里的每个值遍历赋值出来存储.
最后病急乱投医了直接觉得是createed周期太早了而取不到.

---

# 一、错误分析
首先我不应该把新值重新赋值到props的`this.rawParams`...额是个低级错误, 这违背了Vue类似MVVM的通信原则.
其次我在父组件里组织这个对象的方式是使用`obj.xxx = xxx`的方式, 这就是改变对象值, 会加大监听难度, 不过这篇也是围绕这点来说的.

我两天有一个猜想, props传值的时候直接传个新的对象(就是直接把一个做好的对象赋值到要传的变量), 和使用`obj.xxx`的格式慢慢组织对象后传入, 这两种办法在被子组件监听时是否会有区别?
正好今天遇到这个情况, 顺手试一下, 我把两种情况各分一个章节来说.

---

# 二、如何监听一个对象整体的改变?
这就是我说的第一种情况, 直接组织好对象, 把整个新对象传入.
直接赋值一个新的对象更加易于监听到, 这就像直接赋值了一个String或者什么别的类型的变量:

```html
<!-- 父组件内 -->
<ebec030i-res-display
  :rawParams="rawParams"
>
</ebec030i-res-display>
```

```javascript
//父组件事件
//你就想一个方法触发这玩意儿就好了, 不写了...
rowClick(row) {
  let temParams = {}
  temParams.会计科目 = row.value1
  temParams.往来单位 = row.value2
  temParams.管理编号 = row.value3
  temParams.余额 = row.value4
  this.rawParams = temParams
},
```
直接传新对象的话可以像监听一个简单数据类型一样去监听, 当然, 待会会说到监听对象内值变化的监听方法, 你也可以用那个监听这个...只要你愿意.
```javascript
// 子组件监听
watch: {
  watchRawParams: {
    handler: function(newVal, oldVal) {
      console.log(newVal)
      console.log(oldVal)
    },
    deep: true,
    immediate: true,
  },
},
```

---

# 三、如何监听对象中一个属性值的改变?
相比直接赋值新的对象, 监听一个值的变化牵扯到深浅拷贝,  现在要监听`this.rawParams`.
出于性能的考虑, Vue天生不支持检测对象里属性值本身的变化(可以做, 但是性能消耗大, 成本与用户收益不成正比), `watch`监听单个属性值的变化也需要做一些特殊的配置.

```javascript
rowClick(row) {
  this.rawParams.会计科目 = row.value1
  this.rawParams.往来单位 = row.value2
  this.rawParams.管理编号 = row.value3
  this.rawParams.余额 = row.value4
},
```

```javascript
computed: {
  watchRawParams: function() {
    let obj = {}
    Object.keys(this.rawParams).forEach((key) => {
      obj[key] = this.rawParams[key]
    })
    return obj
  }
},
watch: {
  watchRawParams: {
    handler: function(newVal, oldVal) {
      console.log(newVal)
      console.log(oldVal)
    },
    deep: true,
    immediate: true,
  },
},
```

话说我以前干过这种蠢事, 我把监听到的新值又赋值给props里的值, 然后各种崩...这不符合MVVM的规范(其实根本成功不了). 所以现在有两种选择是在`data`上开一个新值来接收监听完的值, 或者用`computed`来接收.
修改对象或者数组, 也就是我说的第二种情况时, `watch`监听的新值和旧值都会指向同一个原数据, 也就是浅拷贝. 仅针对数组或者对象来说, 浅拷贝结果的子对象如果发生改变会导致源数据一同改变, 进而影响其它指针上的浅拷贝.  
而第二种情况即是在浅拷贝情况下对对象子对象的改动, 会影响到源数据继而影响其他指针上的浅拷贝结果.
导致的后果就是`watch`监听到的新值和旧值是一样的, 判定为不需要进行值变动处理方案, 这种时候不会执行`watch`里你规定的值变化处理方案, 连里面的输出都不会执行.

所以如果是这种情况, 需要手动深拷贝一个完全一样的待监听对象出来还要让他们时刻保持相同, `computed`无疑更加合适, 缓存机制让它仅仅在发生变动时参与计算, 可以保证深拷贝出的待监听对象与原待监听对象完全相同又完全隔离互不影响.
原理是把第二种方式转换为第一种方式, 直接由`computed`返回一个全新的数组来避免使用浅拷贝监听.

---

# 四、如何组织对象避免监听失败
不需要监听对象属性值变化(或者能组织新数组)就直接赋值做好的新数组, 参考第二章, 很多时候并不需要监听属性值变化, 尽量避免.
不能避免的需要监听对象属性值变化, 参考第三章使用深拷贝法.

---

# 总结
被坑惨了...今下午修这个组件修了一个多小时啊啊啊....
希望这篇文章对你有帮助.