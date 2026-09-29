---
title: CSS解决line-height=height时纵向不居中问题
date: 2022-05-01
cover: /img/d1.webp
desc: CSS解决line-height=height时纵向不居中问题
tags: [CSS, 前端]
sticky: false
---

 

---

# 前言
在封装组件时发现的一个问题, line-height=height无法居中(虽然不是第一次遇到但是每次都让人眼前一黑).
![在这里插入图片描述](../../../../img/前端/2022年/5月/CSS解决line-height=height时纵向不居中问题/1.jpeg)

名字下面一行怎么都居中不了, 试了一下是line-height直接失效了, 给什么值也没用.

# 一、解决办法
先检查一下有没有重置页面的默认margin和padding.
先检查一下line-height是不是放到font前面, 遭到font覆盖了.
检查一下有没有在更下方的代码设置过这个元素的line-height或height.
如果都没有的话, 可以试试以下几种方法:

---

## 1.padding
可以直接给父元素一个纵向padding, 把文字压下去.

---

## 2.vertical-align
规定行内元素在纵向的对齐方式, 前提要是行内元素(或者display:inline-block转换一下).

---
## 3.文字外面再套一层
在文字外再嵌套一层元素, 然后直接调节嵌套在外的元素.

---
