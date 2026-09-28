---
title: Vue3 v-for生成DOM
date: 2020-11-27
cover: /img/d1.webp
desc: Vue3 v-for生成DOM
tags: [CSS, 前端]
sticky: false
---

# 前言
v-for的用法, 代码可跑.
<hr style=" border:solid; width:100px; height:1px;" color=#000000 size=1">


@[TOC](文章目录)

<hr style=" border:solid; width:100px; height:1px;" color=#000000 size=1">

# 甚麽是v-for指令
v-for指令使得页面可以依据data中数据的量完成页面元素的自动生成，节省工作量。
同时也会把数据绑定到DOM元素.

<hr style=" border:solid; width:100px; height:1px;" color=#000000 size=1">

# 一、v-for生成元素
## 利用v-for根据数组数据生成元素
数组里有几个数组元素就会生成几个DOM元素, v-for的同时也会把这些数据绑定到DOM元素上,
可以在DOM里使用它们(比如下面用插值表达式直接渲染出来.)
```html
<li v-for="item in arr">item:{{item}}</li>
```

vue3的数据写在setup里;
```javascript
export default {
  setup() {
    const arr = [
           {name:"baiX", age:102},
           {name:"baiY", age:103},
           {name:"baiZ", age:104},  
    ]
  }
}
```
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/bdb33245bc87e002e53ada3d12507791.jpeg)

效果如上, 三个< li>,里面分别写着 "{name:"baiX", age:102}, {name:"baiX", age:102}, {name:"baiY", age:103}, {name:"baiZ", age:104}"

---

## 利用v-for从对象中获取数据
就跟从数组里遍历是一样的:
```html
<!-- index遍历出来不用会被标红,所以遍历了index之后可以将key绑定到index -->
<li v-for="(item, index) in data.awsl" :key="index">
  item:{{ item }}和attr:{{ attr }}
</li>
```
```javascript
import { reactive, ref, onMounted } from "vue";
export default {
  setup() {
    let data = reactive({
      awsl: { name: "baiX", age: 18, sex: "female" },
    });
    return {
      data,
    };
  },
};
```
<hr style=" border:solid; width:100px; height:1px;" color=#000000 size=1">

# 总结
以上是我记下的关于v-for的一些知识点，感觉都是一些比较基础的知识。
您要是觉得还不错，就顺手给点个赞吧 : ·）
