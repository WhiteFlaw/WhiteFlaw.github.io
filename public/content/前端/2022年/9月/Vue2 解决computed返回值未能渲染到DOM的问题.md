@[TOC](文章目录)

---

# 前言
Vue2 `computed`返回值未能成功渲染到DOM的解决方案.
`computed`返回值之前DOM已渲染完成导致的`computed`值未能成功渲染.

---


# 一、情况
报表页面的表格必须保持恒久有数据, 在打印状态下展示所有待打印数据, 在普通情况下展示当页数据, 这样我将一个`computed`函数绑定到`el-table`的`data`的`v-for`, 这样在打印判定为`true`时就返回所有数据, 反之仅展示当页数据, 这样表格是没什么问题的.
但是表格标题栏左侧用以展示时间、发起人、审批的小表格, 虽然使用相同的`computed`, 却不能成功拿到值.

主表格删减后基本是这样, 没什么问题, 主要注意一下`v-for`.

```html
<tbody
  v-loading="tableLoading"
  v-for="(item, index) in tableDataList"
  :key="index"
>
  <tr class="report-table-body-row" v-if="item !== ''">
    <td class="text-align-center" rowspan="2" colspan="1"> <!-- 序号 -->
      {{ item.evidSer }}
    </td>
    <td class="text-align-center" rowspan="1" colspan="1"> <!-- 借贷 -->
      {{ item.drCrId }}
    </td>
  </tr>
</tbody>
```

标题栏, 拿不到数据的部分.
```html
<page-card search>
  <report-header-row>
    <template v-slot:report-header-row-left>
      <table class="headLeftTable">
        <thead>
          <tr>
            <th>{{ $t("EBE_KJJE") }}</th>
            <th>{{ `0101 ${checkNull(tableDataList[0].acctName)}` }}</th>
            <!-- 表格能够正常拿到computed数据,但是这里不行 -->
          </tr>
          <tr>
            <th>{{ $t("EBE_SOBN") }}</th>
          </tr>
        </thead>
      </table>
    </template>
  </report-header-row>
</page-card>
```
这两部分同在一个文档中.

计算属性: `tableDataList`
```javascript
computed() {
  tableDataList: {
    this.printFlag ? this.printData : this.reportTableData;
  }
}

```

# 二、解决办法
主表绑定`v-for`后其`key`(`v-for`利用`key`来判定遍历生成元素是否需要重渲染)为其提供了进行重新渲染的能力, 在首轮渲染结束后未能渲染上的迟到新数据被`v-for`重新渲染到主表, 即主表正常.

但是标题旁边这个表不能遍历生成, 而且也需要这样的响应式, 我选用了`v-if`,  `v-if`绑定的值为`false`时候会预先创建一个注释节点在该位置, 在绑定值发生变化时触发派发更新，对新(nextTree)旧(prevTree)组件树进行更新渲染.
所以可以试一下`v-if`, Vue2的`<template></template>`是一个不渲染的标签, 可以利用一下...
```html
<page-card search>
  <report-header-row>
    <template v-slot:report-header-row-left>
      <table class="headLeftTable" v-if="tableDataList.length">
        <!-- 加 v-if, 如果tableDataList有变动会重新判定渲染 -->
        <thead>
          <tr>
            <th>{{ $t("EBE_KJJE") }}</th>
            <th>{{ `0101 ${checkNull(tableDataList[0].acctName)}` }}</th>
          </tr>
          <tr>
            <th>{{ $t("EBE_SOBN") }}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
	        xxx表体略xxx
	      </tr>
        </tbody>
      </table>
      <template v-else></template> <!-- v-else -->
    </template>
  </report-header-row>
</page-card>
```

---

# 总结
希望对你有帮助...