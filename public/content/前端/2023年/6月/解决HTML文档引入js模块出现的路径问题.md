---
title: 解决HTML文档引入js模块出现的路径问题
date: 2023-06-12
cover: /img/d1.webp
desc: 解决HTML文档引入js模块出现的路径问题
tags: [CSS, 前端]
sticky: false
---

@[TOC](文章目录)

---

# 前言
JS抽离, 引入three模块.
LiveServer报错:
```
Uncaught TypeError: Failed to resolve module specifier "three".
Relative references must start with either "/", "./", or "../".
```
事实上我已经数不清这是第多少次遇到这种问题了, 用HTML文档写一些库的案例, 然后各种引入报错, 找不到包之类.
只是这次的问题解决让我印象颇深, 也收获颇丰.

---

# 一、错误情况
## 1.three引入
html:
```html
<script src="./js/main.js" type="module"></script>
```

JavaScript:
```javascript
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
```

## 2.gsap引入
没有在html文档做操作, 直接npm下包在js文件引入:
```javascript
import gsap from 'gsap';
```

结果就是两个都没能成功引入.

---

# 二、解决办法
路径没有写错, 只能说打包之后路径错误找不到某个模块了.

当导入`JavaScript`模块时, `import`语句和`import()`运算符都有一个"模块标识符", 其指示要导入的模块. 浏览器根据此标识符解析出绝对路径, 才能成功导入.

导入映射（import map）是一个 JSON 对象, 其允许开发者在导入 JavaScript 模块时, 控制浏览器如何解析模块标识符. 它提供了在 import 语句或 import() 运算符中用作模块标识符的文本, 其会在解析标识符时与要替换的文本之间建立映射.

在HTML文件增加以下来协助浏览器正确解析模块标识符, 这段代码可以在three.js源码的example任意一个案例中找到.
第一个映射修正three模块的路径, 第二个修正OrbitControls等附加模块的路径.
```html
<script type="importmap">
  {
    "imports": {
      "three": "../../node_modules/three/build/three.module.js",
      "three/addons/": "../../node_modules/three/examples/jsm/"
    }
  }
</script>
```
three的引入问题在于路径错误, LiveServer最后是需要找到`three.module.js`, three的其他附加模块需要找到jsm.
OrbitControls这种不在three.module.js内的模块导入, 可以在不配置importmap内three/addons/的情况下:
```javascript
import { OrbitControls } from '../../node_modules/three/examples/jsm/controls/OrbitControls.js';
```
实际上就是把importmap里的内容直接写到了js里.

但是对于three.module.js这种一次性导出多个类的文件就只能写在importmap里了.

---

gsap引入失败的问题在于HTML文档里是不能直接这样:
```javascript
import gsap from 'gsap';
```
引入使用的.

需要先配置importmap:
```html
<script type="importmap">
  {
    "imports": {
      "gsap": "../../node_modules/gsap/index.js"
    }
  }
</script>
```
然后再:
```javascript
import { gsap } from 'gsap';
```
路径不固定, 只要引导到index.js即可.

或者不配置importmap, 直接js文件里这样写:
```javascript
import { gsap } from '../../node_modules/gsap/index.js';
```

---

# 总结
--