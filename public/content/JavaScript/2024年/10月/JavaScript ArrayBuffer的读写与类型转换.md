---
title: JavaScript ArrayBuffer的读写与类型转换
date: 2024-10-01
cover: /img/d7.webp
desc: JavaScript ArrayBuffer的读写与类型转换
tags: [JavaScript, 前端]
sticky: false
---

# 一、ArrayBuffer与视图
所有视图的基本单位是ArrayBuffer, ArrayBuffer开辟一块内存空间，以字节为开辟单位，其中只存储二进制格式的数据.
ArrayBuffer不可直接读写, 必须通过视图(比如DataView)暴露的API. 

---

# 二、DataView
DataView暴露的API强制开发者在读写数据时表明数据的格式(ElementType, 如几进制), DataView将根据ElementType完成将此类型向目标类型的转化, 比如将写入的10进制数转为2进制再存储. 
将ArrayBuffer类型传入DataView以接受管理并使用其暴露的API，其实现了get和set，DataView提供的API接受字节偏移量< number>作为参数，从左到右每加1偏移一个下标，但这个参数给0的话是取到下标为0的数组元素，所以可以看作数组下标.

```javascript
const bufferArr = new ArrayBuffer(4); const dataV = new DataView(bufferArr);
dataV.setInt8(0, 1);
dataV.setInt8(1, 2);
dataV.getInt8(1);
```
在内存中开辟大小为4字节的空间，将字节偏移量0处的元素设置为为二进制1，偏移量1处元素设置为二进制2. 

---

# 三、如何转换数组类型
首先要知道每个字节占8位，这是后续操作的基石，也就是ArrayBuffer内Int8Array数组的一个元素，即一个字节，由8位组成.
每当操作过存储任意格式的数组后，ArrayBuffer对象内存储其他类型的数组都会发生变化，因为这些数组都指向同一块内存，表示同一份数据.

```javascript
 dataV.setInt8(0, 2);
 dataV.setInt8(1, 1);
 // dataV<ArrayBuffer>
 // Int8Array[2, 1, 0, 0];
 // 0下标00000010即二进制2
 // 1下标00000001即二进制1
 // 2下标00000000即0
 ```
 
如何根据已有的一种类型数组推算出其转换为另一种类型数组后的形态，比如根据Int8数组推算Int16数组？
 
 《JavaScript高级程序设计》中提供了一张表，表示了各种类型所占的字节. 
 Int16是在表中占2字节的类型，Int8类型占1字节，所以由存储Int8类型的数组可以推算出将该数组内数据转为Int16类型后的样子:
 Int8数组中每两个字节（也是两个数组元素）组合为Int16数组中的一个元素，因为此二元素均占8位.
 将两个Int8元素“组合”，即两个二进制数拼接，如：
 
 ```javascript
00000010 // 二进制
00000001 // 二进制
// 组合为
0000001000000001 // 二进制
// 即513十进制

Int8Array[2, 1, 0, 0];
// 转为
Int16Array[513, 0];
```

同理，如果某种格式占4个字符，那就是Int8Array中每4个元素拼接出其一个元素，或Int16Array中每两个元素拼接出其一个元素. 

 ArrayBuffer会提前转换好各种格式的数组存储在ArrayBuffer对象中，输出ArrayBuffer对象即可见. 

---

# END
如有疏漏，请为我指正，谢谢. 