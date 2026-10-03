---
title: 读《学习JavaScript数据结构与算法》第三章补
date: 2022-09-22
cover: /img/d1.webp
desc: 读《学习JavaScript数据结构与算法》第三章补
tags: [JavaScript, 前端]
sticky: false
---

@[TOC](文章目录)

---

# 前言
JavaScript 基于`reduce()`方法对数组内多对象的同属性运算, `reduce()`遍历数组求和, 包含`reduce`的基本使用, `reduce()`方法内置判定, `reduce()`操作数组内对象.

本文的运算以求和为例.
你可以直接略过一二章.

---


# 一、前端情况
一个基本是月财务帐表的的任务, 里面需要横向纵向的展示和, 前端负责求和, 后端下班的时候很开心. 
然后他走之后我发现这表格数据是一格一格返的, 后面一个多小时我都在骂骂咧咧的帮他处理数据...

我把数据整理成了遍历渲染表格常用的数据结构:
```javascript
// reportTableAllData
[
  [
    {
	  hj: '1234',
	  sdsaName: 'xxx',
	  trxnAmt0: '568.78',
	  trxnAmt1: '56565',
	  trxnAmt2: '568.54',
	  trxnAmt3: '44164',
	  trxnAmt4: '568.78',
	  trxnAmt5: '55458.78',
	  trxnAmt6: '568.78',
	  trxnAmt7: '568.78',
	  trxnAmt8: '54554.78',
	  trxnAmt9: '568.78',
	  trxnAmt10: '57878.78',
	  trxnAmt11: '568.7544',
	  trxnAmt12: '565458.78',
	  trxnAmt13: '5545.78',
    },
    {
	  hj: '1234',
	  sdsaName: 'xxx',
	  trxnAmt0: '568.78',
  	  trxnAmt1: '56565',
	  trxnAmt2: '568.54',
	  trxnAmt3: '44164',
	  trxnAmt4: '568.78',
	  trxnAmt5: '55458.78',
	  trxnAmt6: '568.78',
	  trxnAmt7: '568.78',
	  trxnAmt8: '54554.78',
	  trxnAmt9: '568.78',
	  trxnAmt10: '57878.78',
	  trxnAmt11: '568.7544',
	  trxnAmt12: '565458.78',
	  trxnAmt13: '5545.78',
    },
    ...除统计末行共43行
  ],
    [
    {
	  hj: '1234',
	  sdsaName: 'xxx',
	  trxnAmt0: '568.78',
	  trxnAmt1: '56565',
	  trxnAmt2: '568.54',
	  trxnAmt3: '44164',
	  trxnAmt4: '568.78',
	  trxnAmt5: '55458.78',
	  trxnAmt6: '568.78',
	  trxnAmt7: '568.78',
	  trxnAmt8: '54554.78',
	  trxnAmt9: '568.78',
	  trxnAmt10: '57878.78',
	  trxnAmt11: '568.7544',
	  trxnAmt12: '565458.78',
	  trxnAmt13: '5545.78',
    },
    {
	  hj: '1234',
	  sdsaName: 'xxx',
	  trxnAmt0: '568.78',
  	  trxnAmt1: '56565',
	  trxnAmt2: '568.54',
	  trxnAmt3: '44164',
	  trxnAmt4: '568.78',
	  trxnAmt5: '55458.78',
	  trxnAmt6: '568.78',
	  trxnAmt7: '568.78',
	  trxnAmt8: '54554.78',
	  trxnAmt9: '568.78',
	  trxnAmt10: '57878.78',
	  trxnAmt11: '568.7544',
	  trxnAmt12: '565458.78',
	  trxnAmt13: '5545.78',
    },
    ...除统计末行共43行
  ]
  ...不定量子数组
]
```
每个对象为一行, 一个子数组为一页.

每页的表格结构基本是这样:

![在这里插入图片描述](../../../../img/JavaScript/2022年/9月/JavaScript%20reduce实现对象数组内同属性运算/1.png)

右侧大栏目下应为14个子栏目, 对应数据结构中14个trxnAmt数字项.
每行为一个对象, 那么跨对象求和的话需要计算纵向total, 也就是末行total.
统计所有对象中trxnAmt系列属性相同的项之和, 比如所有trxnAmt0之和.

---

# 二、reduce同属性求和_失败的尝试
这个步骤在`vuex`的`actions`函数中完成

tem开头的变量为作中继、辅助的变量.
`reportTableAllData`为首章展示的已处理数据结构.

你先别写, 这个方法有问题:

```javascript
getColEventTotal() {
  const temArr = [];
  reportTableAllData.forEach((item) => {
  
    const sum = item.reduce((previousVal, currentVal, currentIndex) => {
    
      if(typeof currentVal === 'string' && currentVal !== '') {
        // 空的话后端一般返回null或者空格, 已经判空替换成空字符串
	    return Number(previousVal['trxnAmt' + currentIndex]) + Number(currentVal['trxnAmt' + currentIndex]);
      } else {
        return Number(previousVal['trxnAmt' + currentIndex]) + 0;
      }
      
    })
    temArr.push(sum);
    
  })
}
```
求到一半我发现数据里有空字符串和非数字, 所以你可以看到我加了一个`if`判定, 这个问题是解决了, 但是出现了一个让我更搞不懂的事.

我要统计的是这一列的所有, 但是现在到了一个空数据格处卡住了, 下一个待求和值`currentVal`可以拿到, 问题出在这个方法上, 这个方法到这里进行不下去了

---

```javascript
getColEventTotal({ commit }, mainSearchRes) {
  const temArr = [];
  state.reportTableAllData.forEach((item) => {
  
    const sum = item.reduce((previewVal, currentVal, currentIndex) => {
    
      if(typeof currentVal === 'string' && currentVal !== '') {
	    return Number(previousVal['trxnAmt' + currentIndex]) + Number(currentVal['trxnAmt' + currentIndex]);
      } else {
        return Number(previousVal['trxnAmt' + currentIndex]) + 0;
      }
      
    })
    temArr.push(sum);
    
  })
}
```

---

# 三、基本用法测试

在几次传值运算失败后我决定先写个demo测试一下：

![在这里插入图片描述](../../../../img/JavaScript/2022年/9月/JavaScript%20reduce实现对象数组内同属性运算/2.png)

如图， 如果不进行数字转换直接输出前后值字符串，第一个旧值一旦进行一次相加就会变成`undefined`.
我不太理解为什么两个数字相加能够得到`undefined`.

直到我做了一个小检测, 用了一组简单的数据来输出, 我差不多明白了:

```javascript
function getColEventTotal() {
  var arr = [
    {xx1: 1},
    {xx1: 2},
    {xx1: 3}
  ];
  var sum = arr.reduce(function(prev, cur, index, arr) {
      console.log(prev, cur, index);
      return prev.xx1 + cur.xx1;
  })
  console.log(sum);
}
getColEventTotal()
```

```
{ xx1: 1 }  { xx1: 2 }  1
3  { xx1: 3 }  2
NaN
```

如果不传入初始值的话, 默认初始值将会是第0个数组元素, 第0个数组元素作为初始值和首轮新值进行求和运算完毕后得到的新值仅仅是一个数字也就是结果中的第二行首位3, 此时这个数字在次轮执行又被选取`3.xx1`所以得到了`undefined`, 如果对此进行Number()将会直接在次轮及后续得到`NaN`, 从此后面的循环受到影响全部出错.

那么解决办法就是手动规定一个初始值从而使首轮不再需要进行对象属性拣选, 从而使得表达式中的旧值不需要进行拣选, 如此每轮的旧值为纯粹的数字:

```javascript
function getColEventTotal() {
  var arr = [
    {xx1: 1},
    {xx1: 2},
    {xx1: 3}
  ];
  var sum = arr.reduce(function(prev, cur, index, arr) {
      console.log(prev, cur, index);
      return prev + cur.xx1; //prev不再拣选, 3 + obj.xx1
  }, arr[0].xx1);
  console.log(sum);
}
getColEventTotal()
```

离成功近了一步, 但是依然不够纯粹, 她的结果不正确:

```
1 { xx1: 1 } 0
2 { xx1: 2 } 1
4 { xx1: 3 } 2
7
```
`1+2+3`结果怎么能是7呢, 首轮旧值不该为1, 可见的是首轮新值依然为`{ xx1: 1 }`, 那么也就是说在手动规定了初始值的情况下无论如何, 结果都将是`初始值 + arr[0] + arr[1] + ....`, 规定初始值后数组的首值依然会作为求和项加入运算, 那么规定首轮旧值为0或许就可以达到目的:

```javascript
function getColEventTotal() {
  var arr = [
    {xx1: 1},
    {xx1: 2},
    {xx1: 3}
  ];
  var sum = arr.reduce(function(prev, cur, index, arr) { // 也就是说不论初始值如何, 都会是初始值 + arr[0] + arr[1] + ...
      console.log(prev, cur, index);
      return prev + cur.xx1;
  }, 0);
  console.log(sum);
}
getColEventTotal()
```

成功:

```
0 { xx1: 1 } 0
1 { xx1: 2 } 1
3 { xx1: 3 } 2
6
```

那么基本模式如此了, 或许可以算一下试试.

---

# 四、reduce同属性求和_成功的尝试
先以"加的起来"为目标吧, 我先把判空操作抽离出去提前完成, 所有转不成数字的都换成`'0'`.

另外我发现这个方法是需要改进的, 我说的改进不是我们的初始值问题, 而是每个对象里有14个`trxnAmt`属性, 而我们需要它们某个属性的总和, 所以`reduce`需要执行14次每次算其中一个属性的总和才行, 以前版本的方法使用`currentIndex`来驱动这一过程, 刚刚我也发现其实这个`currentIndex`是`reduce`本轮执行的`index`, 也就是..呃, 比如我要累加`trxnAmt0`, 那么它最多到43, 嗯, 因为表有43行, 所以...肯定不能用它来控制当前累加的属性.

而是另开一个`for`套在外面.

```javascript
function getColEventTotal() {
  const temArr = [];
  let sum
  reportTableAllData.forEach((arr) => {
    for (let i = 0; i < 14; i++) {

      sum = arr.reduce((previousVal, currentVal, currentIndex) => {
        console.log(`第${currentIndex}轮初始值: ` + previousVal)
        console.log(`第${currentIndex}轮新值: ` + currentVal['trxnAmt' + i])
        return previousVal + Number(currentVal['trxnAmt' + i]);
      }, 0);

      console.log(sum);
      temArr.push(sum);

    }
  })
}

getColEventTotal()
```
![在这里插入图片描述](../../../../img/JavaScript/2022年/9月/JavaScript%20reduce实现对象数组内同属性运算/3.png)
成功.

---

# 五、reduce同属性求和改进_reduce内置判定
那么如果不提前完成并抽离判空操作, `reduce`内部如何组织, 结合首次错误, 应该是需要判空解决方案在`else`里.
但是后来我测试了一下, 其实不加判空解决方案也没问题, 反正是不需要加的东西, 直接不处理略过就好了嘛?

```javascript
function getColEventTotal() {
  const temArr = [];
  let sum
  reportTableAllData.forEach((arr) => {
    for (let i = 0; i < 14; i++) {

      sum = arr.reduce((previousVal, currentVal, currentIndex) => {
        if(currentVal !== '') {
          return previousVal + Number(currentVal['trxnAmt' + i]);
        }/*  else {  //加不加结果都一样
          return previousVal + 0
        } */
      }, 0);

      console.log(sum);
      temArr.push(sum);

    }
  })
}

getColEventTotal()
```

或者...判定之后使用另一种处理方案?

```javascript
function getColEventTotal() {
  const temArr = [];
  let sum
  reportTableAllData.forEach((arr) => {
    for (let i = 0; i < 14; i++) {

      sum = arr.reduce((previousVal, currentVal, currentIndex) => {
        console.log(previousVal)
        if(currentVal['trxnAmt' + i] !== '') {
          return previousVal + currentVal['trxnAmt' + i];
        } else {
          return previousVal + "无法添加"
        }
      }, 0);

      console.log(sum);
      temArr.push(sum);

    }
  })
}

getColEventTotal()
```

![在这里插入图片描述](../../../../img/JavaScript/2022年/9月/JavaScript%20reduce实现对象数组内同属性运算/4.png)


---

# 总结
好吧, 写的挺爽的...很顺利.
希望它能帮得上你.