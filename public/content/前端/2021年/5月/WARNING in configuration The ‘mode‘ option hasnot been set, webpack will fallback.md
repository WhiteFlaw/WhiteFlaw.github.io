
# 项目场景：

<font color=#999AAA >
使用webpack對CSS文件和一JS文件進行打包

<hr style=" border:solid; width:100px; height:1px;" color=#000000 size=1">

# 问题描述：
配置webpack.config.js完成;
webpack & webpack-cli安裝完成;
css-loader & style-loader安裝到上級文件夾完成,
執行打包時輸入webpack顯示如下:
![在这里插入图片描述](../../../../img/前端/2021年/5月/WARNING%20in%20configuration%20The%20‘mode‘%20option%20hasnot%20been%20set,%20webpack%20will%20fallback/1.jpeg)
提示我沒有配置mode項
<font color=#999AAA >

<hr style=" border:solid; width:100px; height:1px;" color=#000000 size=1">

# 原因分析：

<font color=#999AAA >
我先去檢查了webpack.config.js中的mode配置,

![在这里插入图片描述](../../../../img/前端/2021年/5月/WARNING%20in%20configuration%20The%20‘mode‘%20option%20hasnot%20been%20set,%20webpack%20will%20fallback/2.jpeg)
沒有問題
后去檢查package.json裏的script配置
![在这里插入图片描述](../../../../img/前端/2021年/5月/WARNING%20in%20configuration%20The%20‘mode‘%20option%20hasnot%20been%20set,%20webpack%20will%20fallback/3.jpeg)
沒有配置mode,於是加了這段

```javascript
    "dev": " --mode development",
    "build": "--mode production"
```
沒有解決,甚至連變化都沒有......
<hr style=" border:solid; width:100px; height:1px;" color=#000000 size=1">

# 解决方案：
解決方案一是剛開始用的,後來無意間發現了第二種:
<font color=#999AAA >
解決方案一:
此時webpack為最新版5.36.2,需要在打包指令"webpack"后添加
後綴 "--mode=development"來解決.

解決方案二:
在使用一解決後我繼續完成後續工作,卡在css文件打包的問題上,最後我選取了
webpack5.0.0
webpack-cli3.3.12
style-loader1.1.3
css-loader3.6.0
這一能配合webpack5.0.0的組合來進行最後的打包,發現在這種包組合下直接執行"webpack"即可進行正常打包.