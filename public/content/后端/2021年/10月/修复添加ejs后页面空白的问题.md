---
title: 修复添加ejs后页面空白的问题
date: 2021-10-23
cover: /img/d1.webp
desc: 修复添加ejs后页面空白的问题
tags: [CSS, 前端]
sticky: false
---

# 项目场景：

```html
<ul>
    <%for(var i=0;i<list.length;i++){%>
        <li>
            <%=list[i].title%>
        </li>
     <%}%>
</ul>
```

<hr style=" border:solid; width:100px; height:1px;" color=#000000 size=1">

# 问题描述：
本段ejs代码添加后页面空白, 添加前能渲染出的ejs, 加了之后也无法渲染.

```javascript
<h3><%=msg%>
```
就这样,原本这段能渲染出的, 现在也无了.
<hr style=" border:solid; width:100px; height:1px;" color=#000000 size=1">

# 原因分析：
刚开始以为是编辑器把for循环的小于号解析成标签了, 折腾了半天也没弄好...

然后崩溃了, 直接去找了一份样例看, 刚开始也没在意, 一个utf-8没有裹引号, 如果是因为UTF8的问题, 会是所有ejs都跑不了吧, 大概...吧?
然而...就是这个UTF8的问题:

```javascript
//错误代码
res.writeHead(200, { 'Content-Type': 'text/html;charset=utf-8' });
res.end(data);
```

```javascript
//正确写法
res.writeHead(200, { 'Content-Type': 'text/html;charset="utf-8"' });
res.end(data);
```
加上就好了.
<hr style=" border:solid; width:100px; height:1px;" color=#000000 size=1">

# 解决方案：
加上引号.


