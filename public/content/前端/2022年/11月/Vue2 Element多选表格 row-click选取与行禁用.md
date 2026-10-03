---
title: Vue2 Element多选表格 row-click选取与行禁用
date: 2022-11-08
cover: /img/d5.webp
desc: Vue2 Element多选表格 row-click选取与行禁用
tags: [Vue, 前端]
sticky: false
---

@[TOC](文章目录)

---

# 前言
点击行, 和点击选取框都不再能进行选取.

---


# 一、用row-click事件实现选取行
`type=selection`提供的选取框实在是太小了, 为了选取方便使用如下方法来做行选取:

```javascript
rowClick(row) { // row-click事件处理函数
  this.$refs.tableRef.toggleRowSelection(row)
},
handleSelectChange(selection) { // selection-change事件处理函数
  this.multipleSelection = selection // 可有可无, 将存有所有选取项的数组存入data
},
```

---

# 二、禁选行
我说的是点击行和点击选取框都不再能进行选取.

有做行禁选取的需求, 今天看到有使用`selectable`完成的, 但是只能禁用勾选框选取, 并不能阻止基于`row-click`事件进行的选取.

需求是当行数据对象`row`中`cTotAmt`和`dTotAmt`不等时该行禁选, 那么在`row-click`事件处理函数起始进行对两值的判定, 不符合条件则直接`return false`, 配合`selectable`使用达到彻底禁选的目的.

```html
<el-table-column
  width="40"
  type="selection"
  :selectable="selectHandle"
> <!-- selectable, 如果是勾选框列有禁用需求就要加在勾选框列. -->
</el-table-column> 
```

```javascript
selectHandle(row) { // 也可以获取到index列下标 
// 这个函数会在生成列时自动对所有行数据对象执行, 如果当前row进入该函数执行结果为false那么该单元格selectable=false.
  if (row.crTotAmt !== row.drTotAmt) {
    return false
  }
  return true // 满足条件一定记得返true, 不然全都会禁选
},

rowClick(row) { // row-click事件处理函数
  if (row.crTotAmt !== row.drTotAmt) { // 禁选借贷不平衡
    return false
  }
  this.$refs.tableEBEC400U.toggleRowSelection(row)
  const temObj = {
    evidNo: row.evidNo,
    drTotAmt: this.numberToCurrencyNo(row.drTotAmt)
  }
  this.resDisplayRawParams = temObj
}
```

---

# 总结
-