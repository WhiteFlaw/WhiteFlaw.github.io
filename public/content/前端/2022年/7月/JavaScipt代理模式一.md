---
title: JavaScipt代理模式一
date: 2022-07-29
cover: /img/d1.webp
desc: JavaScipt代理模式一
tags: [JavaScript, 前端]
sticky: false
---

@[TOC](文章目录)

---

# 前言
代理模式初探, 后面会更新缓存代理和保护代理之类.
代理模式(Proxy): 某些原因需要给某对象提供一个代理以控制对该对象的访问. 这时, 访问对象不适合或者不能直接引用目标对象, 代理对象作为访问对象和目标对象之间的中介.
这种模式在现实生活中也十分常见, 但我觉得中介结构这种双向奔赴的, 其实对于抽象对象和真实对象的区分并不友好, 因为双方都可以主动.

所以我要举的例子是求爱)

---

# 一、举例_送花
我看了好多案例...挑了这个来记, 我觉得这个比较好懂一些)
男生, 要给女生送花, 但是他是一个胆小且内向的男孩子, 不好意思去亲自送, 所以就托花店去送.

基本逻辑就是: 代理`proxyObj`拿到男生`boy`那里的送花方法`sendGift`, 然后在代理`proxyObj`自己这里调用送花方法`sendGift`(注意不是"男生在代理处调用方法"而是直接由代理去调用), 拿到各个参数, 由自己去送花, 达到代男生送花的目的.
常规模式下, 我们会比较倾向于让男生自己去送花, 这样虽然代码冗杂度稍高, 但是写起来方便, 而使用代理模式的时候往往不具备这样做的条件.

是的, 在常规写法不可行的情况下再使用代理模式, 而不是能用代理模式就用代理模式.
```javascript
//女生
var girl = function (name) {
  this.name = name;
}

//男生
var boy = function (girl) {
  this.girl = girl;
  this.sendGift = function (gift) {
    console.log("hey, " + this.girl.name + ", 这是某男生送你的" + gift)
  }
}

//花店派送员, 他需要知道目标是谁, 需要帮忙做什么, 所以传入girl和sendGift
var proxyObj = function (girl) {
  this.girl = girl;
  this.sendGift = function (gift) {   //花店员工拿到花开送
    (new boy(this.girl)).sendGift(girl);  
    //new boy(this.girl),得到{ girl: girl函数, sendGift: sendGift函数 }, 然后调用这个对象的sendGift方法达成目的: 帮男生送花
    //注意这步是代理proxyObj调用了送花方法senGift, 送花者并非男生
  }
}
var girl = new girl("女生a");
var proxy = new proxyObj(girl); 
proxy.sendGift("不可名状")
```

---

额, 这句可能会有些疑惑, 割出来说下:

```javascript
(new boy(this.girl)).sendGift(girl);
```

用类比的方法来看, 先看这个

```javascript
function fun1(name) {
  this.name = name;
}
let xx = new fun1('baiX');
console.log(xx); // { name:'baiX' }
```
那么稍微变一下:
```javascript
var boy = function (girl) {
  this.girl = girl;
}
let xx = new boy(girl);
console.log(xx);  
// { girl: girl函数， sendGift: sendGift函数 }
```
其实就是:
```javascript
new 函数(函数的参数);
```

---

代理模式的特点: `代理对象与真实对象具有相同行为`.
比如此处, 分别为真实对象男生和代理对象店员定义了`sendGift`, 但是店员的`sendGift`里也并不是自己做了一个方法去送花, 而是调用了男同学送花的方法:

```javascript
this.sendGift = function (gift) {
  (new boy(this.girl)).sendGift(girl);  
}
```

这样就可以满足上面说的代理模式特点 "代理对象与真实对象具有相同行为", 店员送花的行为和男同学送花的行为必是一样的, 因为两者共用一个方法.

如果按照正常逻辑选择男生先将花送给店员, 再由店员转送女生, 那么代码冗余, 但是常规情况下就这么写, 代理模式只在常规情况不方便时使用.
 
---

# 二、举例_图片懒加载改造
老实说, 一开始没太看懂这个例子...
我大概花了半个多小时才基本看懂, 这确实和我的代码习惯很不一样, 用我固有的思路也不是那么容易理解.
额, 其实主要原因是刚开始我没有想到异步上, 所以...它的整个执行逻辑在我看来是混乱的.

## 1.普通写法-图片懒加载
就是这个原版没看懂, 先去看了代理模式改造才有点头绪(所以建议先去看下面一段代理模式的).
其实和代理模式的思路高度相似, 唯一不同的就是负责改图片的对象;

完整代码:

```javascript
window.onload = function () {
  var myImage = (function () {
  
    var imgNode = document.createElement("img"); //创建img
    document.body.appendChild(imgNode);        //增加img
    var img = new Image();                   //创建Image对象, 这个对象有src属性
    
    img.onload = function () {            //当真实(要加载的)图片加载完毕后触发
      setTimeout(() => {                          
        imgNode.src = this.src;        //this指向img元素, src也就是setSrc里的img.src = src;
      }, 2000);
    }
    
    return {
      setSrc: function (src) {       
         //代理图片      
         imgNode.src = "http://img.lanrentuku.com/img/allimg/1212/5-121204193R0.gif";
         img.src = src;
      }
    }
    
  })()
  myImage.setSrc("https://www.baidu.com/img/bd_logo1.png")  //真实图片
}
```
`myImage.setSrc`调用后直接传入真实图片地址, 此时仅仅会将`imgNode.src`赋值加载gif, 而对`img.src`赋值的真(要加载的)图片地址并不会渲染, 直到`img.onload`执行, `imgNode.src`被赋值存储了真(要加载的)图片地址的`img.src`, 图片才显示出来, 所以图片在加载2s后显示.

---

## 2.代理模式_图片懒加载
先读懂是什么个思路再去看代理模式的事情吧...
想到是不是牵扯到一个异步的问题, `window.onload`内先由上向下执行, 但是直到执行到`proxyImage`之前似乎都不会对页面有甚麽视觉上的影响.

完整代码:
```javascript
window.onload = function () {

  //闭包的真实对象
  var myImage = (function () {
    var imgNode = document.createElement("img");
      document.body.appendChild(imgNode);
        return {
          setSrc: function (src) {
            imgNode.src = src;
          }
        }
  })()

  //代理对象
  var proxyImage = (function () {
    var img = new Image();   //内存中的一个图片对象
    img.onload = function () {  //加载完毕触发方法
      setTimeout(() => {
        myImage.setSrc(this.src);//this == img    
      }, 2000)
    }
    return {
      setSrc: function (src) {
      //这步只是调用了myImage的setSrc方法, 而并非myImage执行了setSrc
        myImage.setSrc("http://img.lanrentuku.com/img/allimg/1212/5-121204193R0.gif");
        img.src = src  //真实图片
        }
      }
  })()

  //调用, 给代理对象设置真实图片
  proxyImage.setSrc("https://www.baidu.com/img/bd_logo1.png")
}
```

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
所以2s后`imgNode.src`改变, 呈现要加载的图.

---

# 三、类比
这个懒加载并不需要用代理模式, 完全可以直接在`myImage`执行监听onload事件然后替换图片, 但是用代理实现也可以.
还是记住那个特点就好: `代理对象与真实对象具有相同行为`.
图片懒加载的例子和送花的例子, 相同之处即都遵循该特点, 送花的前面说了这里不提, 懒加载中有`myImage`和`proxyImage`这两个概念:

```javascript
var myImage = (function () {})()
var proxyImage = (function () {})()
```
`myImage`中的`imgNode.src`控制着页面的图片显示, 所以它是需要被改变的, 这个例子更像是一种...雌雄同体的状态, 如果和送花案例比的话.

`imgNode`需要被改变, 它是目标, 它是女生.
`myImage`提出方法, 它是发起者, 它是男生.
`proxyImage`办事, 它是代理人, 它是店员.

但是`imgNode`就在`myImage`里, 所以我说他像是一种雌雄同体的状态...
依据代理模式特点和送花案例, `proxyImage`必须调用或者间接调用(在自己的方法里调用)`myImage`的方法, 否则将不遵循代理模式特点.

那么`proxyImage`对象必要调用`myImage`的`setSrc`方法去设置`imgNode.src`:
这是页面加载时的首次调用, 呈现加载中图片:

```javascript
//proxyImage内
return {
  setSrc: function (src) {
  //只是调用myImage的setSrc方法, 并非myImage调用setSrc
  myImage.setSrc("http://img.lanrentuku.com/img/allimg/1212/5-121204193R0.gif");
  img.src = src;
  }
}
```
而2s后下一次代理调用出现(我们假设2s后图片加载完毕需要呈现):
`img.src`此时存有加载好的图片地址

```javascript
//proxyImage内
img.onload = function () {
  setTimeout(() => {
  
    myImage.setSrc(this.src);  //this.src即img.src
     
  }, 2000)
}
```
呈现加载好的图片.

---

# 总结
下一篇: [JavaScipt设计模式初探-代理模式(二) 保护代理](https://blog.csdn.net/qq_52697994/article/details/126055151)
话说这个还是我最后一次面试的时候被问到的, "你了解js的代理模式吗?"我以前确实听说过, 但是...没去学啊哈哈哈哈.

我知道, 但是我没有去做, 就好像我知道天灾要来了, 但是直到城市被毁我都没想起来和城市里的任何一个人说.
就是有点后悔, 我当时要是高低搞两句出来, 说不定会被高看一眼呢?