---
title: You are running Vue in development mode.Make sure to turn on production mode when deploying for
date: 2021-03-29
cover: /img/d4.webp
desc: You are running Vue in development mode.Make sure to turn on production mode when deploying for
tags: [Vue, 前端]
sticky: false
---

此问题目前见于Edge，其他浏览器未知。

“你正在开发模式下运行Vue，在你部署你的产品时请确保你打开了开发模式。请在xxx网址查看更多提示。”

![在这里插入图片描述](../../../../img/前端/2021年/3月/You%20are%20running%20Vue%20in%20development%20mode.Make%20sure%20to%20turn%20on%20production%20mode%20when%20deploying%20for/1.jpeg)
在引入Vue基础文件后，在后面添加如下代码可解决此问题：

```javascript
<script>Vue.config.productionTip = false</script>
```
