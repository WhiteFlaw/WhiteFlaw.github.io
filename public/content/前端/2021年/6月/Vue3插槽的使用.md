Vue3 插槽使用详解
@[TOC](目录)


<hr style=" border:solid; width:100px; height:1px;" color=#000000 size=1">

# 前言-认识slot
我们经常会有封装组件的需求, 组件需要的往往不只有数据, 有时候我们要给一个模块做内容方面的可自定义, 比如我封装了一个黑板, 但是我有时希望上面是字, 又有时希望上面是图画, 这就要用到插槽了.

感谢你浪费一分钟生命读完了这段废话.

<hr style=" border:solid; width:100px; height:1px;" color=#000000 size=1">

# 一、简单插槽
就是普通插槽, 也叫默认插槽.
只要你在子组件里写一个< slot></ slot>就可以从父组件向内部填充了.
虽然简单但是不写slot也是不能直接从父组件插内容的.
子组件:
```html
<template>
  <div class="sy-page">
    <slot></slot>
  </div>
</template>
```
父组件:

```html
<template>
  <sy-turning>BaiX</sy-turning>
</template>
```
![在这里插入图片描述](../../../../img/前端/2021年/6月/Vue3%20插槽的使用/1.jpeg)
缺点就是不能规定父组件填充内容所指向的插槽, 父组件内填充的所有内容, 会填充到每个子组件内的插槽中:
子组件:
```html
<template>
  <div class="sy-page">
    <slot></slot>
    <a href=""><slot></slot></a>
  </div>
</template>
```
父组件:
```html
<template>
  <sy-turning>BaiX</sy-turning>
</template>
```
![在这里插入图片描述](../../../../img/前端/2021年/6月/Vue3%20插槽的使用/2.jpeg)
要解决这个问题 就需要具名插槽了.

<hr style=" border:solid; width:100px; height:1px;" color=#000000 size=1">

# 二、具名插槽
特点是带有name属性:

```html
<slot name="xxx"></slot>
```

有时我们会需要在子组件某处写一堆的插槽,又需要在父组件各处分别使用这些插槽.
某些方面计算机是很笨的,它不会看得出哪个插槽该填什么东西,也不知道你在这里填的东西是要给哪个插槽, 你得告诉她该怎么做.

只要有使用多个插槽的需求, 那就用具名插槽吧.
先来看看子组件:

```html
<!--子组件 -->
  <div class="tab-bar-item">
    <slot name="item-icon"></slot>
    <slot name="item-text"></slot>
  <!-- 插槽slot最终会被父组件里传入的html元素替换,
  在插槽上写样式类的东西不会生效,可以用div来包裹slot,
  利用样式继承性来完成样式修改 -->
```
父组件
< template>来包裹要向插槽里填充的东西, 在template标签的v-slot属性后面写上对应插槽的name值.

v-slot:可以简写为"#"
```html
<!--父组件 -->
  <tab-bar-item>
  
    <template v-slot:item-icon>
      <div>插槽item-icon内容<img src="#" /></div>
    </template>
  
    <template #item-text>
      <div>插槽item-text内容</div>
    </template>
    
  </tab-bar-item>
```

这样所有在template包裹下的填充内容都会被填入对应的插槽,但如果没有被template包裹呢?
那样就相当于写了个这:
```html
  <template>
  <!--隐含的名字“default”(默认) -->
    <p>我会被填入子组件的每个插槽</p>
  </template>
```
Vue官方文档: 没有被包裹在带有 v-slot: 的 < template> 中的内容都会被视为默认插槽内容.

<hr style=" border:solid; width:100px; height:1px;" color=#000000 size=1">

## 具名插槽扩展-动态插槽名
从 2.6.0 开始，可以用方括号括起来的JS表达式作为一个指令(v-bind啥的)的参数,比如在此例中

```typescript
//随便定义一个方法randomName, 使用这个方法的返回值;
<a v-bind:[randomName]="user"> ... </a>
```
其实这个东西最常见的是在封装组件时, 我们用computed里的方法返回值来控制:class和:style:
```html
<button
  :class="[theme, isBorder]"
></button>
```

```javascript
computed: {
  theme() {
    return this.type ? `sy-button-${this.type}` : "";
  },
  isBorder() {
    return this.border ? "is-border" : "";
  },
}
```
在2.6版本新增的内容中, 这种用法(动态指令参数)也可以用在具名插槽上定义动态的插槽名, 这其实是具名插槽的扩展用法, 你可以先看看具名插槽.

```html
<base-layout>
  <template v-slot:[动态指令参数]>
    动态决定插入哪个插槽
  </template>
</base-layout>
```
<hr style=" border:solid; width:100px; height:1px;" color=#000000 size=1">

# 三、作用域插槽
父组件内需要访问子组件中的数据以正常工作, 可以作用域插槽.
作用域插槽的渲染是在子组件完成, 所以我们也需要子组件的数据.

在子组件的slot上利用v-bind / v-for之类绑定上父组件需要的各种数据, 渲染时就可以从子组件拿数据来渲染.

绑定在 < slot> 上的属性被Vue官方称为"slotProps"(这并不重要);
子组件:
```html
<span class="current-user">
  <slot :user="data.user"></slot>
</span>

<!-- 或者 -->
<span v-for="item in data.someThing" :key="item">
  <slot :num="item.num" :awsl="item.id"></slot>
</span>
```
在父组件内使用v-slot属性接收子组件数据;
父组件
```html
<current-user>
  <template v-slot="{ user, name }">
  <!--其实这里写的参数是什么真的无所谓, 比如我子组件传出item,
   父组件要接收item.id, 写v-slot="awsl.id"接收也可以-->
  </template>
</current-user>
<!--或者 -->
<current-user>
  <template v-slot="num"> <!-- 只传一个时不要加大括号. -->
  </template>
</current-user>
```

作用域插槽会被解析为一个传入了slotProps作参的函数:

```typescript
function (slotProps) {
  // 插槽内容
}
```
所以, 父组件中v-slot: 的值实际上可以是任何 [能作为函数的参数来传入] 的东西;

---

## 作用域插槽实例
我现在二次封装一个el-tabs, 实现传入数据数组自动生成:
子组件:
```html
<div class="sy_tabs">
  <el-tabs>
    <el-tab-pane
      v-for="item in sy_tab_data"
      :key="item"
      :label="item.label"
      :name="item.name"
    >
      <slot :item="item"></slot>  <!--然后我们直接在这里吧item传出去,传作"item"
    </el-tab-pane>
  </el-tabs>
</div>
```

```javascript
//我想了一下还是不要用props接收了, 我们直接把标签页数据写死吧...
export default {
  setup() {
    const sy_tab_data =  [
        { label: "推荐", name: "first", id: 0 },
        { label: "热门", name: "second", id: 1 },
        { label: "关注", name: "third", id: 2 },
      ],
  }
}
```
这样我们有三个标签页了:
![在这里插入图片描述](../../../../img/前端/2021年/6月/Vue3%20插槽的使用/3.jpeg)

父组件:
为了根据不同标签页显示不同的内容, 这里我们要拿到tab标签页的id, 来决定 "在id为几的标签页显示article_content的哪个子数组"
```html
<sy-tabs>
  <template v-slot="slotProps">
  <!--然后你可以看到, 我们在这里用slotProps来接收item,
    没有任何问题, 也能拿到里面的id属性(见下); -->
    <ul>
      <li
        v-for="i in data.article_content[slotProps.item.id]"
        :key="i"
       >
       <!--这样把article_content的序号和tab的序号对应起来, 
         实现第2页显示第2个数组, 第3页显示第3个数组 -->
      </li>
    </ul>
  </template>
</sy-tabs>
```

```javascript
let data = reactive({
  article_content: [
    [xxx, xxx], //详细数据略
    [xxx, xxx],
    [xxx, xxx],
  ]
})
```
就可以正常呈现了:
![在这里插入图片描述](../../../../img/前端/2021年/6月/Vue3%20插槽的使用/4.jpeg)
![在这里插入图片描述](../../../../img/前端/2021年/6月/Vue3%20插槽的使用/5.jpeg)

<hr style=" border:solid; width:100px; height:1px;" color=#000000 size=1">

# 总结
注意 v-slot 只能添加在 < template> 上, 不然会标红;

我为什么要把这些玩意儿写在插槽里, 这么麻烦为什么不直接写那些标签?
是,我一开始也在问我自己, 为什么不直接写标签而要写插槽.

（现在是22年4月22, 我刚做完我的个人网站, 回来说一句, 不封装实在是——太乱了代码很多，就算复制粘贴下来到别处还要改属性改参数改样式，主要是还要改样式，老天！做了三个页面我就开始封装了。）

以上是我据本阶段的学习得出的一些经验与心得，如果帮到了您，在下十分荣幸；若是您发现了不足，您可以在评论区指出, 我会感谢您的指点的!
