
@[TOC](文章目录)

---

# 前言
写博客的时候第一次用这个组件, ElementPlus的TypeScript范例让我吃了点苦头, 数据绑定那块搞了好一会才弄明白.
不过好在最后还是做出来了, 记录一下基本用法.

---

# 一、前置工作-引入
main.js:

```javascript
import { ElTree } from 'Element-Plus';
import '../node_modules/element-plus/theme-chalk/index.css';
//样式根据自己那边具体文件位置来;
import App from './App.vue'

const app = createApp(App);

app.use(ElTree)

app.mount('#app');
```
---
---

# 二、步骤
Tree.vue:
data属性用来接收数据(但是只接受特定格式的数据, 参考下方代码), 只需要把我们准备好的数据v-bind绑定到:data上即可:

```html
<el-tree :data="tree"/>
```
---

props属性绑定的是对data中传入的数据的解析方式, 主要是解决"把什么解析成父标签, 把什么解析成子标签."的问题.
```html
<el-tree :props="defaultProps"/>
```

```javascript
const defaultProps = {  
  children: "children",  //"children"内的每个对象解析为一个子项;
  label: "label",  //所有"label"所在的对象解析为一个父项
  };
```

---

## 1.呈现
这是还没加点击事件的Tree，点击反馈在最后说到。

```html
<div class="user_tree">
  <el-tree
    :data="tree"
    :props="defaultProps"
    default-expand-all="true"
  />
</div>
```
```javascript
setup() {
  const tree = [
    {
      label: "首页",
      url: "/",
    },
    {
      label: "管理",  //label对应父级标签
      children: [   //父标签的children数组内每个对象生成该父标签的一个子标签
      
        {
          label: "内容管理",
          url: "/admin/allArticle",  
          //这里可以放你需要的各种数据,但因为在defaultProp里规定了label是父项;
          //所以必须有label,那我们写一个url属性做页面跳转吧.
        },
        {
          label: "评论管理",
          url: "/admin/allComment",
        },
        
      ],
    },
  ];
const defaultProps = {  //规定
  children: "children",
  label: "label",
  };
}
```
效果:
![在这里插入图片描述](../../../../img/前端/2022年/4月/Vue3%20Element-Plus%20Tree组件的使用/1.jpeg)

---

## 2.增加点击回调

Tree呈现出之后, 是自带展开折叠功能的, 首先要解决的问题, 是点击后要回调, 执行反馈.
监听Tree发送的node-click事件, 这个事件会在用户点击Tree上任意一项时触发, 而且, 不需要用this或者遍历之类的操作就能拿取有关受点击项的数据

```html
<el-tree
  @node-click="handleNodeClick"
/>
```

```javascript
//这里的"data"形参传受点击项的全部数据;
const handleNodeClick = (data) => {
   router.push(data.url);  //本例中我们拿取url属性做跳转;
};
```
以上两段代码可以直接套用进例子;

---

# 总结
这是一个最基础的Tree，你可以根据官方的属性，进一步增加功能。
如果这篇文章帮到你， 我很荣幸）