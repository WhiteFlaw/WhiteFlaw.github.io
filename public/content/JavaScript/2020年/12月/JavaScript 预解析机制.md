---
title: JavaScript 预解析机制
date: 2020-12-06
cover: /img/d1.webp
desc: JavaScript 预解析机制
tags: [JavaScript, 前端]
sticky: false
---

# JavaScript预解析
@[TOC](文章目录)

# JS预解析？
浏览器中的JS解析器运行JavaScript的过程为先进行 预解析 之后再进行 代码执行。主要为JS执行机制的问题。
# 一、预解析受体
预解析会把JS代码中的所有var和function提升至其**所在作用域的最上方(内部的最上方）**，以进行优先的声明/定义。告诉全局作用域某某变量被声明出来了，并在内存中提前开辟空间。
受体：  var    、 function

# 二、对var的预解析
对var的预解析不提升|赋值|操作，只提升|声明变量|部分的代码，提升完毕后对声明变量部分进行预解析，全局作用域中加入了这个变量的信息，之后代码依然遵循由上到下的顺序来进行执行。下面举个例子：

```javascript
  <script>
    var div = document.querySelectorAll('div')
    var up = document.querySelector('up');
    var down = document.querySelector('down');
  </script>
```
人类与机器解析方式的不同也将导致他们看到的代码不同，上方代码在解析器看来应当是以下：

```javascript
  <script>
    var div
    var up
    var down
    div = document.querySelectorAll('div')
    up = document.querySelector('up');
    down = document.querySelector('down');
  </script>
```
只提升了声明部分而没有提升赋值部分。
# 三、对function的预解析
对function的预解析不提升|函数体|部分，只提升|声明函数|部分的代码，因此也没必要写括号了，提升完毕后对声明函数部分进行预解析，全局作用域中加入了这个函数的信息，之后代码依然遵循由上到下的顺序来进行执行此函数。下面举个例子：

```javascript
  <script>
demo()
var demo = function() {
  console.log(12);
}
</script>
```
以上代码在进行解析时可以看作以下格式：

```javascript
<script>
var demo;
demo = function() {
  console.log(12);
}
demo();
  </script>
```
# 四、var在作用域内
在一些比较常规的作用域内声明变量时使用了var，那么声明出来的变量可以在全局范围内使用，但是也有不行的时候，以下我各举一个例子：

```javascript
  <script>
    for (var i = 0; i < 10; i++) {
      console.log(i)
    }
    
      function fn(i) {
        console.log(i)
      }
      fn(i)
  </script>
```
在这个例子中，for循环里的var是全局变量，下面的函数会输出“10”。
但接下来这个：
```javascript
<script>
function fn1() {
	for(var i=0;i<5;i++){
	}
	console.log(i)//5
}
fn1()
console.log(i)//i is not defined
</script>
```
var也在另一个函数function fn1内，变量就成为了这个函数作用域中的变量，只能提升至这个函数作用域的顶部。
# 五、function作参、在事件处理程序内
函数在使用时会有作为参数、被包含于侦听器等等诸多情况，我们首先应该从“这部分函数所处的作用域”着手。
我们看下面这段代码：

```javascript
<script>
    div.addEventListener('mousemove', function (e) {
      e = event || window.event;
      var x = e.pageX;
      var y = e.pageY;
      console.log('当前坐标：（' + x + ',' + y + ')');
      pic.style.left = x - 50 + 'px';
      pic.style.top = y - 25 + 'px';
    });
</script>
```
预解析时相当于以下(”var ???”这一步并不存在，为了能表达将内部函数提升并且能顺利调用才加上）：

```javascript
 var ??? = function ???(e)
 
 ??? = function (e) {
      e = event || window.event;
      var x = e.pageX;
      var y = e.pageY;
      console.log('当前坐标：（' + x + ',' + y + ')');
      pic.style.left = x - 50 + 'px';
      pic.style.top = y - 25 + 'px';
    }

    div.addEventListener('mousemove', ???)
```
传参过程中，参数是函数的类型传入了侦听器内。

传参的作用域面向全局，传参的作用域在全局作用域，所以|传入侦听器作为参数的函数|若是进行提升应当在其所在的作用域——全局作用域  中进行提升，上面最近的例子，函数直接进入全局作用域进行提升。函数体不动。

以上是我对于JS预解析的一些见解与猜想。
若是您发现了错误的观点，可以通过私信联系我，不胜感激。