
@[TOC](目录)

<hr style=" border:solid; width:100px; height:1px;" color=#000000 size=1">
其实在Vue项目里用的最多的还是less...
# 为甚麽要准备这些?
WebPack无法解析CSS代码,我们需要安装loader(loader负责完成WebPack无法完成的那部分工作,以便WebPack的工作能进行下去.)来辅助WebPack完成这项工作.
我默认您已经安装好了Node & WebPack & Webpack-cli并且初始化好了您的项目文件&package.json配置完成吧......
<hr style=" border:solid; width:100px; height:1px;" color=#000000 size=1">

# 一、建立并配置文件webpack.config.js
配置文件webpack.config.js用于为webpack分派工作(应该说是告诉它怎么做这个事儿);
这个文件大致分成前后两部分,前面各种语句利用Node来获取module exports中需要的属性值之类;
后一部分就是module exports这个对象(commonJS使用module exports进行暴露),这个对象是webpack的"工作指南".
<hr style=" border:solid; width:100px; height:1px;" color=#000000 size=1">

## 1.所需loader的安装
前面说了我们需要安装loader来辅助我们的webpack来完成工作,这里打包的是CSS文件,我们需要的loader是:

<strong>css-loader</strong>:將css樣式轉化爲commonJS模塊加載到JS中,裏面的内容是有樣式的字符串 .
<strong>style-loader</strong>:創建style標簽,將css-loader處理完放在JS中的有樣式的字符串插入進style標簽中,添加到頁面<head>中生效 .

两个loader需要协作,我们需要的loader就只有这两个,在vscode中"ctrl+`"呼出终端,cd进入这个项目的目录(Node在根据需求找包时如果没能在该文件处找到,会往上级向这个文件的父级文件方向寻找,比如webpack.config.js在project1文件夹里,我就可以把包安装在project1上)输入:

```bash
npm i css-loader style-loader -D
```
来对css-loader & style-loader进行局部安装(包仅在该文件夹内部生效),并加入后缀"-D"表明两包是受某项目依赖的包,作为依赖添加.
<hr style=" border:solid; width:100px; height:1px;" color=#000000 size=1">

## 2.引入NodeJS模块获取绝对路径
我们需要用绝对路径.
不能直接写绝对路径,这里的绝对路径会用于生成webpack处理完后文件的输出路径,如果将来我们对文件路径做出改动,原来的绝对路径会导致输出的位置太远不好被项目中的其他文件引用,或者更惨一点原来的路径断了,打包完根本输出不出来.<strong>我们需要一个能跟随webpack.config.js的位置动态改变的绝对路径.</strong>
Node中有一个path模块,我们可以引入它来提取resolve,resolve是一个方法,专门用于拼接绝对路径.直接在webpack.config,js中写入:
```javascript
const {resolve} = require('path');
```
之后我们就可以在module exports对象中使用resolve()方法了.
<hr style=" border:solid; width:100px; height:1px;" color=#000000 size=1">

## 2.module exports对象内部配置
属性很多,挨个介绍容易分不清层级,我在代码中为大家注释出解析:
```javascript
const { resolve } = require('path');
module.exports = {
    /* webpack配置 */
    entry: './src/index.js', //輸入;

    output: {    //輸出output是一個對象類型;
        filename: 'built.js',//被輸出的文件的名字;
        /*"__dirname指的是當前文件(即webpack.config.js)
        所在目錄的絕對路徑"*/
        path: resolve(__dirname, 'build')//输出路径
        /*resolve方法会将__dirname获取来的路径
          和'build'进行拼接以形成一个完整的绝对路径*/
    },
    module: {
        //loder相关的配置
        rules: [
            {
                //使用正則表達式規定需要選取的文件类型;
                test: /\.css$/,//选择以.css为后缀的文件
                //提醒自己这里正則表達式不能加引號...
                use: [ 
                /*需要使用的loader,多个用use数组,
                  单个用   loader;*/
                    "style-loader", "css-loader"
                ],
                //use中loader執行順序是自右向左子下到上
            },
        ],
    },
    //插件配置plugins,數組類型
    plugins: [
     //我们打包css,不需要插件;
    ],
    mode: 'development'
    //mode:'production'开发模式;
}
```

# 二、开始打包CSS文件
配置完我们就可以开始打包了,
我的版本信息:
webpack5.0.0  
webpack-cli3.3.12   
style-loader1.1.3   
css-loader3.6.0 
没有出现兼容性问题.
我这个版本下,在终端cd回webpack.config.js所在的文件夹,输入"webpack"就可以完成打包了,如果您的版本比较低,可能会需要输入"webpack --mode=development"才能进行打包.
打包完成后就可以根据指定的输出路径去寻找webpack为您打包后的文件了.
<hr style=" border:solid; width:100px; height:1px;" color=#000000 size=1">

# 总结
<font color=#999AAA >提示：这里对文章进行总结：
例如：以上就是今天要讲的内容，本文仅仅简单介绍了pandas的使用，而pandas提供了大量能使我们快速便捷地处理数据的函数和方法。