---
title: 微信小程序properties组件传值
date: 2022-06-05
cover: /img/d7.webp
desc: 微信小程序properties组件传值
tags: [前端]
sticky: false
---

@[TOC](文章目录)

---

# 前言
Vue里```props```的全称为```property```
而```property```的复数形式即微信小程序中的```properties```, 二者的使用方法也极为相似...

---

# 一、子组件准备接收
点击NavBar的项, 触发handleTap函数, 向handleTap函数内传入受点击NavBar项的index.
```html
<view class="box">
  <view 
    wx:for="{{list}}" 
    wx:key="item" 
    class="item {{currentClick === index ? 'active' : ''}}" 
    bindtap="handleTap" 
    data-currentClick="{{index}}"
  >{{item}}</view>
</view>
```

然后js这边handleTap被触发, ```data-```拿到活跃的index, 赋值给data里的currentClick拿到当前受击项的index, currentClick改变, wxml那边三元表达式判定`currentClick===index`, 然后把active类名加到激活项上.

```javascript
//NavBar.js
Component({         //这个Components只有组件的js文件才有
  properties: {     //类比props,陈列父组件向子组件传入的属性, 即在此处接收父组件传值
    list: {         //list可以像data数据一样被Navbar使用
      type: Array,  //type可接受的类型, 要允许多种类型可用数组
      value: ["event1", "event2"]  //default默认值, 接收不到值时默认用
    }
  },
  data: {     //组件数据, 固定数据写在这
    currentClick: 0
  },
  methods: {  //书写组件方法
    handleTap(evt) {
      var currentclick = evt.target.dataset.currentclick
      this.setData({
        currentClick: currentclick
      })
    }
  }
})
```

---

# 二、父组件传值
以下在父组件内完成:

```html
<navbar list="{{['衣服', '裤子', '帽子']}}"></navbar>
<!--
其实这里写父组件的data里的属性也是可以的, 比如:
<navbar list="{{datalist}}"></navbar>
 -->
```
然后, 也可以像Vue里那样动态传值, 用双向绑定:

```javascript
//父组件js里有datalist的情况下
<navbar model:list="{{datalist}}"></navbar>
```

---

# 总结
希望能帮上忙
[微信小程序 组件传值(二) triggerEvent 子传父](https://blog.csdn.net/qq_52697994/article/details/125133145)