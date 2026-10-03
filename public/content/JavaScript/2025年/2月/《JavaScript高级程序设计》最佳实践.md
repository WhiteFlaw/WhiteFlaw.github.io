---
title: 《JavaScript高级程序设计》最佳实践
date: 2025-02-22
cover: /img/d7.webp
desc: 《JavaScript高级程序设计》最佳实践
tags: [JavaScript]
sticky: false
---

我只选取了我还没完全贯彻的条目罗列如下.

1.函数命名
函数名由动词开头,如getName();

2.布尔类型命名
若函数返回布尔值,则函数名以is/can等开头.

3.常量命名约定
常量名全大写并以下划线""连接.

4.变量类型透明化
定义变量时,应将其立即初使化为一个与其同类型的值,因为在开头集中声明变量时应能表示出变量类型.
从
let name = null;
改为
let name ="";

5.函参类型透明化
通过指定默认参数的方式为函数参数标明类型
function(namne)x	function(name="")√	

6.事件处理耦合
事件处理逻辑不应与应用逻辑耦合,应在事件处理逻辑中调用对应应用逻辑,而非应用逻缉写在事件处理器内。事件处理器内仅做与事件对象相关工作.事件对象不应整体传入应用逻辑.

7.字面量
所有使用次数超一次的字面量,都应存于常量,使用常量,以防A处改了B处却未改而报错.

8.全局查找
访问当前作用域外部变量所需时间随作用域链中作用域数量增加而呈现线性增长,由起始作用域到某个外层用域之间的作用域越多,需查找的时间越长.最大的作用域document则需遍历作用域链,用时最多.通过在局部作用域中保存对外部变量的引用,则仅创建引用时有一次较广的查找效率O(n),此后使用该引用效率为O(1);
如下例
```javascript
const target = { foo: bar }
const handler = {
get:(target,property, receiver)=>{
console.log('get');
const proxy= new Proxy(target, handler);
function doEnumr1(){	
let i= 100;	let pf = proxy.foo;	
do {	
console.log(`i: ${proxy.foo}`);	
}while(--i>0);	
}
function doEnumr2(){
let j =5;
do{
console.log (`i:${proxy.foo}`);	
}while(--j>0);	
}
//get, i get, i...
//get, i, i, i...
```

9.访问数组元素的效率=访问变量效率,均为O(1);
访问变量或者数字的效率高于访问对象效率，因为查属性名要查作用域链，能用数组索引便不使用对象.

10.优化循环
有时可以用反向的思维去处理数据，比如你要从数组中剔除的元素占大部分，那不如去筛选小部分符合条件的元素出来.
终止条件要尽可能好算，尽可能少O(n)，一满足条件就退出.
简化循环体，能不在循环做的就不在循环做.
尽量使用后测试循环，先做再判定，比如do while替代for，避免初始就对终止条件评估.
能在一个循环里做的就不要拆成好几个，有时为了代码结构可能会拆，这会导致O(n)增多(比如arr.length增多了)
循环结构中减少对效率为O(n)值的访问.
遍历数组时选择反向遍历加后测试循环这套方案可以很大程度上提速.反向循环你不用再反复访问xx.length这个O(n)变量.
从
```javascript
for(i=0;i<x.length;i++)
```
改为
```javascript
for(i=x.length;i>=0;i--)
```
从999个O(n)到一个O(n).
再将以上改为后测试循环:
```javascript
let i = x.length;
if(i > -1){
do{
xx
}while(--i >= 0)
}
```

11.原生api
尽可能使用原生方法，作为一门解释型语言，由C/C++构建，原生绝对比自己用js搭的东西快.

12.优化判定大量的连续判定用卫语句可以提高可读性，用switch可以提高效率（因为它不会挨个过终止条件）.

13.链式语句比多句效率高.

14.迭代性的值放进语句里，不要拆为单句:
从
```javascript
let name = val[i];
i+p;
```
改为
```javascript
let name = val[i++];
```