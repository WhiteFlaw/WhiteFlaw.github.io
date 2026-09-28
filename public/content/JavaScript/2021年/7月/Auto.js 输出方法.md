---
title: Auto.js 输出方法
date: 2021-10-23
cover: /img/d1.webp
desc: Auto.js 输出方法
tags: [CSS, 前端]
sticky: false
---

# Auto.js 全命令整理(三) 输出专题

@[TOC](目录)

各种输出方法,让你了解程序现在在干什么...
<hr style=" border:solid; width:100px; height:1px;" color=#000000 size=1">


# Console
| 命令 | 目的 |
|--|--|
| console.show() | 屏幕显示Console块. |
| console.hide() | 屏幕隐藏Console块. |
| console.clear() | 清空Console内容. |
| console.log(xxx)| 就是普通的输出吧... |
| console.warn(xxx) | 输出蓝色字体,警告. |
| console.info(xxx) | 输出绿色字体,强调. |
| console.err(xxx) | 输出红色字体,报错警告. |
| console.assert(判定式, "信息文本") | 判定式结果为false则输出"信息文本"并终止运行. |
| console.time(计时器标签,可省略) | 生成并启动定时器,即刻开始计时,搭配console.timeEnd使用. |
| console.timeEnd(计时器标签) | 即刻终止计时器标签为??的定时器,并console出计时时间,搭配console.time使用. |
| console.setSize(宽, 高) | 设置Console块的大小. |
| console.setPosition(横, 纵) | 设置Console块的位置. |
| log(???)| 返回???. |
| toastLog(文本)| 浮出带文本的气泡并打印文本到Console块. |


# Toast
| 命令 | 目的 |
|--|--|
| toast(文本) | 在屏幕上弹出气泡提示信息,气泡一般存在2s左右,在异步队列执行,所以别放循环里. |
| toastLog(文本)| 浮出带文本的气泡并打印文本到Console块. |


# Dialogs
| 命令 | 目的 |
|--|--|
| dialogs.alert(标题, 内容, 回调函数(点击后调用,可不写)) | 弹出一个只能"确定"的对话框. |
| dialogs.confirm(标题, 内容, 回调函数(点击后调用,可不写)) | 弹出一个可选"确定"/"取消"的对话框. |
| dialogs.rawInput(标题, 输入框的初始内容, 回调函数(点击后调用,可不写)) | 弹出一个带有输入框和"确定"的对话框. |
| dialogs.input(标题, 输入框的初始内容, 回调函数(点击后调用,可不写)) | 把输入的字符串用eval计算一遍再返回，返回的可能不是字符串. |
| dialogs.prompt(标题, 输入框的初始内容, 回调函数(点击后调用,可不写)) | 相当于 dialogs.rawInput(). |
| dialogs.select(标题, 选项列表(数组型), 回调函数(点击后调用,可不写) ) | 显示一个带有多选列表的对话框等待选择，返回受选选项的索引号(0 ~ item.length - 1).如果用户取消选择,返回-1. |
| dialogs.singleChoice(标题, 选项列表(数组型), 默认选项的索引号, 回调函数(点击后调用,可不写) ) | 显示一个单选列表对话框,等待用户选择,返回受选选项索引号(0 ~ item.length - 1).如果用户取消选择,返回-1. |

<hr style=" border:solid; width:100px; height:1px;" color=#000000 size=1">

 dialogs.build(配置对象) : 可自定义对话框, 对象内可配置:
| key | 作用&值 |
|--|--|
| title | 标题,字符串型. |
| titleColor | 标题的颜色,数字型或字符串型. |
| buttonRippleColor | 对话框按钮的波纹效果颜色,数字型或字符串型. |
| icon | 对话框的图标,字符串或图片. |
| content | 对话框内容.  |
| contentColor | 对话框内容的颜色. |
| contentLineSpacing | 对话框文字内容的行高倍数,数字型,1.0为一倍行高.  |
| items | 对话框列表的选项,数组型. |
| itemsColor | 对话框列表的选项的文字颜色,数字型或字符串型. |
| itemsSelectMode | 对话框列表的选项选择模式,select 普通选择模式 single单选模式 multi 多选模式. |
| itemsSelectedIndex | 对话框列表中预先选中的项目索引，是单选模式为一个索引,多选模式则为数组. |
| positive | 对话框确定按钮的文字内容,字符串. |
| positiveColor | 对话框确定按钮的文字颜色,数字型或字符串型. |
| neutral | 对话框中立按钮的文字内容,字符串. |
| neutralColor | 对话框中立按钮的文字颜色,数字型或字符串型. |
| negative | 对话框取消按钮的文字内容,字符串. |
| negativeColor | 对话框取消按钮的文字颜色,数字型或字符串型. |
| checkBoxPrompt | 勾选框文字内容,字符串. |
| checkBoxChecked | 勾选框是否勾选,布尔值. |
| progress  | 配置对话框进度条的对象. |
| max | 进度条的最大值，如果为-1则为无限循环的进度条,数字. |
| horizontal | 如果是true,对话框无限循环的进度条为水平进度条,布尔值,规定进度条样式. |
| showMinMax | 是否显示进度条的最大值和最小值,布尔值. |
| cancelable | 对话框是否可取消，如果为false，则对话框不能手动取消. |
| canceledOnTouchOutside | 对话框是否在点击对话框以外区域时自动取消，默认为true. |
| inputHint | 对话框的输入框的输入提示,字符串. |
| inputPrefill | 对话框输入框的默认输入内容,字符串. |

<hr style=" border:solid; width:100px; height:1px;" color=#000000 size=1">

# 末
这个系列也开始连更了…目前规划出到第5章,把所有指令的说明提高一下可读性,然后分类整理出来,这样写的时候查起来会方便一些.