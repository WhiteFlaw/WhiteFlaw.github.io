@[TOC](文章目录)

---

# 前言
需求是`description`需要做成首行3列, 剩余行为4列, 额, 我说的是算上标签, 就像这样:

![在这里插入图片描述](../../../../img/前端/2022年/8月/Vue2%20Element%20description组件列合并/1.png)

你可能会说"啊, 你这个笨蛋为什么不去用`labelStyle`或者`contentStyle`来消减表格呢?"
我肯定是试过的啦...不行嘛.

---


# 一、首次尝试

## 1.style的失败尝试
我十分想用规规矩矩的方法去解决问题, 我选用了`labelStyle`和`contentStyle`, 并且认为"只要将右上角`el-descriptions-item`的`label`设置为没有宽度或者`display:none;`就好了, 然后另一个格子就会压过去."
这个想法多少是有点天真.
当我把`labelStyle`设置为`display:none`时整个`content`格子直接向左塌陷到了`label`的原位置并且它自身的宽度把整个一列的`label`全都撑的胀起来:

![在这里插入图片描述](../../../../img/前端/2022年/8月/Vue2%20Element%20description组件列合并/2.png)
不要用`width`..我试过了, 会有一些比较恐怖的效果.
不过我确实没有试过用`::v-deep`操作`element`内部属性然后设置样式来消减宽度.


---

## 2.DOM结构
组长过来看了一会说他以前做过这种description结构, 他大体说了一下, 老实说我没太听明白, 我只是感觉DOM上可以做一点文章, 要不试一下?

我的思路是将上下, 也就是第一行的"畸形行"和下面的正常行分离处理, 两者互不干扰, 那么需要两个`el-descriptions`来生成:
先用一个大`el-descriptions`作为容器, 其中的两个`el-descriptions-item`分别作为上下两个分区, 各传入一个`el-descriptions`分别生成, 这样上方的畸形行不会对下方解释表产生格式影响.
```html
<el-descriptions
  :column="2"
  border
  labelstyle="text-align: center; width: 120px;"
  contentStyle="text-align:center;"
>
  <el-descriptions-item labelClassName="labelClass">
    <el-descriptions
      :column="3"
      border
      labelstyle="text-align: center; width: 120px;"
      contentStyle="text-align:center;"
    >
      <el-descriptions-item contentStyle="display:none;">
        <template slot="label">
          label1
        </template>
      </el-descriptions-item>
      <el-descriptions-item labelStyle="display:none;">
        <el-input
          readonly
          :value="item.value"
          style="width: 100%; text-align: center"
        />
      </el-descriptions-item>
      <el-descriptions-item labelStyle="display:none;">
        <el-input
          readonly
          :value="item.value"
          style="width: 100%; text-align: center"
        />
      </el-descriptions-item>
    </el-descriptions>
  </el-descriptions-item>

  <el-descriptions-item>
    <el-descriptions>
      <el-descriptions-item
        v-for="(item, index) in tableHead"
        :key="index"
        labelclassName="labelClass"
      >
        <template slot="label">
          {{ "label" + index }}
        </template>
        <el-input
          readonly
          :value="item.value"
          style="width: 100%; text-align: center"
        />
      </el-descriptions-item>
    </el-descriptions>
  </el-descriptions-item>
</el-descriptions>
```
表格局部空缺的问题解决了, 然而仍旧不能完全令人满意, 虽然可以通过宽度调节达到效果, 但是label难以居中, 并且, 没有了`el-description`本身的table规格, 这个表格的对齐方式并不稳定, 最上层很容易和下层错位:

![在这里插入图片描述](../../../../img/前端/2022年/8月/Vue2%20Element%20description组件列合并/3.png)


---

# 二、解决方案
完美实现, 对齐, 无错位, 不干扰.
依赖span实现, `labelClassName`只是颜色.
总体思路还是单独处理`el-description-item`, 但使用了官方提供的属性, 也是更加规范的方法.
`column`属性规定的是一行几个`item`, 注意一个完整的`item`在不加style的情况下是由`label`和`content`组成的一对横向格子.
`span`规定描述列表的列数, 一列是由一个完整的`item`起头, 注意一个完整的`item`在不加style的情况下是由`label`和`content`组成的一对横向格子.
![在这里插入图片描述](../../../../img/前端/2022年/8月/Vue2%20Element%20description组件列合并/4.png)


```html
<el-descriptions
  :column="2"
  border
  labelstyle="text-align: center; width: 120px;"
  contentStyle="text-align:center;"
>

  <el-descriptions-item 
    :span="2"   
    labelClassName="labelClass"
  >
    <template slot="label">
      label 
    </template>
    <el-input 
      readonly 
      :value="tableData.is"
    />
    <el-input 
      readonly 
      :value="tableData.vn"
    />
  </el-descriptions-item>
  
  <el-descriptions-item
    v-for="(item, index) in tableHead"
    :key="index"
    labelclassName="labelClass"
  >
    <template slot="label">
      label
    </template>
    <el-input
      readonly
      :value="tableData[item.value]"
      style="width: 100%; text-align: center"
    />
  </el-descriptions-item>
  
</el-descriptions>
```

---

# 总结
今天代码审查没过, 手里俩任务没交成, 今天一天还是在完善这俩任务, 唉.
希望这篇文章能帮到你吧.