@[TOC](文章目录)

---

# 前言
提取JS数组中所有具备相同属性的对象构成数组, JS提取数组相同属性对象, `new Set()` 数组去重.

---


# 一、前端情况
我今天才了解到它, 我在尝试将数组中所有具备相同属性值的对象抽离进多个数组时犯了难:
```javascript
const rawArr = [
  {
    sacNam: '总计',
    sacNamKo: 'xxx'
    trxAmt0: '',
    trxAmt1: '',
    trxAmt2: '',
    trxAmt3: '',
    trxAmt4: '',
  },
  {
    sacNam: '合计',
    sacNamKo: 'xxx'
    trxAmt0: '',
    trxAmt1: '',
    trxAmt2: '',
    trxAmt3: '',
    trxAmt4: '',
  },
  {
    sacNam: '小计',
    sacNamKo: 'xxx'
    trxAmt0: '',
    trxAmt1: '',
    trxAmt2: '',
    trxAmt3: '',
    trxAmt4: '',
  },
  {
    sacNam: '总计',
    sacNamKo: 'xxx'
    trxAmt0: '',
    trxAmt1: '',
    trxAmt2: '',
    trxAmt3: '',
    trxAmt4: '',
  },
  ...
]
```
如上, 根据`sacNam`提取对象, 子对象个数不定.

当时能想到的比较简单的方法就是遍历数组然后用`switch`(在这种一对多的情况下switch的效率更高)去筛选, 然后将它们分别`push`到各自的子数组, 但是执行起来简直就是噩梦.

这个大数组长度2800+, 里面有43种`sacNam`, 也就意味着手写`switch`43种情况, 代码相当难看, 而且里面有魔术字符串, 出事必找你.

---

# 二、解决方案
## 1.提取所有对象的目标属性
得先拿到`sacNam`的所有可能.
也就是提取`sacNam`属性啦...遍历`push`一下就好,  不多说, 完成之后基本是这样:

```javascript
[
  '总计',
  '总计',
  '总计',
  '小计',
  '小计',
  '小计',
  '小计',
  '组1',
  '组1',
  '组1',
  ...
]
```
去重之后就是`sacNam`的所有可能.

---

## 2. `new Set()` 处理简单数组_去重
```javascript
// temArr即上面实例数据结构
const sacMay = new Set(temArr)
```
之后`sacArr`是一个
```javascript
Set()[[Entries]]
```
对象, 这个东西是不能直接用的, 需要`Array.from()`转数组: [Array.from()](https://blog.csdn.net/qq_52697994/article/details/120845432)
也就是这样写:

```javascript
const sacMay = Array.from(new Set(temArr))
```
然后得到去重之后的`sac`所有可能:
```javascript
[
  '总计',
  '小计',
  '组1',
  ...
]
```

---

## 3.遍历筛选
用`sacNam`的所有可能, 在原数组里筛选提取.
纯粹`forEach`方案:
```javascript
const temArr = []
sacMay.forEach((may, index) => { 
// sacMay完全可以放在里面, 但是放里面意味着你要手动往temArr里写43个子数组.
  temArr.push([])
  rawArr.forEach((item) => { 
  // 用sacMay元素比对原数组的每一个子对象
    if (item.sacNam === may) {
      temArr[index].push(item);
    }
  })
})
console.log(temArr);
```

`filter`方案:

```javascript
const temArr = []
sacMay.forEach((may, index) => {
  const temArr2 = rawArr.filter((item) => {
    return item.sacNam === may
  })
  temArr1.push(temArr2);
})
console.log(temArr1);
```

好处就是可以避免魔术字符, 然后后端如果改数据, 也不用回前端改字符串.

---

# 总结
-