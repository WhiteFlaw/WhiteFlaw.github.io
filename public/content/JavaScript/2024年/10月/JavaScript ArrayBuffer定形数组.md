---
title: JavaScript ArrayBuffer定形数组
date: 2024-10-13
cover: /img/d1.webp
desc: JavaScript ArrayBuffer定形数组
tags: [JavaScript, 前端]
sticky: false
---

 

---

# 一、何为定型数组
ArrayBuff与DataView相关见前文：[JavaScript ArrayBuffer的读写与类型转换 - CSDN](http://t.csdnimg.cn/rZVz5)

同DataView，它也是为了更好的读写arraybuffer而存在的视图. 

ArrayBuffer实例化的是十进制格式的数组，只是数据在内存中以二进制格式存储.	
用于webgl时，这种格式可以被javascript引擎重度优化，拥有极好的性能. 

---

# 二、创建定型数组
列举多种方法，它比DataView好用得多. 
这个类有很多后代，比如Float32Array，Int16Array等等，但都属于定型数组. 

---

## 1.基于arraybuffer实例化

```javascript
const buf = new ArrayBuffer(12);
const ints = new Int32Array(buf);
```

定型数组ints只会有3个元素, 因为buf是ArrayBuffer实例化的Int8Array，转Int16只剩一半长度, 转Int32又砍一半长度, 所以只有3个元素. 而ints的buffer属性则还是12个元素的ArrayBuffer:

```javascript
buffer: Arraybuffer(12);
```

---

## 2.仅指定元素个数
再来看直接以元素个数创建：

```javascript
const ints2 = new Int32Array(6); console.log(ints2.buffer);
```

则是Ints2里有6个元素, 它的buffer属性值, 即bufferArray，还是Int8格式，ints2要展开元素2次才能回到int8格式,即buffer数组里有24个元素. 

```javascript
buffer: Arranybuffer(24);
```

---

## 3.基于数组创建
支持用原生数组创建：

```javascript
const ints3= new Int32Array([2, 4, 6, 8]);
```

意思是创建Int32Arr, 内有2,4,6,8四个元素：

```javascript
buffer: ArrayBuffer(16);
>Int16Array(8)[2, 0, 4, 0, 6, 0, 8, 0]
```

也支持用定型数组创建：

```javascript
const ints3= new Int32Array([2, 4, 6, 8]);
const ints4 = new Int16Array(ints3));
```

Ints4为Int16Array(4)[2, 4, 6, 8]相当于用原生数组创建，不存在转换进制格式的问题. 

```javascript
const flo0 = Float32Array.of(3.14, 2.718, 1.618);
```

---

## 3.用定型数组自己的方法
定型数组的of方法基于arguments多个数字类型参数创建对应格式的定型数组，比如以上创建内部包含3.14, 2.718, 1.618三个元素的Float32Array. 

```javascript
const ints5 = Int16Array.from([3, 5, 7, 9);
```

定型数组的from方法基于传入的原生数组创建定型数组，这与在实例化定型数组时传入数组的结果相同. 

---

# 三、用定型数组维护
同DataView，它提供的方法让对arraybuffer的操作更方便和可追溯. 

---

## 1.写入：set()
定型数组的set()方法接受两个值作参，第一个参数为数字类型原生数组或定型数组，第二个参数为下标，这个方法所做的事即设置调用者数组的某段：从第二个参数对应的下标处开始，将后面的下标对应的元素一对一替换为参数数组的元素，这样说可能难以理解，看代码吧：

```javascript
const int4 = Int16Array.from[3, 5, 7, 9]);
int4.set([1, 2, 3], 1); // Int16Array[3, 1, 2, 3]
int4.set([1, 2, 3], 0); // Int16Array[1, 2, 3, 3]
int4.set(Int8Array.of(1, 2, 3), 1); // Int16Array[1, 1, 2, 3];
int4.set([1, 2, 3, 4], 1); // Error: offset out of bounds; 参数过长直接报错
int4.set(1); // invalid argument;
```

无论用什么类型数组处理定型数组，处理结束类型不变. 

---

## 2.读取：subarray()
定型数组的subarray方法

```javascript
const ints = Int16Array.from([3, 5, 7, 9]);
const val = ints.subarray(1, 4);	
console.log(val); //Int16Array[5, 7, 9]
const val0 = ints.subarray(1, 3);//Int16Array[5, 7]
```

这个方法所做的事即将原数组两个下标中间的部分切出并构建相同格式的定型数组后返回，但只是copy出来，不改变原数组. 

# END
如有疏漏，请为我指正，谢谢. 

