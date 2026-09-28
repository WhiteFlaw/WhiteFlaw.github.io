---
title: You may need an appropriate loader to handle this file type
date: 2020-11-27
cover: /img/d1.webp
desc: You may need an appropriate loader to handle this file type
tags: [CSS, 前端]
sticky: false
---

# 项目场景：

<font color=#999AAA >使用webpack對CSS文件和一JS文件進行打包
<hr style=" border:solid; width:100px; height:1px;" color=#000000 size=1">

# 问题描述：

<font color=#999AAA >配置webpack.config.js完成;webpack & webpack-cli安裝完成;css-loader & style-loader安裝到上級文件夾完成,執行打包時輸入webpack顯示如下:

![在这里插入图片描述](../../../../img/前端/2021年/5月/You%20may%20need%20an%20appropriate%20loader%20to%20handle%20this%20file%20type/1.jpeg)
也沒有生成Hash值
![在这里插入图片描述](../../../../img/前端/2021年/5月/You%20may%20need%20an%20appropriate%20loader%20to%20handle%20this%20file%20type/2.jpeg)
"您或許需要loader來處理這種類型的文件",但我已經安裝了正確的loader.
<hr style=" border:solid; width:100px; height:1px;" color=#000000 size=1">

# 原因分析：
錯誤:嘗試將webpack & css-loader & style-loader安裝到最近一級文件夾,完成後嘗試無效.
正確:猜測是版本問題:webpack找到css-loader & style-loader包,結果版本問題導致無法使用.

# 解决方案：

<font color=#999AAA >於是嘗試匹配版本,選取4個包發佈時間相近,使用人數最多的版本:

嘗試
webpack5.0.0   
webpack-cli3.3.12   
style-loader1.1.3   
css-loader3.6.0 
組合,輸入webpack指令成功打包,打包指令加入路徑亦成功打包;
![在这里插入图片描述](../../../../img/前端/2021年/5月/You%20may%20need%20an%20appropriate%20loader%20to%20handle%20this%20file%20type/3.jpeg)




