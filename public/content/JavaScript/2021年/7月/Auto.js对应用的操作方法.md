---
title: Auto.js对应用的操作方法
date: 2021-10-23
cover: /img/d1.webp
desc: Auto.js对应用的操作方法
tags: [CSS, 前端]
sticky: false
---

# Auto.js 全命令整理(二) 对应用命令专题
@[TOC](目录)

对应用命令主要用于确认屏幕显示的是否是正确的页面,so,并不多.
<hr style=" border:solid; width:100px; height:1px;" color=#000000 size=1">

# 对应用命令
|命令| 目的 |
|--|--| 
| app.launchApp(应用名) | 启动应用by应用名 |
|app.launchPackage(包名)| 启动应用by包名 |
| app.launch(包名) | 启动应用by包名  |
| waitForActivity(activityName, 检索间隔) | 等待指定Activity(页面)出现,每隔一段时间检测是否启动完毕 |
| waitForPackage(PackageName, 检索间隔) | 等待指定Package对应的应用启动,每隔一段时间检测是否启动完毕 |
| app.openUrl(URL) | 在浏览器打开某URL |
| app.uninstall| 卸载当前所在的应用 |
| app.openAppSetting(包名) | 打开包名对应应用的详情页 |

<hr style=" border:solid; width:100px; height:1px;" color=#000000 size=1">

# 回顾-应用数据获取
| 命令 | 目的 |
|--|--|
| app.versionCode | 获取当前所在应用的版本号. |
| app.versionName | 获取当前所在应用的版本名. |
| app.getAppName(包名) | 获取包名对应的应用名. |
| app.getPackageName(应用名) | 获取应用名对应的包名. |
| currentPackage() | 返回最近一次/当前运行的应用的包名. |
| currentActivity() | 返回最近一次/当前运行的应用名(Activity名). |

<hr style=" border:solid; width:100px; height:1px;" color=#000000 size=1">


# 末
这个系列也开始连更了…目前规划出到第5章,把所有指令的说明提高一下可读性,然后分类整理出来,这样写的时候查起来会方便一些.