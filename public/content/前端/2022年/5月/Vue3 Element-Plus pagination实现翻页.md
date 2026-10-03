---
title: Vue3 Element-Plus pagination实现翻页
date: 2022-05-05
cover: /img/d1.webp
desc: Vue3 Element-Plus pagination实现翻页
tags: [Vue, 前端]
sticky: false
---

@[TOC](文章目录)

---

# 前言
在Vue3环境下快速呈现一个基本的pagination, 能实现换页.
但是没有换页动画.
![在这里插入图片描述](../../../../img/前端/2022年/5月/Vue3%20Element-Plus%20pagination实现翻页/1.gif)

---

# 二、步骤
## 引入:

```javascript
//main.js
import { createApp } from 'vue'
import App from './App.vue'
import { ElPagination } from 'element-plus'
import '../node_modules/element-plus/theme-chalk/index.css'  //样式根据具体的路径来
```

---
## 传参
先传":total"总页码数, 不然会发现页面上什么都没有(实际显示页数 = 传入的总页数 / 10);

再传current-page, 当前所在页(也是默认的起始页码), 比如默认第一页就传进去"1", 一定记得双向绑定, 后面翻页全靠它了(永远存储的是最新的页码).

然后给layout组件布局传如下值, 保证页码栏旁边没有"去到第几页"的输入框.

background给页码加一个背景框;

```html
<el-pagination 
  layout="prev, pager, next" 
  v-model:current-page="data.currentPage"
  :total="data.article_page * 10" 
  background 
/>
```

---
## DOM结构
那么首先要有一个div去显示 "页", 那待会要用 li 来做数据条, "页"就用 ul:

```html
<ul>
  <li v-for="item in data.article_content" :key="item">
    <p>{{item.article_title}}</p>
  </li>
</ul>
<el-pagination 
  layout="prev, pager, next"
  v-model:current-page="data.currentPage" 
  :total="data.article_page * 10" 
  background 
/>
```

```javascript
export default {
  setup() {
    let data = reactive({
      current_page: 1,  //从第1页开始的话是这样写;
      article_content: [], //内含5个对象的数组, 格式在下面介绍
      article_page: 4,   //用article_content.length, 根据数据量自动增页
    })
}
```

换页的实现思路是替换 li 上的数据, 这里 li上的数据由data.article_content遍历获得, 而data.article_content默认是空数组.

## 数据结构
提前把newArr是什么说明白...
这里我采用的方法是先把所有文章数据分成5条一份(因为我们每页是5条嘛)放到二维数组 "newArr" 里

```javascript
//newArr基本结构
[
  [ //有更多条需求, 直接增加这个数组里的对象数量, 比如分成8条一份
    { article_title: "xxx", article_content: "xxxx", article_id: "xx" },
    { article_title: "xxx", article_content: "xxxx", article_id: "xx" },
    { article_title: "xxx", article_content: "xxxx", article_id: "xx" },
    { article_title: "xxx", article_content: "xxxx", article_id: "xx" },
    { article_title: "xxx", article_content: "xxxx", article_id: "xx" },
  ],
  [ 
    { article_title: "xxx", article_content: "xxxx", article_id: "xx" },
    { article_title: "xxx", article_content: "xxxx", article_id: "xx" },
    { article_title: "xxx", article_content: "xxxx", article_id: "xx" },
    { article_title: "xxx", article_content: "xxxx", article_id: "xx" },
    { article_title: "xxx", article_content: "xxxx", article_id: "xx" },
  ],
  ...
]
```
---
利用之前绑定好的current-page属性, 每次点击时, 首先根据当前页码数和点击的页码计算下一页的页码.

## 实现换页
根据新的页码判断将newArr的哪个子数组赋值给article_content.

如下, 利用pagination暴露的三个方法实现该步骤:

```html
<ul>
  <li v-for="item in data.article_content" :key="item">
    <p>{{item.article_title}}</p>
  </li>
</ul>
<el-pagination
  background
  layout="prev, pager, next"
  :total="user_article_content_page * 10"
  current-page="data.currentPage"
  @current-change="currentChange"
  @prev-click="prevClick"
  @next-click="nextClick"
/>
```

```javascript
export default {
  setup() {
    let data = reactive({
      current_page: 1,  //从第1页开始的话是这样写;
      article_content: [], //内含5个对象的数组, 格式在下面介绍
      article_page: 4,   //用article_content.length, 根据数据量自动增页
    })
  const newArr = ref(props.newArr);  //二维数组newArr
  
  //直接点击页码进行换页, 切换呈现<新的页码-1>号子数组
  const currentChange = () => {
    data.user_article_content = newArr.value[data.currentPage - 1];
  };
  
  //点击左边一页, 切换呈现<新的页码-1>号子数组
  const prevClick = () => {
    data.currentPage - 1;
    data.user_article_content = newArr.value[data.currentPage];
  };
  
  //点击向右一页, 切换呈现<新的页码+1>号子数组
  const nextClick = () => {
    data.currentPage + 1;
    data.user_article_content = newArr.value[data.currentPage];
  };
  return {
    data,
    currentChange,
    prevClick,
    nextClick,
   }
}
```

## 解释
你可能发现了, 其实currentchange和prevclick的方法是相同的, 完全可以调用同一个方法, 就像这样:
```html
<el-pagination
  @current-change="currentChange"
  @prev-click="currentChange"
  @next-click="nextClick"
/>
```
```javascript
const currentChange = () => {
  data.user_article_content = newArr.value[data.currentPage - 1];
};
```
确实可以.
但不这样写是因为这个组件有时会出现一个BUG, 页面刚加载出时, 文章显示为空白, 要点击一下翻页才会正常显示.
我选择了在onUpdated周期再次调用currentchange来解决这个问题, 那么绝对不能在currentChange一触发就:

```javascript
data.currentPage - 1;
```

这样第一页的内容会被吞掉, 第一页将显示第二页的内容了.
至于prevClick为什么不写作

```javascript
const prevClick = () => {
    data.user_article_content = newArr.value[data.currentPage - 1];
};
```
因为下面的nextClick必须有`data.currentPage + 1这一步; 为了让这两个方法写在一起更好看所以...

---

# 总结
只是一个基础的分页.