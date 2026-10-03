---
title: 解读ES6 Promise
date: 2021-09-07
cover: /img/d1.webp
desc: 解读ES6 Promise
tags: [JavaScript, 前端]
sticky: false
---

# 详解ES6 Promise异步
<hr style=" border:solid; width:100px; height:1px;" color=#000000 size=1">

@[TOC](文章目录)


<hr style=" border:solid; width:100px; height:1px;" color=#000000 size=1">

# 前言
我打算先解释resolve和reject这两个方法, 因为then()和catch()负责接收resolve和reject方法的返回物,这样可能会更好理解些,然后all方法这多少有点规格外,我们最后说.

<hr style=" border:solid; width:100px; height:1px;" color=#000000 size=1">

# 一、Promise是什么呢...
一种异步编程解决方案,多用于一般很耗时的网络请求(JS是单线程语言,如果使用同步来进行程序,中途用户一旦要进行网络请求,会与同步执行的程序出现冲突,称为"阻塞",线程阻塞进行操作也无法执行);

在执行一些复杂的回调时,使用Promise可以较好的避免回调地狱;

特性:
 1. 本质是构造函数;
 2. 自身带有 resolve | reject | all() 等方法;
 3. 原型中还提供了 then() | catch() 两种方法;

<hr style=" border:solid; width:100px; height:1px;" color=#000000 size=1">

# 二、resolve
使用Promise的时候需要先作为参数传入,具体见下面例子;

resolve()方法在执行成功后回调Promise,然后拿到Promise返回的数据传给then().

在resolve回调的过程中如果出错,程序不会立即停止运行,而是会将错误报告推送给catch();

它只返回一个数据,就是回调的结果,如果是网络请求的话就是请求结果,在调用到then的时候then里必然就已经有了正确无异常的结果(不然也不会调用then()),于是事先在then()里写处理方法的时候就可以拿一个参数来接收(在进行网络请求的时候一般会用res):

```typescript
//先传入两个方法;
	promise((resolve, reject) => {
      setTimeout(() => {
      //我们可以手动调用resolve();
        resolve(); 
      }, 1000)
    }).then(
         function(res){
         //使用res来接收resolve返回给then的数据;
		   console.log("回调结果是:" + res);
	     }
       )
	
```
<hr style=" border:solid; width:100px; height:1px;" color=#000000 size=1">

# 三、reject
使用Promise的时候需要先作为参数传入,具体见下面例子;

reject()方法在执行失败后回调Promise,然后拿到错误报告传给catch().
在resolve回调的过程中如果出错,程序也会将错误报告推送给catch().

返回错误报告,在调用到catch的时候catch里必然就已经有了错误报告(不然也不会调用catch()),于是事先在catch()里写处理方法的时候就可以拿一个参数来接收(一般会用error或者err):

```typescript
//先传入两个方法;
	promise((resolve, reject) => {})
	  .then()
      .catch((error) => {
           console.log("出错啦:" + error);
       })
	
```
<hr style=" border:solid; width:100px; height:1px;" color=#000000 size=1">

# 四、then() & catch()
我感觉把这两个放在一起说可能会更好理解一些,因为两位的关系是并列的...

then()和catch()可以在一次Promise链式调用中同时使用,then()会负责接收reslove方法返回的数据,而catch()会接收reject方法返回的错误报告;

```typescript
promise((resolve, reject) => {
  setTimeout(() => {
    resolve() 
  }, 1000)
}).then().catch();	

```
<hr style=" border:solid; width:100px; height:1px;" color=#000000 size=1">
个人觉得这两个方法成功的将Promise和其他请求方法区分开了,也建立了Promise独有的优势;

依照Promise的思想,其将请求的各个步骤交付专门的方法进行处理:

resolve方法在成功的时候回调Promise并提供数据给then().

reject方法在失败的时候回调Promise并且提供错误报告给catch().

在then()里专门处理数据,而不是拿到后夹在各个请求之间直接原地处理.

就算是报错也有catch()专门负责;
<hr style=" border:solid; width:100px; height:1px;" color=#000000 size=1">
其中then()在优化回调嵌套代码这块算是功不可没了,将嵌套调用转换为链式调用可谓是大大优化了代码可读性,极大程度避免了回调地狱.

啊,这么说似乎不太好直观,我先来模拟一个层层嵌套的回调地狱,然后您和Promise异步方案对比就一目了然了:

```typescript
//欢迎来到回调地狱 doge)
//我们需要URL1来获取DATA1数据,而下一次请求所需的URL2在DATA1里
//获取DATA2数据又需要URL2,而下一次请求所需的URL3又在DATA2里,
new Promise((resolve, reject) => {
    setTimeout(() => {
    //首层
         console.log(xxx);
         console.log(xxx);
         console.log(xxx);

         setTimeout(() => {
         //倒数第二层回调,需要上一级回调的结果才能执行;
               console.log(xxx);
               console.log(xxx);
               console.log(xxx);

             setTimeout(() => {
             //套在最里面的回调,需要上一级回调的结果才能执行;
                  console.log(xxx);
                  console.log(xxx);
                  console.log(xxx);
             })
         }, 1000)
   }, 1000)
})
//今天写着挺头疼,明天看着更头疼.

```
差不多就是这么个意思,用setTimeout来模拟回调函数,层层嵌套就跟棕榈柱似的,外层的扒不下来里面的也没法动.
我们再来看看Promise的解决方案:

```typescript
//全程没有内部嵌套,链式执行;
new Promise((resolve, reject) => {
//第一次回调;
    setTimeout(() => {
      resolve() 
   }, 1000)
}).then(() => {
//then中处理第一次回调结果
         console.log(HelloWorld);
//拿到第一次回调的结果,在第一次回调的then中发起第二次回调;
 return new Promise((resolve, reject) => {
         setTimeout(() => { 
              resolve()
         }, 1000)
     })
}).then(() => {
//处理第二次回调结果
         console.log(HelloVue);
//拿到第二次回调的结果,在第二次回调的then中发起第三次回调;
 return new Promise((resolve, reject) => {
         setTimeout(() => {
              resolve()
         })
     })
}).then(() => {
//处理第三次回调结果;
         console.log(HelloPHP);
    })

```
写Promise的话代码可能会很长,但是一定能让你避免队友的hammer of justice.

<hr style=" border:solid; width:100px; height:1px;" color=#000000 size=1">

# 五、all
该方法针对并发的异步操作,在所有异步操作执行完并且都成功的时候才回调Promise.
在使用的时候您可以将需要并行执行的Promise放到各个方法里,然后使用Promise.all([ ]) 在数组里写上需要调用的方法,即可并行执行各个Promise;

这看起来有点像axios.all()发起的并发请求? 确实,我也这么觉得...

```typescript
function promise1(){
  let work1 = new Promise(function(resolve, reject){})
	return work1;
//return一下,不然Promise.all的数组里收到的不是Promise对象;
}
	   
function promise2(){
  let work2 = new Promise(function(resolve, reject){})
    return work2;
//return一下,不然Promise.all的数组里收到的不是Promise对象;
}
	   
function promise3(){
  let work3 = new Promise(function(resolve, reject){})
	return work3;
//return一下,不然Promise.all的数组里收到的不是Promise对象;
}

 //在此处同时调用三个方法,返回三个Promise;
	Promise.all([
	  promise1(),
	  promise2(),
	  promise3(),
	])
	.then((res) => {
	   console.log("拿到了!" + res);
		})
	.catch((error) => {
	   console.log("出错啦:" + error)
	  });
```
等到它们都执行完后,then()才会调用(catch()依然是出错就调用)。

3个异步操作返回的数据都在then里以数组的形式存储着, 这时候给then一个参数来接收结果即可.

<hr style=" border:solid; width:100px; height:1px;" color=#000000 size=1">

# 总结
其实还该有个finally, 但是我还没接触过,怕写错了,这篇先放着,以后碰着再回来补上吧!

这是我根据本阶段学习得出的一些经验, 如果对您有帮助, 博主很荣幸.