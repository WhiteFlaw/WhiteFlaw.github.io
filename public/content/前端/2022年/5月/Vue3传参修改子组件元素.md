---
title: Vue3传参修改子组件元素
date: 2022-05-02
cover: /img/d1.webp
desc: Vue3传参修改子组件元素
tags: [Vue, 前端]
sticky: false
---

@[TOC](文章目录)

---

# 前言
说简单点, 其实在计算属性里处理完, 再赋值到不同的变量分别return就好, 然后在绑定的时候直接绑定这些变量, 而不再是绑定方法.

就以二次封装ElementPlus的轮播图作为例子吧, 我会做的简单一些。

---

# 一、子组件接收参数
那我们就封装一个可以自定义总体宽高的轮播图，但内部的元素要跟着总体宽高自动改变, 以保证视觉上的协调。
先接收一下父组件传入的宽高.

```html
<!-- 多余的东西都去掉了 -->
<div>
  <el-carousel></el-carousel>
</div>
```

```javascript
props: {
  height: {
    type: Number,
    default: "",
  },
  width: {
    type: Number,
    default: "",
  },
},
```

---

# 二、分开return
然后现在我们接收到了两个参数，要用computed里的1个方法分别给两个元素赋予不同的宽高。

```javascript
computed: {
  size() {
  //这里this.width指的就是props接收到的width;
    let sy_carousel_width = `width: ${this.width}px`;
    let sy_carousel_height = `height: ${this.height}px`;
    
    let el_carousel_width = `width: ${this.width * 0.89}px`;
    let el_carousel_height = `${this.height * 0.89}px`;
    //这里因为el-carousel暴露了height, 所以不能通过css直接规定.
    
    return {
      sy_carousel_width,
      sy_carousel_height,
      el_carousel_width,
      el_carousel_height,
    };
  },
},
```

---

# 三、绑定到DOM元素
绑定返回值, 不再绑定computed里的方法.
这样用不同的返回值去分别改变各个元素就好.
```html
<div
  :style="[size.sy_carousel_height, size.sy_carousel_width]"
>
<el-carousel
  :style="size.el_carousel_width"
  :height="size.el_carousel_height"
>
</el-carousel>
</div>
```

---

# 总结
现在来看看其实都是些挺容易的事情, 但第一次遇到这个需求时
我是真的没往这块儿去想(捂脸)....