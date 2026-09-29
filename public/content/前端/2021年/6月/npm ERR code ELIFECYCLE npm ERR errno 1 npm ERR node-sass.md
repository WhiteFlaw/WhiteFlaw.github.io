---
title: npm ERR code ELIFECYCLE npm ERR errno 1 npm ERR node-sass
date: 2021-06-17
cover: /img/d1.webp
desc: npm ERR code ELIFECYCLE npm ERR errno 1 npm ERR node-sass
tags: [Vue, 前端]
sticky: false
---

node-sass已经弃用了,现在它已经被dart-sass所替代,dart-sass的安装更加稳定,去试试它吧.
# 项目场景：
使用node-sass设置Vue页面控件的样式,需要安装node-sass.
在安装node-sass@4.14.1 时报错出现.
<hr style=" border:solid; width:100px; height:1px;" color=#000000 size=1">

# 问题描述：
使用npm安装node-sass时报错:

```typescript
npm ERR! code ELIFECYCLE
npm ERR! errno 1
npm ERR! node-sass@4.14.1 postinstall
npm ERR! Exit status 1
npm ERR!
npm ERR! Failed at the node-sass@4.14.1 postinstall script.
```

<hr style=" border:solid; width:100px; height:1px;" color=#000000 size=1">

# 原因分析：
看大佬的分析说是sass安装时获取源的问题,需要修改sass安装的源.


<hr style=" border:solid; width:100px; height:1px;" color=#000000 size=1">

# 解决方案：
这里修改成了了taobao的npm

```typescript
npm config set sass_binary_site=https://npm.taobao.org/mirrors/node-sass
```
重新安装,解决:

```typescript
npm install
```
