# 在Vue-cli 4.x 中配置样式
在使用vue-cli 4.x搭建项目完毕后,你可以选择在项目目录下创建"style"文件夹,在里面创建scss文件来作为全局可用的样式文件.
<hr style=" border:solid; width:100px; height:1px;" color=#000000 size=1">

# 为什么要配置全局样式

其实也可以选择不创建全局样式文件,如果你愿意每创建一个页面都在它目录下的独有scss文件中重新规定它的所有样式.....

所以建立它吧,这会让你省下那些重复的工作.
<hr style=" border:solid; width:100px; height:1px;" color=#000000 size=1">

# 一、插件准备
你需要安装3个插件: dart-sass   &  sass-resources-loader  &  sass-loader
安装dart-sass  &  sassresource-loader
```typescript
npm install sass sass-loader -D
//这个指令会安装dart-sass和sass-loader;
//node-sass安装中经常出现各种问题;
//性能也比不上dart-sass,在2020年末被替代;
```

安装sass-resources-loader
```typescript
npm i sass-resources-loader -D
//ver2.2.2,当前的最新版;
```

我的配置信息:
![在这里插入图片描述](../../../../img/前端/2021年/6月/Vue-cli%204中的全局样式配置/1.jpeg)

# 二、开始配置
## 1.vue.config.js配置
你可能已经发现在vue-cli4.x创建的项目中不再有config和dist了,对,所有的配置我们都要在vue.config.js中完成.
那么,在项目目录下直接创建vue.config.js,然后进入下一步.

```typescript
module.exports = {
    publicPath: process.env.NODE_ENV === 'production' ? '' : '/',
    outputDir: process.env.NODE_ENV === 'production' ? 'dist' : 'devDist',
    lintOnSave: false,
    css: {
        loaderOptions: {
            scss: {
                AdditionalData: `@import "./src/style/main.scss";`
    /*ver8.x改为prependData: `@import "./src/style/main.scss";`,运行时请去掉本注释 */
            }
        }
    }
}
```
因为我们现在只配置全局scss需要的配置,那.....
我就只写这一部分需要的配置了,如果想一步到位的话CSDN搜索vue-cli4 vue.config.js配置即可.

## .App.vue配置
很简单的一步,在App.vue的< style >标签中加入lang属性:

```typescript
<style lang="scss">
```
即可.

好吧,我们在全局scss文件里随便写点什么:

```typescript
body {
    background-color: rgb(177, 60, 82);
}

```
![在这里插入图片描述](../../../../img/前端/2021年/6月/Vue-cli%204中的全局样式配置/2.jpeg)
到此说明我们的全局scss文件引入成功了.


<hr style=" border:solid; width:100px; height:1px;" color=#000000 size=1">

# 附1-全局样式不显示的部分可能
## 1.检查是否出现浏览器默认样式覆盖
浏览器会自带着对于生效的样式,这个样式有时会盖过我们赋予页面的样式,呼出控制台,进入样式面板,取消对那些与你的样式发生冲突的样式的勾选,观察样式是否生效.
![在这里插入图片描述](../../../../img/前端/2021年/6月/Vue-cli%204中的全局样式配置/3.jpeg)

如果你进行了这步后全局样式生效了,那么你需要寻找并下载一个重置浏览器样式的css文件normalize.scss,在main.scss即全局样式文件内将其引入即可.
## 2.检查是否出现第三方插件样式覆盖
就拿我在用的ant-design-vue来说,它的包内就有一个"antd.css"文件,内部的background-color样式就会与我的全局样式产生冲突.

 # 附2-Vue页面控件单独样式配置
我想你可以看到你的那些页面都是在View这个文件夹里的?就在这里面创建某个页面的专属样式文件,然后在需要的文件内import引入即可.
如图,在View目录下创建scss文件.
![在这里插入图片描述](../../../../img/前端/2021年/6月/Vue-cli%204中的全局样式配置/4.jpeg)
好的,然后在Login.vue内引入它.
![在这里插入图片描述](../../../../img/前端/2021年/6月/Vue-cli%204中的全局样式配置/5.jpeg)
# 总结
前段时间参加了学校的HTML5设计大赛......
为了爆肝作品一直都没更新,前天交了作品,是时候该赶赶进度了! XD