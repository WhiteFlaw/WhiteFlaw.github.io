---
title: 如何让CSS动画中途停止
date: 2021-09-24
cover: /img/d1.webp
desc: 如何让CSS动画中途停止
tags: [CSS, 前端]
sticky: false
---

# 如何让CSS动画中途暂停在某一状态

@[TOC](文章目录)

<hr style=" border:solid; width:100px; height:1px;" color=#000000 size=1">

# 前言
我曾经遇到过一个难题.
我需要让一个摆动的房子从塔吊上落下,但点击落下途中,房子需要维持落下瞬间摆动的角度.
当时
把我难坏了,刚开始我希望能获取到房子当前摆动的角度,并且在下落的瞬间赋值给房子的transform:rotate(),但这是实在是太麻烦了,不会是最优解.

但其实只要一个属性就能解决这个问题.

animation-play-state
<hr style=" border:solid; width:100px; height:1px;" color=#000000 size=1">

# 一、仅用CSS
使用该属性使一段动画在其运动周期中暂停.,并且下次开始时直接从暂停在的那一帧开始.
这是一个动画属性,它对animation属性生效, 你既可以在CSS中使用它,也可以在JS中使用它,同样的方便,至少...比获取角度再赋值好到不知道哪里去.

```javascript
.xxx {
  animation-play-state: paused;  
  //该属性一旦被添加,CSS动画会立即暂停,并且保持于当前帧
}

.xxx {
  animation-play-state: running; 
  //该属性一旦被添加,CSS动画会立即从当前帧开始运作;
}
```
你可以给一个页面元素添加一个animation,然后设置当hover状态时加上
```javascript
 animation-play-state:paused
```
动画就会在你鼠标追上那个元素时停止.

# 二、仅用JS

```javascript
//i等于1时媒体播放并且音符飘动,i等于0时媒体暂停音符暂停.
            if (i == 1) {
                right.style.animationPlayState = "paused"
                audio.pause();
                i = 0;
            } else {
                right.style.animationPlayState = "running";
                audio.play();
                i = 1;
            }
```
![在这里插入图片描述](../../../../img/前端/2021年/9月/如何让CSS动画中途停止/1.gif)


<hr style=" border:solid; width:100px; height:1px;" color=#000000 size=1">

# 总结
一点小经验 :一)