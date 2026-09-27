---
title: CSS中的Positon属性
date: 2021-10-23
cover: /img/d1.webp
desc: CSS中的Positon属性
tags: [CSS, 前端]
sticky: false
---

其实能造成这个BUG的原因有很多, 我只是记录一下这次...

目前我在webpack-dev-server和http.createServer()均遇到过这种情况, 使用该方法均成功解决.
# 解决方法
打开launch.json,官方给的方法是直接在工作文件区的".vscode"目录下进入:

![在这里插入图片描述](../../../../img/前端/2021年/10月/crbug%201173575,%20non-JS%20module%20files%20deprecated/1.jpeg)
![在这里插入图片描述](../../../../img/前端/2021年/10月/crbug%201173575,%20non-JS%20module%20files%20deprecated/2.jpeg)

打开launch.json, 用需要访问的URL替换已存在的url属性:
![在这里插入图片描述](../../../../img/前端/2021年/10月/crbug%201173575,%20non-JS%20module%20files%20deprecated/3.jpeg)
或者...
里面还没有url属性, 那就添加吧...
![在这里插入图片描述](../../../../img/前端/2021年/10月/crbug%201173575,%20non-JS%20module%20files%20deprecated/4.jpeg)
