---
title: Vue-cli4配置别名
date: 2021-07-03
cover: /img/d4.webp
desc: Vue-cli4配置别名
tags: [Vue, 前端]
sticky: false
---

# Vue-cli4配置alias

@[TOC](文章目录)
<hr style=" border:solid; width:100px; height:1px;" color=#000000 size=1">

# 前言
之前去查了设置别名的方法,都说在vue.config.js里进行配置,我把他们的代码复制下来跑了一次,别名根本不生效;
<hr style=" border:solid; width:100px; height:1px;" color=#000000 size=1">

# 配置别名
首先依据如下路径找到base.js文件;
```typescript
node_modules>@vue>cli-service>lib>config>base.js
```
然后找到如下:

```typescript
    webpackConfig.resolve
      // This plugin can be removed once we switch to Webpack 6
      .plugin('pnp')
      .use({ ...require('pnp-webpack-plugin') })
      .end()
      .extensions
      .merge(['.mjs', '.js', '.jsx', '.vue', '.json', '.wasm'])
      .end()
      .modules
      .add('node_modules')
      .add(api.resolve('node_modules'))
      .add(resolveLocal('node_modules'))
      .end()
      .alias//alias:别名,在此处依据格式配置别名;
      .set('@', api.resolve('src'))
      .set('assets', api.resolve('src/assets'))
      .set('components', api.resolve('src/components'))
      .set('views', api.resolve('src/views'))
```

<hr style=" border:solid; width:100px; height:1px;" color=#000000 size=1">

# 别名-使用方法
你配置的这些别名在< script>中写JS时都是可以正常使用的,直接写就可以:

```typescript
//给@/components配置了别名"components"后:
import NavBar from "components/common/navbar/NavBar";
```
但是在< template>里写HTML时就别这么干了,
所有别名在HTML里使用时都要在前面加上"~":

```typescript
//给@/assets配置了别名"assets"后:
<img src="~assets/img/icon/Gear.png" />
```

# 总结
以上是我据本阶段的学习得出的一些经验与心得，如果帮到了您，在下十分荣幸；若是您发现了不足，您可以在评论区指出, 我会感谢您的指点的!