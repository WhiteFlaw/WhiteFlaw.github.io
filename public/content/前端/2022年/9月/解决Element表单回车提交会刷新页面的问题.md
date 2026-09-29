---
title: 解决Element表单回车提交会刷新页面的问题
date: 2022-09-22
cover: /img/d1.webp
desc: 解决Element表单回车提交会刷新页面的问题
tags: [CSS, 前端]
sticky: false
---

# 问题描述
`Element`表单, 提交按钮添加回车按键提交事件.
偶尔出现回车提交直接刷新页面的情况.

---

# 原因分析：
`Element`表单本身存在的一个Bug, 原生`form`表单的默认事件就是回车提交, 现在原生`form`表单不怎么用了.
原生`form`中回车弹起就会发生页面跳转来提交表单内容, 这也是这个Bug发生的原因, 这个默认事件没有去干净.

---

# 解决方案：
在`Element`表单的`<el-form>`上添加阻止原生表单默认回车提交的事件:

```html
<el-form
  @submit.native.prevent
>
</el-form>
```


