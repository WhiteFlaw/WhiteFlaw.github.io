---
title: Vue2+Vuex 遍历存储动态长度数组
date: 2022-08-26
cover: /img/d1.webp
desc: Vue2+Vuex 遍历存储动态长度数组
tags: [CSS, 前端]
sticky: false
---

@[TOC](文章目录)

---

# 前言
今天接到一个导出报表的任务, 他们的报表都是单独一个组件, 然后在页面里点击导出可以呼出报表组件, 报表组件又引入了报表展示和报表打印组件, 还内置打印事件处理和下载事件处理.
我这个页面和正常的不太一样, 它是从页面里点击按钮做请求, 然后把结果传入报表展示, 正常的应该是在Vuex的`actions`里做请求. 这样的话导出的报表需要从页面导出数据, 免不了传值, 我需要从页面用`props`把值传进报表组件, 之后存进Vuex, 再在展示组件和打印组件使用. 

其实我也可以在actions里再做一次请求, 也可以简单很多, 无所谓, 虽然这对执行效率完全没好处而且会因为做了一次完全没用的请求造成代码冗余.

---

# 一、遍历存储
然后为了坚守原则付出惨痛的代价.
第一次传值我理所当然的把后端给的大数组(里面有很多对象的那种)直接通过`props`传入报表组件, 然后向Vuex里存了一大堆`undefined`.
我突然意识到这该是Vue不检测数组和对象的变化导致. 我在向Vuex存储值之前应该`watch`监听一下, 深度监听...
但是我们肯定是不能确定后端返回的数组里会有多少对象的...不过虽然不能拿到确切的属性值, 我们还是可以拿到这个数组的长度, 那么就可以遍历存储.

另外我们也不能给每个对象里的属性都来一个`mutations`函数, 但是每个对象里的属性都是一样的, 所以除了新值之外再传一个数组元素下标`i`, 这样到了`store`里可以说明当前这个值是要加到`queryResult`的哪个对象里的.

```javascript
watch: {
  queryResult: {
    deep:true,
    handler(newVal) {
      //数据长度用props传过来当然也可以
      for (var i = 0; i <= this.queryResult.length; i++) {
        this.$store.commit('EBBA020M/SET_DATA_A', newVal[i].dataA, i);
          this.$store.commit('EBBAO2BN/SET_DATA_B',newVal[i].dataB, i);
          this.$store.commit('EBBAO20N/SET_DATA_C', newVal[i].dataC, i);
          this.$store.commit("EBBAO20N/SET_DATA_D", newVal[i].dataD, i);
          this.$store.commit("EBBA32EN/SET_DATA_E", newVal[i].dataE, i);
          this.$store.commit("EBBAO20M/SET_DATA_F", newVal[i].dataF, i);
          this.$store.commit("EBBAO2ON/SET_DATA_G", newVal[i].dataG, i);
          this.$store.commit("EBBAO2OMN/SET_DATA_H", newVal[i].dataH, i);
          this.$store.commit("EBBAO2OMN/SET_DATA_I", newVal[i].dataI, i);
        }
      },
    },
  },
```

---

# 二 、准备存储方法
这个没什么好说的.
在`mutations`里准备好对象里各个属性的设置方法, 预留一个`i`参数, 这样可以往不同的对象里存值.
```javascript
SET_DATA_A(state, dataA, i) {
  state.reportTableData[i].dataA = dataA
}
SET_DATA_B(state, dataB,i) {
  state.reportTableData[i].dataB = dataB
},
SET_DATA_C(state, dataC, i) {
  state.reportTableData[i].dataC = dataC
},
SET_DATA_D(state, dataD, i) {
  state.reportTableData[i].dataD = dataD
}
SET_DATA_E(state, dataE, i) {
  state.reportTableData[1].dataE = dataE
}
SET_DATA_F(state, dataG, i) {
  state.reportTableData[i].dataG = dataG
}
SET_DATA_G(state, dataG, i) {
  state.reportTableData[i].dataG = dataG
}
SET_DATA_H(state, dataH, i) {
  state.reportTableData[i].dataH = dataH
}
SET_DATA_I(state, dataI, i) {
  state.reportTableData[i].dataI = dataI
}
SET_DATA_J(state, dataJ, i) {
  state.reportTableData[i].dataJ = dataJ
}
SET_DATA_K(state, dataK, i) {
  state.reportTableData[i].dataK = dataK
}
```

---

# 三 、准备存储空间
然后就还是崩, 因为你在直接往一个空数组里放属性, 还是重复赋值.
现在问题就是vuex中`reportTableData`的初始值是一个空数组:

```javascript
state: {
  reportTableData: [];
}
```

而且我们也不确定里面未来会有几个对象, 肯定不能提前写死. 那么还是利用数组长度, 我们得在第一节说到的那些数据开始存储之前在`queryResult`里准备好那些空对象, 不然属性直接加到空数组里就乱套了(好吧其实根本遍历不进去).
可以先在`store`的`actions`准备好一个函数, 我们用这个生成(不过这个不是异步函数不建议放actions)
```javascript
const actions = {

  //dataLength数组长度
  setDataLength ({ commit, state }, dataLength) { 
    commit('SET_DATA_LENGTH', dataLength); //存一下数据长度, 存否对本步无影响
    const initReportTableData = [];
    for(var i = 0; i <= dataLength; i++) { 
      initReportTableData.push({});
    }
    //把填好对象的数组设置为reportTableData报表数据默认值
    commit('SET_REPORT_TABLE_DATA', initReportTableData);

}
```
然后可以在第一步`watch`监听数据的那个页面的`create`周期调用它, 当然, 你得拿个函数把它包起来调用, 直接调会标红.

```javascript
create() {
  this.initData();
},
methods: {
  ...mapActions(['setDataLength']);
 initData() {
   setDataLength(this.queryResult.length);
 }  
}
```
然后现在初始该是这种格式了,  遍历存储就好了.
```javascript
state: {
  reportTableData: [
    {},
    {},
    {},
    ...
  ];
}
```
---

# 总结
-