@[TOC](文章目录)

---

# 前言
Element pagination, 每页数据量不同的解决方案, 单页数据不足会空出空间.
我知道`Pagination`组件有`page-count`属性, 但是如果需要支持pageSize的更改, 就只能给出`pageSize`和`total`让组件自己计算.

我在项目中使用到了被二次封装的`el-pagination`组件, 同上, 为了能支持`pageSize`的更改, 组件作者也采用了`pageSize`+`total`设置页数的方式, 需要传入总数据量`total`和单页最大数据量`pageSize`, 虽然我是围绕这个组件说的, 但是不用担心, 这个组件封装的很浅, 而且也通过同`el-pagination`的`pageSize`加`total`方法来分页.

对于全部数据无差别的平均分页, 这个方案是比较理想的, 但是举例`pageSize`为10, 第一页只需要展示3条记录, 第二页需要6条, 在前端分页的情况下就不太好办了.

首先`pageSize`没法给, 固定值给上去就变成数据平均分页. `pageSize`也不能实时计算, `pageSize`一旦不固定, Element计算的总页码也是随着翻页不断变化, 这样页码的意义又在何处, 而且容易在末页产生空页情况.

---


# 一、情景
## 1.前端情况
这种情况后端分页会好办一些, 额, 采用前端分页, 切页不做请求.
`Element`多选表格, 选中多项后提交, 前端拿所有受选项去后端查询, 每个受选项查询到不定数量结果返回给前端, 后端一次性返回分隔好的所有受选项查询结果, 前端每页仅展示一个受选项的所有查询结果.


所以, 每页数据量不固定, 也不允许均分数据展示.

---

## 2.后端数据
`data[i].ezglist`数组为单页数据, 其内部一个对象为一条记录.
`data[i].ezglist`内部记录数量不定.
```json
"data": [
  {
    "ezglist": [
      {
        "xxx": "xxx",
        "xxx": "xxx",
        "xxx": "xxx",
        "xxx": "xxx"
      }
    ]
  },
  {
    "ezglist": [
      {
        "xxx": "xxx",
        "xxx": "xxx",
        "xxx": "xxx",
        "xxx": "xxx"
      },
      {
        "xxx": "xxx",
        "xxx": "xxx",
        "xxx": "xxx",
        "xxx": "xxx"
      }
    ]
  },
  ...
]
```
这个就是第二章的`res`, 虽然不会这么短.

---

# 二、解决方案
这个二次封装的组件已经在多处使用, 我绝对不该乱动, 最好是从我的数据下手, 然后可以在渲染的时候做一点小手脚, 基本原理是用空数据占据单页内的空缺位, 防止分页组件平均分数据的时候下一页的数据压上来, 不过你放心也不会展示空行的.
这里用到了Vuex, 额, 那些指令都是SET开头, 你完全可以简单理解, 向Vuex中的某某`set`一个新的值.

---

## 1.处理数据
各个步骤的方法我已经全部抽离, 那么这个函数或许可以作为一个流程图?
```javascript
async initTableData({ commit, state, dispatch }, queryParams) { // 初始化报表数据
  commit('SET_TABLE_LOADING', true); // 启动表格加载
  
  commit('SET_PAGE_SIZE', 9); // 固定pageSize
  
  const res = await EBEC030IBillPrint(queryParams); // 请求所有页面的、全部的数据
  commit('SET_PAGE_TOTAL', res.length); // 初始化总页数

  await dispatch('stabilizeTableAllData', res); // 生成稳定化数据
  await dispatch('getDataTotal', state.reportTableAllData); // 获取稳定化数据内所有记录构成的数组
  //必须在调节数据条数进行dataTotal获取
  
  commit('SET_REPORT_TABLE_DATA', state.reportTableAllData[0].ezglist); // 初始化第一页数据
  
  commit('SET_TABLE_LOADING', false); // 关闭表格加载
  },
```

---

1. 固定`pageSize`
如果你需要完全的隔离, 甚至都不允许有一点的本页数据流入其他页面, 就写大一点, 大到你觉得本页数据量不可能达到的值.
我没有这样, 我允许单页内多出的数据再独占几页. 不过你依然可以按照这个方法做, 我们的区别只会是`pageSize`大小, 只要你的`pageSize`够大, 就会是你希望的结果.
```javascript
commit('SET_PAGE_SIZE', 9); // 固定pageSize
```

---

2. 请求原始数据
也就是第一章提到的那种数据格式的数据. 并以原始数据中的对象数量作为总页数:

```javascript
const res = await EBEC030IBillPrint(queryParams); // 请求所有页面的、全部的数据
commit('SET_PAGE_TOTAL', res.length); // 初始化总页数
```

---

3. 稳定化处理
基于`pageSize`对待渲染数据进行稳定化处理
```javascript
await dispatch('stabilizeTableAllData', res); // 生成稳定化数据
```

```javascript
stabilizeTableAllData({ commit, state }, data) {
  data.forEach((item) => {
    if (item.ezglist.length < state.pageSize) { // 判定:本页数据不足以填充整个页面
      const temNum = state.pageSize - item.ezglist.length; // 计算空缺位
      for (let i = 0; i <= temNum - 1; i++) { // 空缺位补齐
        item.ezglist.push(''); // 加空字符串性能大概会好些...
      }
    }
    
    if (item.ezglist.length > state.pageSize) { // 判定: 本页数据将超出本页面
      const temNum = state.pageSize - Math.ceil(item.ezglist.length % state.pageSize); //计算末页空缺位
      for (var i = 0; i <= temNum - 1; i++) { // 整页不处理, 末页空缺位补齐
        item.ezglist.push('');
      }
    }
    // 刚刚好: 不处理
  })
  commit('SET_REPORT_TABLE_ALL_DATA', data) // 稳定化数据, 存入reportTableAllData
}
```

遍历数据, 判定每页的数据数组中记录数是否足够填满页面, 如果不足以填满则向空缺位填充空字符串. 足以填满则允许分页, 但是末页如果无法占满依旧选择补齐.
这步完成后数据基本是这样:
假设我每页限制4条, 不假设太长了, 写不开...
```json
"data": [
  {
    "ezglist": [
      {
        "xxx": "xxx",
        "xxx": "xxx",
        "xxx": "xxx",
        "xxx": "xxx"
      },
      '',
      '',
      ''
    ]
  },
  {
    "ezglist": [
      {
        "xxx": "xxx",
        "xxx": "xxx",
        "xxx": "xxx",
        "xxx": "xxx"
      },
      {
        "xxx": "xxx",
        "xxx": "xxx",
        "xxx": "xxx",
        "xxx": "xxx"
      },
      '',
      ''
    ]
  },
  ...
]
```
这种结构已经可以交付分页组件使用, 但是现在还没有`dataTotal`...

---

4. 对稳定化数据提取并集中得到新的dataTotal
我们得把稳定化数据内的所有对象都拿出来组成一个数组, 才能计算出`dataTotal`, 不过也不用担心分页错乱的问题, 你想想是不是...
各页的数据中间还是有空字符串占位的, 到时候`pageSize`切割完还是整页整页的数据, 不过一定要在数据稳定化之后再进行这步.
```javascript
// 提取稳定化数据内所有记录生成数组
await dispatch('getDataTotal', state.reportTableAllData); 
```

```javascript
getDataTotal({ commit }, data) {
  const temArr = [];
  for (var i = 0; i <= data.length; i++) {
    if (data[i]) {
      for (var j = 0; j <= data[i].ezglist.length - 1; j++) {
        temArr.push(data[i].ezglist[j]);
      }
    }
  }
  commit('SET_DATA_TOTAL', temArr.length); // 集中的稳定化数据, 存入dataTotal
},
```
现在的数据基本是这样, 我如果还是4条一页的话:

```javascript
[
  {
    "xxx": "xxx",
    "xxx": "xxx",
    "xxx": "xxx",
    "xxx": "xxx"
  },
  '',
  '',
  '',
  // pageSize切割处
  {
    "xxx": "xxx",
    "xxx": "xxx",
    "xxx": "xxx",
    "xxx": "xxx"
  },
  {
    "xxx": "xxx",
    "xxx": "xxx",
    "xxx": "xxx",
    "xxx": "xxx"
  },
  '',
  ''
]
```
达到这个占位目的就行, 函数不用非要按我的来.

---

6. 设置第一页数据
我会在`initTableData`把首次进入页面, 即第一页的事情, 还有以后都不用动的东西准备好, 切换页面的时候我只是调用一下`updateTableData`传入当前页码来切换一下当前呈现的数据就可以了.
```javascript
commit('SET_REPORT_TABLE_DATA', state.reportTableAllData[0].ezglist); // 初始化第一页数据
```

```javascript
updateTableData({ commit, state }, pageIndex) {
  commit('SET_TABLE_LOADING', true); // 开启表格加载
  const temArr = state.reportTableAllData[pageIndex - 1].ezglist;
  commit('SET_REPORT_TABLE_DATA', temArr); // 更新当前页数据
  commit('SET_PAGE_INDEX', pageIndex); // 更新当前页码
  commit("SET_TABLE_LOADING", false); // 关闭表格加载
}
```

---

7.更新表格数据
`dataTotal`在第四步生成, 现在可以从`Vuex`拿到
`page`在本页面`data`里
`pageSize`写死在`Vuex`里
```html
<page-card>
  <template v-slot:pagination>
    <Pagination
      v-if="dataTotal > 0"
      :total="dataTotal"
      :page="pageNumber"
      :limit="pageSize"
      @pagination="changePage"
    />
  </template>
</page-card>
```

```javascript
updateTableData({ commit, state }, pageIndex) {
  commit('SET_TABLE_LOADING', true); // 开启表格加载
  const temArr = state.reportTableAllData[pageIndex - 1].ezglist;
  commit('SET_REPORT_TABLE_DATA', temArr); // 更新当前页数据
  commit('SET_PAGE_INDEX', pageIndex); // 更新当前页码
  commit("SET_TABLE_LOADING", false); // 关闭表格加载
}
```

---

## 2.渲染判定
我觉得你肯定不能让`el-table`去给你呈现你那些空字符串吧, 在`el-table-column`上加个`v-if`, 当前`item`如果不是个对象就不渲染:
```html
<el-table
  :data="reportTableAllData"
>
  <template v-for="(item, index) in reportTableEvent">
    <el-table-column
      :prop="item.prop"
      label="item.label"
      v-if="item !== ''"
    >
    </el-table-column>
    <template v-else></template>
  </template>
<el-table>
```
记得包裹和空渲染都用`template`, 这不会打乱`el-table`的内部表结构, 它本质上还是基于`table`封装的.

---

# 总结
我的`pageSize`比较小, 9 , 如果这页不足九条, 后面的数据也不会压上来, 想完全一页数据用一页就`pageSize`大点, 反正不会干扰后面的数据.
多于9条会分页, 末页如果不能填满整个页面, 后面的数据也不会压上来, 改的是数据结构和选择性渲染, 这样的方法比较稳定.