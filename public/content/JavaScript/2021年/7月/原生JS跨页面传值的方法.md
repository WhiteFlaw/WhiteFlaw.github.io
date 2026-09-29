---
title: 原生JS跨页面传值的方法
date: 2021-07-28
cover: /img/d1.webp
desc: 原生JS跨页面传值的方法
tags: [CSS, 前端]
sticky: false
---

@[TOC](文章目录)

这会不会是今天写的最简单的一篇文...?
<hr style=" border:solid; width:100px; height:1px;" color=#000000 size=1">

# 前言
今天在学校做2020年的题,碰到一个需求:用户在这个页面选择了症状,需要在下一个页面显示出用户选择的项;
这,这就触及到我的知识盲区了...
我突然想到前几天写Vue用了localStorage,总算是没空着,但还是想知道会不会有更好的方法.
<hr style=" border:solid; width:100px; height:1px;" color=#000000 size=1">

# 一、localStorage本地存储
不能用sessionStorage,sessionStorage在当前会话关闭之后会进行销毁,存储的东西在下个页面全是undefined.

```javascript
//PageA
        var link = document.querySelector("a");
        var value1
        //这个value1
        /* localStorage.setItem(value1, "1");
        var localS = localStorage.getItem(value1);
        console.log(localS); */
        link.onclick = function () {
            localStorage.setItem(value1, "1");
            var localS = localStorage.getItem(value1);
        }
```
当时提示我setItem应该传入两个参数,我觉得一个是key一个是value的话key应该不用提前声明,然后一跑,不行,这个value1还就得声明出来,哪怕你不赋值.

```javascript
//pageB
        var value1
        var localS = localStorage.getItem(value1);
        console.log(localS);
```
然后在B页面接收value1我就更是觉得"这个总可以直接拿来赋值进变量了吧?" 结果还是不行,还是得声明出value1才能拿到getItem()的value1.
这个方法好在在第二个页面拿到数据之后不用进行太多处理,能比较方便的使用.
# 二、URL传值
这个是我问了下同学他用的方法,感觉思维上更加合理一点,
```html
<!-- pageA -->
<body>
    <a href="#">点击跳转页面</a>
    <script>
        var link = document.querySelector("a");
        var value1 = "value1";
        var value2 = "value2";
        link.onclick = function jumpPage() {
            window.open(`pageB.html?${value1}&${value2}`);
        }
    </script>
</body>
```
主要就是URL拼接,其他也没什么好说的:
window.open("")


```html
目标页面路径URL:'要打开的地址 + ? + 参数1 + & + 参数2 + & + 参数3 + ...'
```
在终点页面使用window.location.search()方法获取地址栏传过来的参数,得到"?参数1&参数2&参数3"

可以将其赋值给一个变量准备分离出传来的值:
var receiveValue = window.location.search
不要问号:receiveValue.substr(1)
```html
<body>
    <p>我是pageB</p>
    <script>
    //输出都是有效的,可以解注释看看;
        var valueFromPageA = window.location.search;
        //console.log('valueFromPageA: ' + valueFromPageA);
        var aftercut = valueFromPageA.substr(1);
        //console.log('aftercut: ' + aftercut);
        var aftersplit = aftercut.split('&');
        //console.log('aftersplit: ' + aftersplit + '类型: ' + typeof (aftersplit));
        var value1 = aftersplit[0];
        var value2 = aftersplit[1];
        //console.log(value1, value2);
    </script>
</body>
```
比较糟糕的就是对于数据处理的步骤相比较来说会多一些.
<hr style=" border:solid; width:100px; height:1px;" color=#000000 size=1">

# 总结
这是我个人的一些理解啦,如果您发现我的不足,我很高兴您能为我指出!
: )
