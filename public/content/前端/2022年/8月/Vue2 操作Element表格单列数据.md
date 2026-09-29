@[TOC](文章目录)

---

# 前言
今天下午做完了任务, 准备实现打印, 叫了一位前辈过来看看怎么用打印函数, 他说"哎你这数据怎么没做千分制呢, 参考上这得转千分制的."
我一看还真是, 没注意到, 后端给我的是单纯的数字, 但是这个如果要打印的话传值应该也会用到非千分制的数字型, 所以大概...不应该直接处理后端给我的数据, 最好仅仅渲染成千分制展示, 嗯, 那么最好该是在HTML里操作, 用插值表达式或许可以.

---


# 一、尝试思路
说的简单, 我们俩前端加一个看热闹的后端老哥搞了快二十分钟都没拿出来一个让我们自己满意的方案. 不过我们雀食一直在改善, 先是拿到了表数据, 然后想办法锁定到了列.

二十多分钟后插值表达式方向进入了瓶颈, 我们用`scope.row`拿到数据后不知道如何在使用`v-for`生成的`Table`中拿到"列", 这时候后端提出在`template`中利用`v-for`用数组取值形式(好像是是`scope.row[item.prop]`来着?)拿到`scope.row`对象中的待检项, 但是这样其他项的数据又该如何展示.
这个问题引导我想起`v-if`, 我一开始先是用了两个`<template slot-scope="scope"></template>`分别加上`v-if`和`v-else`, 用遍历的`item.prop`属性值是否等于待验的`item.prop`来筛选需要的列, 但是这样不检验项仍旧无法显示, 这个插槽这样一来只被渲染成了每行的待检项, 普通项不渲染.
但是`v-if`雀食给了我开了一扇大门, 我觉得这个方向或许能走通.

---

# 二、实现思路
我提出能不能在`el-table-column`外面套一个空`div`仅作遍历容器使用, 然后将两个`el-table-column`放在`div`内部, 在前面的`el-table-column`上利用`v-if`校验是否为千分制列, 另一个`el-table-column`加`v-else`用来展示常规内容, 这样不会重复遍历, 每次遍历也都是遍历一个`el-table-column`, 我觉得可行.
每轮`v-for`的`el-table-column`在生成前都经过v-if校验, 决定生成两种中的哪种`el-table-column`, 是需要校验的还是不需要的, 并且为需要校验的`el-table-column`内部插入`<template slot-scope="scope">{{numberTocurrencyNo(scope.row.money)</template>`
emmm...
我肯定是要改一改再拿出来的:

```html
<!-- 虽然改了但是能跑 -->
<el-table :data="billData">
  <div v-for="(item, index) in billEvent" :key="index">
  
    <el-table-column
      :prop="item.props"
      :label="千分制项"
      v-if="item.props === '千分制项'"
    >
      <template slot-scope="scope">
        {{一个返回千分制数的函数(scope.row.千分制项)
      </template>
    </el-table-column>
    
    <el-table-column
      :prop="item.props"
      :label="普通项"
      v-else
    >
    </el-table-column>
    
  </div>
</el-table>
```

```javascript
billData: [
  {
    props: "普通项1",
    labels: "普通项1",
    minWidth: 50.
  },
  {
    props: "普通项2",
    labels: "普通项2",
    minWidth: 60,
  },
  {
    props: "千分制项",
    labels: "千分制项",
    minWidth: 80,
  },
  {
    props: "普通项4",
    labels: "普通项4",
    minWidth: 40
  }
]
```

---

# 总结
很好...就保持这样的状态, 哈哈.
希望这篇文章对你有帮助?