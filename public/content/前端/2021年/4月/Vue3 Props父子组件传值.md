---
title: Vue3 Props父子组件传值
date: 2021-04-25
cover: /img/d1.webp
desc: Vue3 Props父子组件传值
tags: [CSS, 前端]
sticky: false
---

@[TOC](文章目录)

---

# 前言
多用于封装组件时，我们界定好一些不变的属性，再暴露一些支持自定义的属性，这些支持自定义的属性就要通过Props传值，比如支持自定义尺寸就如下例。

---

# 一、子组件的准备
我们要先准备好接收数据的那一套东西，这里就用我封装的一个头像组件来举例吧：
本处:style="[xxx, xxx]"这种格式为vue2.6新增，数组内部的元素为computed内的方法名，这样写相当于调用这些方法，而这些方法内返回根据props内相应值计算的产物来规定动态的style属性值。

子组件:
```html
<!--我去掉了一些没用的属性,另外我决定把size值渲染出来,这样会直观一些 -->
 <div class="sy-avatar" :style="[size]">{{data.size}}</div>
```
```javascript
import { reactive } from 'vue';
export default {
  props: {
    size: {  //接收父组件传过来的size属性值
      type: [String, Number],  //仅接受String或Number类型的值
      default: "middle",  //如果没传来值, 默认以middle为值
    },
  },
  computed:{
    size() {
      return `height:${this.size}px;width:${this.size}px;`;  //this.size即props接收的size值
      }
    },
    setup(props) {  
      let data = reactive({
        size: props.size
      });
      return {
        data,
      };
    }
  }
}
```
这样一来computed中计算出的size值将被填入style属性中,并且size数值会被渲染出来.
哎,computed那个要是不太直观就看data吧, 我们直接把props传入setup,然后props.size赋值到data.size, 在插值表达式里渲染data.size出来.

---

# 二、父组件传值
父组件这边怎么传， 传什么，依赖于你子组件Props里面开放接收了什么。

父组件:
```html
<template>
  <sy-avatar :size="40"></sy-avatar>
</template>
```
宽高40px,写着40的头像.
![在这里插入图片描述](../../../../img/前端/2021年/4月/Vue3%20Props父子组件传值/1.jpeg)
宽高80px,写着80的头像.
![在这里插入图片描述](../../../../img/前端/2021年/4月/Vue3%20Props父子组件传值/1.jpeg)

---

# 二、异步监听
Props和你的v-model和data都是可靠且勤奋的, 他们会在渲染时把最新的值拿出去渲染.
但是某些异步操作拿来值的时候props已经把值拿去渲染了(create, mounted这种钩子每个生命周期只执行一次), 这部分异步数据就没赶上末班车, 只显示一个默认值在页面上.
就怎么也渲染不上去了,这时候就要用watch监听props中的这一数据.

---

# 总结
快一年前写的东西了，有点过时了，2022-4-28重写了一下。
如果对你有帮助，我很高兴）