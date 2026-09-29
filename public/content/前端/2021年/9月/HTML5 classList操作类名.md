---
title: HTML5 classList操作类名
date: 2021-09-28
cover: /img/d1.webp
desc: HTML5 classList操作类名
tags: [Vue, 前端]
sticky: false
---

# 使用HTML5 classList在JS中操作类名
<hr style=" border:solid; width:100px; height:1px;" color=#000000 size=1">

@[TOC](文章目录)

<hr style=" border:solid; width:100px; height:1px;" color=#000000 size=1">

# 前言
今天遇到一个需求,需要在每次点击的时候触发CSS动画,但是按照以往的经验(走的弯路),一个CSS动画在触发一次之后,如果不做出改动,下次再触发就播放不了了.
比如给一个按钮添加一个点击变色再还原的效果,那就只能触发一次,之后再点击也不会有效果,那我们来随便写点什么看看

```css
        @keyframes shining {
            0% {
                background-color: grey;
            }

            50% {
                background-color: aqua;
                text-shadow: 10px aqua;
                box-shadow: 10px 10px 10px aqua;
            }

            100% {
                background-color: grey;
            }
        }
```

```javascript
        let btn = document.querySelector("button");
        btn.addEventListener("click", function () {
            btn.style.animation = "shining 2s";
        })
```
![在这里插入图片描述](../../../../img/前端/2021年/9月/HTML5%20classList操作类名/1.gif)
然后觉得应该先移除animation动画属性,然后在下次触发的时候再现场添加,这样一来即便每次添加都只能执行一次,也足够完成效果..
那么我就有了两种选择:直接单独给animation一个类,然后操作这个类,或者直接移除animation属性;
我选择操作类来间接改变animation属性,这样似乎会方便一些(你明明是忘了怎么改变CSS属性吧?)...


然后选择了classList系列属性来进行这项操作,这是一种专门操作类名的方法,光看名字就知道了.
"classList 属性返回元素的类名，作为 DOMTokenList 对象。"


刚开始学的时候有一个疑问,就是所做的移除,创建等操作, 到底是对CSS中的类本身进行操作,还是仅仅左右了DOM元素对这些类的使用?
实际上是操作元素对类的使用,类本身还是在那里的,我只是取消使用它或者开始使用它;

<hr style=" border:solid; width:100px; height:1px;" color=#000000 size=1">

# 一、classList.add()
你可以使用这个方法来为一个元素添加多个类名,当然,只加一个也是可以的,只传一个值就好了.

公式:
```javascript
element.classList.add(需要加入使用的类名1,需要加入使用的类名2,需要加入使用的类名3);
```
例:

```css
        .class1 {
            height: 100px;
            width: 100px;
            background-color: grey;
        }
```

```html
<div id="div1"></div>
```

```javascript
document.getElementById("div1").classList.add("class1");
```
![在这里插入图片描述](../../../../img/前端/2021年/9月/HTML5%20classList操作类名/2.jpeg)
<hr style=" border:solid; width:100px; height:1px;" color=#000000 size=1">

# 二、classList.remove()
移除元素中一个或多个类名,用法同.add();

公式:
```javascript
element.classList.remove(需要被移除的类名1,需要被移除的类名2, 需要被移除的类名3);
```
例:
那我们就把刚才的灰色方块再变没吧...

```html
 <div id="div1"></div>
```

```javascript
document.getElementById("div1").classList.add("class1");
document.getElementById("div1").classList.remove("class1");
```
![在这里插入图片描述](../../../../img/前端/2021年/9月/HTML5%20classList操作类名/3.jpeg)

<hr style=" border:solid; width:100px; height:1px;" color=#000000 size=1">

# 三、classList.replace()
将某个旧类名替换为一个新的类名;
公式:
```javascript
element.classList.replace("旧类名", "新类名");
```
例:
那我们现在让这个灰方块变个色:

```css
        .class1 {
            height: 100px;
            width: 100px;
            background-color: grey;
        }

        .class2 {
            height: 100px;
            width: 100px;
            background-color: skyblue;
        }
```

```html
<div id="div1"></div>
```
```javascript
document.getElementById("div1").classList.add("class1");       
document.getElementById("div1").classList.replace("class1", "class2");
```
![在这里插入图片描述](../../../../img/前端/2021年/9月/HTML5%20classList操作类名/4.jpeg)
<hr style=" border:solid; width:100px; height:1px;" color=#000000 size=1">

# 四、classList.toggle()
根据传参的不同,在两种执行方式中做决定:移除/添加类名;
添加类:
```javascript
element.classList.toggle("本不具有的类名", "是否强制添加或移除类(布尔值)");
```

移除类:
```javascript
element.classList.toggle("本就具有的类名", "是否强制添加或移除类(布尔值)");
```
"是否强制添加或移除类"用处目前不详,我尝试了很多种情况,完全体现不出有什么"强制""不强制"的区别,不管这里传入什么,新类中没有的属性如果在原类中存在,也会两个类完美融合,显现旧类被新类部分替换后的样式,后加的类权重还是要高一些的:

例:
```css
        .class1 {
            height: 100px;
            width: 100px;
            opacity: 0.5;
            background-color: grey;
        }

        .class2 {
            height: 50px;
            width: 100px;
            opacity: 1;
            background-color: yellowgreen;
        }
```
```html
<div id="div1"></div>
```
```javascript
document.getElementById("div1").classList.add("class1");
document.getElementById("div1").classList.toggle("class2", "true");
//事实上第二个参数无论传哪个布尔值都没看到对样式有任何影响;
```
![在这里插入图片描述](../../../../img/前端/2021年/9月/HTML5%20classList操作类名/5.jpeg)
<hr style=" border:solid; width:100px; height:1px;" color=#000000 size=1">

# 五、classList.contains()
判断,该类是否已经被当前元素使用,返回布尔值;
也可以传入多个类,但是只要传入的类中有任何一项被该元素使用,就会返回true,不需要全部使用;
公式:
```javascript
element.classList.contains("待检类名1", "待检类名2","待检类名3");
```

例:

```html
<div id="div1"></div>
```
```javascript
document.getElementById("div1").classList.add("class1", "class2");
console.log(document.getElementById("div1").classList.contains("class5", "class3"));
console.log(document.getElementById("div1").classList.contains("class1", "class3"));
```
![在这里插入图片描述](../../../../img/前端/2021年/9月/HTML5%20classList操作类名/6.jpeg)

<hr style=" border:solid; width:100px; height:1px;" color=#000000 size=1">

# 总结
今天Get到的新方法.
如果这篇文章有帮到你,我很荣幸A :)