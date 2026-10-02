---
title: Uncaught ReferenceError key is not defined
date: 2022-05-03
cover: /img/d1.webp
desc: Uncaught ReferenceError key is not defined
tags: [JavaScript, 前端]
sticky: false
---

# 项目场景：
需要遍历对象"newArr"
```javascript
for(key in data.newArr) {
  console.log(data.newArr[key])
}
```

---

# 问题描述
```
Uncaught ReferenceError: key is not defined
```
![在这里插入图片描述](../../../../img/前端/2022年/5月/Uncaught%20ReferenceError%20key%20is%20not%20defined/1.jpeg)

---

# 原因分析：
## 我不能理解
要是先就地声明一下, 这样写就没问题:

```javascript
for(let key in data.newArr) {
  console.log(data.newArr[key])
}
```

但为什么用item就不需要声明呢...

```javascript
for(item in data.newArr) {  //为啥item就行用key就不行啊我超???
  console.log(data.newArr[item]);
}
```



