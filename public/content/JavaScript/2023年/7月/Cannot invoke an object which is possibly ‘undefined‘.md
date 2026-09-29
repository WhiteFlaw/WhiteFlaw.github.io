---
title: Cannot invoke an object which is possibly ‘undefined‘
date: 2023-07-15
cover: /img/d1.webp
desc: Cannot invoke an object which is possibly ‘undefined‘
tags: [CSS, 前端]
sticky: false
---

# 项目场景：
我用Props在子组件接受父组件传来的函数, 并向函数内传参调用.

---

# 问题描述
TS解析时认为props内的这个函数可能会是undefined, 所以直接报错.


---

# 原因分析：
这个函数在beforeCreate周期之前确实是undefined, 那时候props都还不能用.

---

# 解决方案：
有两种方法.

一种是TS类型断言法, 如果是函数的话, 需要在括号前加"!"断言其不为空:
加在括号后就成了断言函数返回值了...
```javascript
props.addToDo!(todo);
```

另一种方法, 直接在前面做手动检查:
```javascript
if (!props.addToDo) throw new Error("addToDo not find");
props.addToDo(todo);
```