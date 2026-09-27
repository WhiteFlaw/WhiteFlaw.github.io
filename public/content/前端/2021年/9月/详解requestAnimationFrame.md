<strong>详解Web API     requestAnimationFrame</strong>
@[TOC](文章目录)

<hr style=" border:solid; width:100px; height:1px;" color=#000000 size=1">

# 前言
在前端,想要实现动画效果的方法多种多样,但我们常用的也就那么几种:
在JS中有使用setInterval频繁调用来实现的方法,css3则是提供了transition和animition属性,在html5中也有canvas的方法.

对于一段动画,重要的是过渡,首先要有(不然就只是一次从起始状态到末状态的闪现罢了),之后就是不同的过渡方式的过渡质量了.

这次要介绍的"requestAnimationFrame"是一种并列于serInterval(),transition和animation的新的过渡方式,它能够提供更加优质的过渡质量,造就更加流畅完美的动画效果.

<hr style=" border:solid; width:100px; height:1px;" color=#000000 size=1">

# 一、简单了解requestAnimationFrame
requestAnimationFrame,
字面意思"请求动画帧",估计该理解成"对动画的帧提出要求".
通过控制回调函数的调用时机,它对动画过程的控制也确实精确到了帧,这是我这样理解的原因;
![在这里插入图片描述](../../../../img/前端/2021年/9月/详解requestAnimationFrame/1.jpeg)
<hr style=" border:solid; width:100px; height:1px;" color=#000000 size=1">

# 二.动画的原理
您要是明白视觉停留效应和动画原理那这段您可以不看直接到第三节了:)


用程序写动画的原理基本和早期放电影一样,在程序里定义当前这一帧的图像,然后定义接下来各帧的图像,让程序完成对图像的高速替换,利用人眼的视觉停留效应来给观者形成一种连贯的错觉.

<strong>WARING:以下这段略(yan)微(zhong)跑题,怕影响思路可跳过</strong>
(在我们在看某个图像的时候,成像是在视网膜后端的,成像是个比较麻烦的过程,所以需要时间,这也就注定了在视网膜上形成的图像的变化频率必定落后于传入眼睛的光所传导的图像的变化频率.

就像程序执行一样,把你的视网膜看作浏览器,那么:

传入视网膜的图像就是传入一个函数的参数,

图像被视网膜处理的过程就相当于函数执行的过程;

每次传入的不同图像也就相当于传入函数的不同参数;

函数每次执行完成后逐步销毁自身内部的数据,
放在视网膜上就相当于成像后再更新下一个图像的过程.
数据逐步销毁,而根据视觉上留下的残影也可以得知视觉图像的替换也是渐进的过程,都有一个"逐渐完成"在里面,当前的"像"是逐渐渐变到新的"像"的,这样导致我们看到的东西是平滑连贯的.
## 铺垫:屏幕刷新率
与之相对的电脑屏幕也有一个属性叫屏幕刷新率(当然有一些电脑屏幕是不具备)对于这种电脑屏幕,它们更新图像的方式就是依据屏幕刷新率所规定的频率来频繁的刷新屏幕,这就像我们在代码中规定浏览器多久刷新一次来更新新的内容.

<hr style=" border:solid; width:100px; height:1px;" color=#000000 size=1">

# 三、requestAnimationFrame好在哪里

## 1.可提升性能
回调函数执行频率通常是每秒60次，为了提高性能和电池寿命，在大多数浏览器里，当requestAnimationFrame() 运行在后台标签页或者隐藏时，requestAnimationFrame() 会被暂停调用以提升性能和电池寿命,而页面重新可视之后,动画会从上次停止的位置继续执行。

## 2.可避免屏幕刷新率影响
这就会引出一个问题,就是"屏幕刷新率和程序生成的动画的更新频率如果不同会导致的后果".
setInterval的执行时间并不是确定的。在Javascript中， setInterval任务是一个异步操作会放进异步队列中，只有当主线程上的任务执行完以后，才会去检查该队列里的任务是否需要开始执行，因此setInterval 的实际执行时间会不太稳定。
不同设备的屏幕刷新频率不同，而 setInterval只能设置一个固定的时间间隔，这个时间不一定和屏幕的刷新时间相同。
而这种不一致会导致掉帧卡顿,举个例子就是setInterval在第2s执行程序准备好了一张需要换上的新图,结果第2s屏幕恰好没刷新(那就没显示出这张新图),但是到下一次屏幕刷新的时候却成功更新了图像,那你看到的就是直接从第1帧蹦到了第3帧,第二帧图像没了.

与setInterval相比(如果收受到刷新率影响的话CSS3那俩方法应该也存在这种问题?)，requestAnimationFrame最大的优势是由系统来决定回调函数(在这里也就是setInterval())的执行时机。它会保证回调函数生效的时候刚好能赶上屏幕刷新，requestAnimationFrame会让回调函数的执行频率与屏幕刷新的间隔的出现频率同步。以此保证回调函数在屏幕每次刷新的间隔中被执行，来避免"恰好执行完赶上刷新间隔",无法成功更新图像的情况.

## 3.防止回调函数异常调用(节流)
requestAnimationFrame会让 [回调函数的执行频率] 与 [屏幕刷新的间隔的出现频率] 同步,然后在屏幕刷新间隔的空当让回调函数执行一次,不会执行多了,这样保证效果流畅的同时也节约执行函数的开销。

<hr style=" border:solid; width:100px; height:1px;" color=#000000 size=1">


# 四、如何使用requestAnimationFrame
## 1.直接使用:回调函数
这个东西的用法其实跟setInterval()是一样的,但是...我想你应该在前面看到了这张图片:
![在这里插入图片描述](../../../../img/前端/2021年/9月/详解requestAnimationFrame/2.jpeg)
是的,区别就是它不能完成自主调用,也不能写出来就无限次执行,你得在这个受它调用的回调函数最后再调用它一次他才能执行下一次,就像这样:

```typescript
const element = document.getElementById('element');
let num;

function callbackFunction() {
     num++;

  //末尾再次调用以使函数能被requestAnimationFrame持续调用200次;
  if (num < 200) { 
    window.requestAnimationFrame(step);
  //需要持续无限执行调用的话去掉if即可;
  }
}

```
需要无限次执行的话,去掉限制条件if就好了?

## 2.使用模板(优雅降级)
这个方法还是在别人的源码里看到的,记下来吧doge)

```typescript
var RAF = (function () {
            return window.requestAnimationFrame ||
                   window.webkitRequestAnimationFrame ||
                   window.mozRequestAnimationFrame ||
                   window.oRequestAnimationFrame ||
                   window.msRequestAnimationFrame ||
                   function (callback) {
                     window.setTimeout(callback, 1000 / 60);
                   };
           })();

          function animate() {
            //函数体
            RAF(animate);
          }
```
貌似是在尝试使用window.requestAnimationFrame,并且根据不同的浏览器内核做了适配方案,最后如果都没能获取的话做了一个保底,使用setInterval()来保证基础的运行,最后在回调函数末尾调用了一下封装好的requestAnimationFrame以保证持续执行;

刚去查了一下这个叫"优雅降级",确实是封装的requestAnimationFrame,因为现在requestAnimationFrame兼容性不好所以需要各个写法挨个尝试.

<hr style=" border:solid; width:100px; height:1px;" color=#000000 size=1">

# 总结
今天从一份Canvas特效源码里看到有这个属性,没见过,学习了一下,写了些东西,见解的比较粗略,您要是觉得有不好的地方可以在评论区与我交流:(
这么长时间没写,这次写的倒还蛮找到点感觉,还举了个视网膜和函数的类比(这肯定让很多人一头雾水,哈).
这个月一直在准备一场比较重要的考试,没有写博客...
好在考试结束让我得以从这教科书的苦役中解放出来,继续完善我的博客和技术,这个月可以多花点时间在代码上了......