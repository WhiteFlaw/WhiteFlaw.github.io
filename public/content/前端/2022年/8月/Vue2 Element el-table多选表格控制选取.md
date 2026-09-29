---
title: Vue2 Element el-table多选表格控制选取
date: 2022-08-29
cover: /img/d1.webp
desc: Vue2 Element el-table多选表格控制选取
tags: [CSS, 前端]
sticky: false
---

@[TOC](文章目录)

---

# 前言
构建多选表格, 实现对监听选取状况, 获取当前选中项行数据, 获取当前所有选中项.

---

# 一、构建多选表格
构建DOM结构, 在表格`el-table`内加一个特殊列即可, 将列类型`type`属性设置为`selection`.

```html
<el-table-column type="selection">
</el-table-column>
```

注意如果使用`v-for`指令生成表格, 不要将上面这段代码直接加在`v-for`里, 不然每行旁边都有一个选项列, 肯定是要分开的, 但是怎么分开的同时不拆表呢.
刚开始我尝试过这种方案, 使用一个`div`将需要遍历生成的列包裹, 在`div`上`v-for`遍历, 但`el-table`仍然是基于HTML表格的封装, 这就像往原生HTML表格的列外面套了`div`, 会直接破坏表格结构.
我差点就忘了这是Vue2...直接把`div`换成`<template></template>`就好.

```html
<el-table-column type="selection" width="55">
</el-table-column>
  <template v-for="(item, index) in billTableEvent">
    <el-table-column
      :prop="item.props"
      :label="item.label"
      :align="item.align"
      :min-width="item.minwidth"
      v-if="item.props === 'payAmt'"
      :key="index"
    >
      <template slot-scope="scope">
        {{ scope.row.payAmt }}
      </template>
    </el-table-column>
    <el-table-column
      :prop="item.props"
      :label="item.label"
      :align="item.align"
      :min-width="item.minWidth"
      :key="index"
      v-else
    >
  </el-table-column>
</template>
```




---

# 二、多选表的事件、方法
刚开始的时候, 我觉得要是将`el-table`提供的方法作为事件处理函数, 那我岂不是可以同时操作一堆表格参数, 会更简单些? 
然后根本拿不到值...
如果将`el-table`的方法直接作为事件处理函数, 那么该事件处理函数会被直接判定为一个普通的事件处理函数, 并不能发挥到其应有的作用, 应当通过事件拿到`el-table`相关参数, 然后在合适的地方调用`el-table`提供的方法来协助达成目的.
获取参数例:
![在这里插入图片描述](../../../../img/前端/2022年/8月/Vue2%20Element%20el-table多选表格控制选取/1.png)
![在这里插入图片描述](../../../../img/前端/2022年/8月/Vue2%20Element%20el-table多选表格控制选取/2.png)

```javascript
methods: {
  handleSelectChange(selection) {
    this.multipleSelection = selection;
    console.log(selection); // [{...}, {...}]
  },
  handleSelectAll(selection) {
    console.log(this.multipleSelection);
    console.log(selection); // [{...}, {...}]
  },
},
```

`el-table`的事件处理函数内除了可以使用事件本身携带的参数, 还可以使用`el-table`的方法, 事实上这些`el-table`提供的方法可以在各种能调用函数的地方被调用, 并且它们各自接收固定的值作为参数, 举例官方的例子, 在表格外调用`toggleSelection`:
![在这里插入图片描述](../../../../img/前端/2022年/8月/Vue2%20Element%20el-table多选表格控制选取/3.png)

但由于使用这些方法需要接收固定的参数, 在`el-table`的事件处理函数里调用它们可能会更方便一些.

```html
<div id="empty">
  <el-table
    ref="tableEBBA020M"
    :data="billData"
    @row-click="rowClick"
    @selection-change="handleSelectChange"
  >
    <el-table-column
      v-for="(item, index) in billTableEvent"
      :prop="item.props"
      :label="item.label"
      :align="item.align"
      :min-width="item.minwidth"
      v-if="item.props === 'payAmt'"
      :key="index"
    >
      <template slot-scope="scope">
        {{ scope.row.payAmt }}
      </template>
    </el-table-column>
  </el-table>
</div>
```
然后自己起一个事件处理函数名(额...至少要和事件相关), 在这个事件处理函数里面调用`el-table`的方法.
```javascript
methods: {
  rowClick(row) { // 单选
    this.$refs.tableEBBA020M.toggleRowSelection(row);
  },
}
```
不需要去考虑太复杂的事情, 比如设立一个变量每次选中就+1偶数时选中奇数取消什么的(已经开始难受了),  这些细化的事情Element已经帮忙做好了, 完成后会直接把结果给你, 也就是事件所携带的各种参数.

利用上面的方法拿到`el-table`的`selection`和`row`, 配合一些数组方法就已经可以完成大多数的多选表格控制.

---

# 总结
