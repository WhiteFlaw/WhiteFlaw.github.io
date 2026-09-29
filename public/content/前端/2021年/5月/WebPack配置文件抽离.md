---
title: WebPack配置文件抽离
date: 2021-05-24
cover: /img/d1.webp
desc: WebPack配置文件抽离
tags: [CSS, 前端]
sticky: false
---

# WebPack配置文件的分离
@[TOC](文章目录)
<hr style=" border:solid; width:100px; height:1px;" color=#000000 size=1">

# 简述
对配置文件进行抽离,以达到开发时依赖一个配置文件,发布时依赖一个配置文件的目标,在配置文件的代码量巨大时,此举可有效提升整洁性;
所有配置混杂的webpack.config.js在分离完成后可删除
<hr style=" border:solid; width:100px; height:1px;" color=#000000 size=1">

# 一、安装插件&配置
通常会分离为三个文件,一个开发时依赖的配置文件(这里我命名为dev.config.js),一个发布时依赖的配置文件(这里我命名为prod.config.js),还有一个两模式下都需要依赖的配置文件(这里我命名为base.config.js);

<strong>安装插件</strong>
没错,这个活webpack还是干不了.
webpack-merge协助对两个配置文件进行合并.
```javascript
npm i webpack-merge -D
```
该插件在使用时需要导入:

```javascript
const webpackMerge = require('webpack-merge')
```

# 二、抽离存放
抽离存放可以,但是用的时候也不能让webpack找不着;
## 1.分离配置文件
```javascript
//这是webpack.config.js的内容
module.exports = {
    entry: './src/index.js',
    output: {
        filename: 'built.js',
        path: resolve(__dirname, 'build')
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                exclude: /\.(css|js|html|less)$/,
                loader: 'file-loader',
                options: {
                    name: '[hash:10].[ext]'
                },

            },
            {
                test: /\.html$/,
                loader: 'html-loader'
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html'
        })
    ],
    mode: 'development',
    devServer: {
        contentBase: resolve(__dirname, 'build'),
        compress: true,
        prop: 3000
    }
};
```

仅生产环境下需要的配置放到prod.config.js

```javascript
//这是prod.config.js的内容
module.exports = {
    devServer: {
        contentBase: resolve(__dirname, 'build'),
        compress: true,
        prop: 3000
    }
}
```
<hr style=" border:solid; width:100px; height:1px;" color=#000000 size=1">

仅开发环境下需要的配置放到dev.config,js

```javascript
//这是dev.config,js的内容
module.exports = {
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html'
        })
    ]
}
```
<hr style=" border:solid; width:100px; height:1px;" color=#000000 size=1">
开发环境&生产环境下均需要的配置放到base.config,js

```javascript
//这是base.config,js的内容
module.exports = {
    entry: './src/index.js',
    output: {
        filename: 'built.js',
        path: resolve(__dirname, 'build')
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                exclude: /\.(css|js|html|less)$/,
                loader: 'file-loader',
                options: {
                    name: '[hash:10].[ext]'
                },

            },
            {
                test: /\.html$/,
                loader: 'html-loader'
            }
        ]
    },
    mode: 'development',
};
```
到此,我们已经把webpack.config.js分开为三个文件,你可以删除原本的webpack.config.js了.
<hr style=" border:solid; width:100px; height:1px;" color=#000000 size=1">

## 2.merge配置文件之间接合
配置文件在用的时候还是要发挥合在一起时的效果的;这需要用到merge了,它的本意就是"结合".
现在更新一下三个文件的内容:
1.prodConfig中进行baseConfig和prodConfig的合并
```javascript
/*因为在pordConfig内,所以只需要引入baseConfig写在webpackMerge()方法内,再把prodConfig内需要合并的代码也写在webpackMerge()方法内即可.*/
const webpackMerge = require('webpack-merge')
const BaseConfig = require('./base.config.js')
module.exports = webpackMerge(BaseConfig, {
        plugins: [
        new UglifyjsWebpackPlugin()
    ]
})
```
<hr style=" border:solid; width:100px; height:1px;" color=#000000 size=1">
<strong>baseConfig合并于prodConfig内,所以接下来仅需要进行dev.config.js和prodConfig的合并</strong>

<hr style=" border:solid; width:100px; height:1px;" color=#000000 size=1">

2.devConfig中进行dev.config.js和prodConfig的合并

```javascript
/*因为在devConfig内,所以只需要引入ProdConfig写在webpackMerge()方法内,再把devConfig内需要合并的代码也写在webpackMerge()方法内即可.*/
const webpackMerge = require('webpack-merge')
const ProdConfig = require('./prod.config.js')
module.exports = webpackMerge(ProdConfig, {
    devServer: {
        contentBase: './dist',
        inline:true
    }
})
```
完事了吗?但这样直接打包会报错.
# 三、打包
最后需要在package.json中代指 打包指令 的别名中进行配置,比如在build和dev中:

```javascript
"build":"webpack --config ./build/prod.config.js"
"dev":"webpack-dev-server --open --config ./build/dev.config.js"
```

合并完毕后打包,三文件会放到base.config.js所在的文件夹中,因为base中的output的path设置的路径是自身所在文件夹的绝对路径,当然,是可以改的.
修改这个绝对路径,以把三个文件输出至合适的位置即可.
# 总结
补下webpack的内容,只捡了一些内容比较多的部分写,准备开更vue-cli了.
感谢你读到这里.