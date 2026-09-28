---
title: Invalid prop type check failed for prop ““. Expected Number or String, got Array
date: 2021-10-23
cover: /img/d1.webp
desc: Invalid prop type check failed for prop ““. Expected Number or String, got Array
tags: [CSS, 前端]
sticky: false
---

# 项目场景：
二次封装ElAvatar, 父组件向子组件传值:
```html
<div class="author_avatar">
  <el-avatar :size="[author_avatar_size]"/>
</div>
```

```javascript
props:{
author_avatar_size: {
      type: [String, Number],
      default: "large",
    }
},
computed:{
  author_avatar_size() {
    return this.author_avatar_size;
  },
}
```

---

# 问题描述
警告, 并且父组件传入的数值无效
```
Invalid prop: type check failed for prop "size". 
Expected Number | String, got Array
at <ElAvatar size= ['large']>
//这里可以看到size被赋值了数组;
```
---

# 原因分析：
猜想是不是哪里多加了中括号导致判定成了数组.

那就只有这里了.
```html
<el-avatar :size="[author_avatar_size]"/>
```

---

# 解决方案：
只调用一个计算属性的时候不要加中括号,会被判定为传入了数组类型;
改为:

```html
<el-avatar :size="author_avatar_size"/>
```
即可.

