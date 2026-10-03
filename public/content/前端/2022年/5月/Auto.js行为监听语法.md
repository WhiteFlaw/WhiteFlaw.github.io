---
title: Auto.js行为监听语法
date: 2022-05-04
cover: /img/d5.webp
desc: Auto.js行为监听语法
tags: [JavaScript, 前端]
sticky: false
---

# Auto.js 全命令整理(四) 屏幕按键监听

 

<hr style=" border:solid; width:100px; height:1px;" color=#000000 size=1">



# 屏幕按键监听
| 命令 | 目的 |
|--|--|
|events.observeTouch()|屏幕按键监听,启动 !(需拿到root权限)|
| events.setTouchEventTimeout(时间间隔) | 设定两次触摸事件的最小间隔(ms) |
| events.getTouchEventTimeout() | 返回两次触摸事件的最小间隔(ms) |
| events.onTouch(回调函数) | 注册触摸回调函数,只要有屏幕触摸,就回调函数 |
| events.removeAllTouchListeners() | 移除全部屏幕触摸监听函数 |
| events.on("事件",回调函数) | 当有屏幕按键事件时会触发事件 |
| Key | 事件,有屏幕按键按下/弹起都会触发 |
| key_up | 事件,有屏幕按键弹起就触发 |
| key_down | 事件,有屏幕按键按下就触发 |
| toast | 事件,有应用弹出气泡就会触发 |
| notification | 事件,有应用发出通知会触发该事件 |
| home | 主屏幕键 |
| back | 返回 |
| menu | 菜单(运行中应用) |

<hr style=" border:solid; width:100px; height:1px;" color=#000000 size=1">

# 末
以上是我据本阶段的学习得出的一些经验与心得，如果帮到了您，在下十分荣幸；若是您发现了不足，您可以在评论区指出, 我会感谢您的指点的!
话说Auto.js该分到哪个类别的文章啊喂!