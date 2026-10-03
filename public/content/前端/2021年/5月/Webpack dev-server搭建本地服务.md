---
title: Webpack dev-server搭建本地服务
date: 2021-05-24
cover: /img/d4.webp
desc: Webpack dev-server搭建本地服务
tags: [前端]
sticky: false
---

## WebPack-dev-server搭建本地服务器

@[TOC](文章目录)

<hr style=" border:solid; width:100px; height:1px;" color=#000000 size=1">

# dev-server简述
用途:实现浏览器自动刷新来显示效果,这在Vue开发时是个好用的东西.
dev-server是一个可选的本地开发服务器,基于node,js创建,内部使用express框架.
express框架可以服务于某个文件夹,会一直监听其中的代码是否改变,一旦改变会对所有改变的代码重新编译,编译后的代码会由express生成一些新的东西先放入内存,不会映射入盘,不会有任何输出;发布时npm run build才会添加到盘.
服务器读取文件时,存在于盘中的文件,被读取速度远远小于内存中的文件.

<hr style=" border:solid; width:100px; height:1px;" color=#000000 size=1">

# 一、安装&配置dev-server
<strong>安装</strong>
呼出终端输入指令;
```bash
npm i webpack-dev-server -D
```
为了防止跟其他插件不兼容,还是记得规定下版本;
这里不推荐高版本,会出现与webpack-cli不兼容;
<strong>配置</strong>
在webpack.config.js中添加devserver对象进行配置,对象内可设置属性:
|属性| 作用 |
|--|--|
| contentBase | 为哪个文件夹提供服务,默认是webpack.config.js所在的根文件夹. |
|port| 端口号,你可以在哪个端口看到效果,默认8080端口; |
|inline| 是否实时监听,页面实时刷新,布尔值; |
|historyApiFallback| 在SPA页面中.依赖HTML5的history模式; |
|compress| 啓動gzip壓縮,讓代碼體型更小,速度更快,布尔值; |
示例:

```javascript
    mode: 'development',
    devServer: {
        contentBase: resolve(__dirname, 'build'),
        compress: true,
        prop: 3000
    }
```

# 二、使用dev-server
我使用的是VSCode,在终端启用本地服务:webpack-dev-server(更高版本使用npx webpack-dev-server或npx webpack serve);

在package.json中设置"dev":"webpack-dev-server --open"
这样启动本地服务只需:npm run dev,启动服务同时会直接打开浏览器显示效果.
当然去掉"--open"也可以,不会自启浏览器,启动仍可以简化成npm run dev;

<hr style=" border:solid; width:100px; height:1px;" color=#000000 size=1">

# 总结
WebPack-dev-server的知识点,本来打算在Vue教程里顺带着看,看了一集觉得看的不太明白,就去单独找了个webpack5.0.0教程看,完事又回去看了一次Vue里的webpack教程,总算搞懂,把两个教程说到的知识点都记下来了
感谢你能读到这里!
要是觉得还不错,考虑下给个赞? XD