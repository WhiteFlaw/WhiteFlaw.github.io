---
title: Node Sass version 6.0.0 is incompatible with ^4.0.0
date: 2021-06-17
cover: /img/d1.webp
desc: Node Sass version 6.0.0 is incompatible with ^4.0.0
tags: [前端]
sticky: false
---

node-sass已经弃用了,现在它已经被dart-sass所替代,dart-sass的安装更加稳定,去试试它吧.
# 项目场景：
使用scss文件配置Vue页面控件的样式.
<hr style=" border:solid; width:100px; height:1px;" color=#000000 size=1">

# 问题描述：
安装node-sass后npm run serve提示:
`Node Sass version 6.0.0 is incompatible with ^4.0.0.`

<hr style=" border:solid; width:100px; height:1px;" color=#000000 size=1">

# 原因分析：
观察package.json中各插件版本,仅router为4.0.0版本,推测可能为sass与router不兼容.
<hr style=" border:solid; width:100px; height:1px;" color=#000000 size=1">

# 解决方案
尝试下载更低版本的node-sass,卸载原来的node-sass,使用了Ver 4.14.1的node-sass,问题解决;

```typescript
npm uni node-sass -D
```
```typescript
npm i node-sass@4.14.1 -D
```
