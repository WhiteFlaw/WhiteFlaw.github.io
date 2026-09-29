---
title: property ‘modelViewMatrix‘ is a read-only and non-configurable data property
date: 2023-06-13
cover: /img/d1.webp
desc: property ‘modelViewMatrix‘ is a read-only and non-configurable data property
tags: [CSS, 前端]
sticky: false
---

# 项目场景：
这是一个Vue3+Three.js的项目, 使用了setup语法糖.


---

# 问题描述
我选择封函数而没有直接在onMounted初始化, 觉得那样不是很美观.
初始化函数`initScene()`并未出错, `render`时报错:
```
Uncaught (in promise) TypeError: 
'get' on proxy: 
property 'modelViewMatrix' is a read-only and non-configurable data property on the proxy target but the proxy did not return its actual value (expected '#<Matrix4>' but got '#<Matrix4>')
```
并警告:
```
[Vue warn]: Unhandled error during execution of mounted hook 
```

---

# 解决方案：
问题在于我引入了`reactive`对three的变量进行了响应式处理, 把它们都放进了data对象里, 就像这样:
```javascript
let data = reactive({
  scene: null,
  camera: null,
  renderer: null,
  container: null,
  controls: null
})
```

上面的错误信息也提到有某处获取到的矩阵并不是矩阵真正的值, 可以推断是从data对象中获取到的, 经过reactive处理过的一些值出现了问题.
改回来就好了, 不要做响应式处理, 这些three相关值也没必要做响应式:
```javascript
let scene =  null;
let camera = null;
let renderer = null;
let container = null;
let controls = null;
```
---