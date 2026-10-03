---
title: Auto.js 硬件监听语法
date: 2022-05-04
cover: /img/d4.webp
desc: Auto.js 硬件监听语法
tags: [JavaScript, 前端]
sticky: false
---

# Auto.js 全命令整理命令(五) 硬件按键监听

 

<hr style=" border:solid; width:100px; height:1px;" color=#000000 size=1">

# 硬件按键监听
| 命令 | 目的 |
|--|--|
| events.observeKey() | 按键监听,启动 ! |
| events.onKeyDown(按键名, 回调函数) | 注册按键按下监听函数 |
| events.onKeyUp(按键名, 回调函数) | 注册按键弹起监听函数 |
| events.onceKeyDown(按键名, 回调函数) | 注册仅首次生效的按键按下监听函数 |
| events.onceKeyUp(按键名, 回调函数) | 注册仅首次生效的按键弹起监听函数 |
| events.removeAllKeyDownListeners(按键名) | 删除对该按键的所有按下监听 |
| events.removeAllKeyUpListeners(按键名) | 删除对该按键的所有弹起监听 |
| volume_up | 音量+键 |
| volume_down | 音量-键 |

<hr style=" border:solid; width:100px; height:1px;" color=#000000 size=1">

# 末
以上是我据本阶段的学习得出的一些经验与心得，如果帮到了您，在下十分荣幸；若是您发现了不足，您可以在评论区指出, 我会感谢您的指点的!

咕咕咕..