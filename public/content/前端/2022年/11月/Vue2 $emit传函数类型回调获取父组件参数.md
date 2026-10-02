---
title: Vue2 $emit传函数类型回调获取父组件参数
date: 2022-11-08
cover: /img/d1.webp
desc: Vue2 $emit传函数类型回调获取父组件参数
tags: [Vue, 前端]
sticky: false
---

@[TOC](文章目录)

---

# 前言
$emit传函数类型_进行回调以获取父组件参数.

---


# 一、父组件
父组件一定要给回调函数写一个形参, 然后在需要调用回调函数的时候将形参以函数调用形式调用, 这个形参不一定非要是'callback', 它只是一个占位的东西.
```javascript
async A074MAddReq(params, callback) {
  const res = await A074MDoAdd(params)
  if (res === 'Y') {
    callback(res)
  }
},
```

---

# 二、子组件
昨天遇到的一个问题, 其实也不是问题吧, 就是我想偷个懒...
本来写的是`$emit`之后直接清空数据对象, 结果发现异步了, `$emit`之前就给清了...

那怎么办, 就为了这点事父组件请求完还要传个值回来告诉你可以上了? 如果能回调, 稳定在`$emit`之后清数据对象那是最好了, 尝试传个函数类型进去.

好, 不执行.
得在父组件里调一下, 那应该也可以传参.
```javascript
handleEnsure() { // 事件: 确认
  this.$refs['A074MAddForm'].validate((valid) => {
    if (valid) {
    
      this.$emit('A074MAddReq', this.A074MAddForm, (res) => {
        if (res === 'Y') {
          for (const key in this.A074MAddForm) {
            this.A074MAddForm[key] = ''
          }
        }
      })

    }
  })
}
```
只是传一个函数类型作为参数, 放在`$emit()`最后一个参数传过去看着会好看一些, 放第几个都无所谓, `$emit`的参数在该处是一个接收`any`类型的`...argument`.

```javascript
interface ComponentPublicInstance {
  $emit(event: string, ...args: any[]): void
}
```

```javascript
const callbackParent = () => {
  emit(
    "callback",
    (res) => {
      console.log(res);
    },
    80
  );
};
```

这种方法好处是可以避免由时间差造成的各种问题, 比如子组件渲染前没拿到值.
用回调函数的话, 只要在正确的时间, 在父组件中回调函数并传参.

---

# 总结
--