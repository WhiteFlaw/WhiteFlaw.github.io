---
title: JavaScipt代理模式虚拟代理
date: 2022-07-30
cover: /img/d1.webp
desc: JavaScipt代理模式虚拟代理
tags: [CSS, 前端]
sticky: false
---

@[TOC](文章目录)

---

# 前言
虚拟代理是代理模式在性能方面的分支, 个人认为有点像人工异步操作.

把累活和细活从真实对象拆出来丢给代理对象, "你做完之后叫我一声, 我来拿结果." 
那么可以把开销大的操作, 或者网络请求放到代理对象执行, 等到做完的时候调用真实对象的方法回来拿, 在这个空当里真实对象可以先去应付一些其他的事情.
另外有时候为了符合代码职责单一原则, 也会用虚拟代理把请求和业务逻辑分离.

---

# 一、举例_图片懒加载
我在初探代理模式, 也就是这个系列的首篇里举过这个例子, 当时我还不知道...它不仅仅是代理模式而且还是虚拟代理.

不过这次会从虚拟代理角度看这个案例, 而不仅仅是"代理模式"的角度.

完整代码:
```javascript
window.onload = function () {
  var myImage = (function () {
    var imgNode = document.createElement("img");
      document.body.appendChild(imgNode);
        return {
          setSrc: function (src) {
            imgNode.src = src;
          }
  })()
  
  var proxyImage = (function () {
    var img = new Image();   //内存中的一个图片对象
    img.onload = function () {  //加载完毕触发方法
      setTimeout(() => {
        myImage.setSrc(this.src);//this == img    
      }, 2000)
    }
    return {
      setSrc: function (src) {
        myImage.setSrc("http://img.lanrentuku.com/img/allimg/1212/5-121204193R0.gif");
        img.src = src  //真实图片
      }
    }
  })()

  proxyImage.setSrc("https://www.baidu.com/img/bd_logo1.png")

}
```
然后先看一下代码思路: 

自`proxyImage`之后, 调用`proxyImage`的`setSrc`, 看向`proxyImage`的`setSrc`, 此时会调用`myImage`的`setSrc`导致`imgNode`的`src`成为加载gif.

 而同时`myImage.setSrc(this.src)`设置的`this.src`即`img.src`此时拥有了真正的图片地址(要加载的图片地址), 但是还不会呈现.
 
 ```javascript
var proxyImage = (function () {
   var img = new Image();
   return {
     setSrc: function (src) {
       myImage.setSrc("http://img.lanrentuku.com/img/allimg/1212/5-121204193R0.gif");
       img.src = src;
     }
   }
})()
 ```
 
 这种情况直到`proxyImage`的计时器完成才有所改变, `myImage.setSrc`被再次调用, 传入了要加载的图片地址: `img.onload的this.src`, 即`img.src`, 

```javascript
var proxyImage = (function () {
  img.onload = function () {  //加载完毕触发方法
    setTimeout(() => {
      myImage.setSrc(this.src);  //this == img    
    }, 2000)
  }
})()
```

此时`imgNode.src`被赋值为`img.src`即要加载的图片地址:

```javascript
var myImage = (function () {
  var imgNode = document.createElement("img");
    //document.body.appendChild(imgNode);
      return {
        setSrc: function (src) {
          imgNode.src = src;
        }
      }
})()
```

这样看来img对象在这个过程中担任一个存储的作用, 请求要用的图片并且直至其加载好.
所以2s后`imgNode.src`改变, 呈现要加载的图片.

---

# 二、虚拟代理在示例中的体现
加载真实图片这个事情交给代理去做, 我真实对象先去展示加载中图片了, 等到你代理对象那边加载完了图片叫我一声(调用我)我回来拿.

先实例化一个img对象用于对真实图片进行加载和存储, 并且用`onload`事件监听:

```javascript
var proxyImage = (function () {
  var img = new Image();   //内存中的一个图片对象
  
  return {
    setSrc: function (src) {
      //...
      img.src = src  //真实图片
    }
  }
  
})()
proxyImage.setSrc("https://www.baidu.com/img/bd_logo1.png")
```
与此同时真实对象的`setSrc`受到调用, 设置了加载中图片:

```javascript
var proxyImage = (function () {

  return {
    setSrc: function (src) {  //未使用参数scr的语句设置了默认图片
      myImage.setSrc("http://img.lanrentuku.com/img/allimg/1212/5-121204193R0.gif");
    }
  }
  
})()

proxyImage.setSrc("https://www.baidu.com/img/bd_logo1.png")
```

剩下的就是监听真实图片的加载, 这里为了效果明显, 让图片加载完后再延迟2s呈现:

```javascript
var proxyImage = (function () {
  var img = new Image();   //内存中的一个图片对象
    img.onload = function () {  //加载完毕触发方法
      setTimeout(() => {
        myImage.setSrc(this.src);  //this == img    
      }, 2000)
    }
  return {
    setSrc: function (src) {
      img.src = src  //真实图片
    }
  }
})()

proxyImage.setSrc("https://www.baidu.com/img/bd_logo1.png")
```
最后, 遵循代理模式最基本特点: `代理对象与真实对象应当具有相同行为.` 
所以代理对象代替真实对象设置图片时, 也必须与"真实对象亲自设置图片"时使用的方法相同, 所以选择了直接调用`myImage`的`setSrc`.

---

# 总结
上一篇: [JavaScipt设计模式初探-代理模式(二) 保护代理](https://blog.csdn.net/qq_52697994/article/details/126055151)