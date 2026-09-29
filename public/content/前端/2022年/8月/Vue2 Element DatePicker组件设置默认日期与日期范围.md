---
title: Vue2 Element DatePicker组件设置默认日期与日期范围
date: 2022-08-23
cover: /img/d1.webp
desc: Vue2 Element DatePicker组件设置默认日期与日期范围
tags: [CSS, 前端]
sticky: false
---

@[TOC](文章目录)

---

# 前言
以前都是做练习, 上周拿到这个任务直接被卡住...

---


# 一、设置默认日期
## 1.不要用placeholder
依然不使用`placeholder`属性, 在`v-model`初始就绑定了时间的情况下, 组件可以识别并自动切换到对应日期, 使用`placeholder`其实是无效的.
`placeholder`展示的值并不是绑定在data中的属性上的, 即便设置, 初始状况下也无法获取值.

```html
<el-date-picker
  v-model="date"
  format="yyyy-MM-dd"
>
<!-- :placeholder="date" -->
</el-date-picker>
```

```javascript
data() {
  return {
    date: '2017-01-01'
  };
},
```
这样也是照常显示日期, 另外提醒就是`format`不要全大写, 会没法切换日期.

另外:
`format`: datePicker以何种格式展示时间
`value-foramt`: detePicker的值为何种格式(从data中直接取到的值为何种格式)

```html
<template>
  <div>
    <el-date-picker v-model="date" format="yyyy-MM-dd" value-format="yyyyMMdd">
    </el-date-picker>
    {{ date }}
  </div>
</template>
```

```javascript
data() {
  return {
    date: "20020807",
  };
},
```
![在这里插入图片描述](../../../../img/前端/2022年/8月/Vue2%20Element%20DatePicker组件设置默认日期与日期范围/1.png)
合理使用免除一些不必要的数据处理.

---

## 2.设置动态的默认日期
还是利用`v-model`, 可以利用时间对象`new Date()`的辅助.

```html
<el-date-picker
  v-model="date.createDate"
  format="yyyy-MM-dd"
></el-date-picker>
```

```javascript
data() {
  return {
    date: {
      createDate: new Date(),
    },
  };
},
```
不过你可能并不想每次拿数据都到`date.createDate`里去拿, 所以数组也是可以的
```javascript
data() {
  return {
    date: [ new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate() ]
  };
},
```
如果数组取值形式也不能满意, 那就把表达式抽离出来, 然后你可以在`mounted`或者`created`周期把它赋值给`data`里绑定的那个属性, 就像这样:

```javascript
data() {
  return {
    date: "",
  };
},
created() {
  this.initDate();
},
methods: {
  getDate() {
    return (
      new Date().getFullYear() +
      "-" +
      (new Date().getMonth() + 1) +
      "-" +
      new Date().getDate()
    );
  },
  initDate() {
    this.date = this.getDate()
  },
 },
};
```

---

# 二、限制日期选取
`dateRange`模式下也是一样的.
## 1.方案
不是用`disabled`属性来做这个, 刚开始用的时候迷糊了...
使用`pickerOptions`属性来达到这个目的, `pickerOptions`绑定的函数对象里有`diabledDate`函数类型, 这个函数可以接受一个参数在运算中作为当前日期(这个参数一般会写作`time`), 而函数内的表达式返回`true`时, `datePicker`会根据表达式来对日期进行限制选择(就是有些日期会变成灰色不可选).
| 属性 | 说明 |
|--|--|
| shortcuts | 设置快捷选项(就是日期选择表左边的快捷选项)，需要传入 { text, onClick } 对象 |
| disabledDate | 设置禁用状态，参数为当前日期，要求返回 Boolean |
| firstDayOfWeek | 周起始日 |
| onPick | 选中日期后会执行的回调，只有当 daterange 或 datetimerange 才生效 |

但是这个属性本身只需要一个对象, 不管你做什么, 你最后给它一个对象就好了, 你可以先在data里准备好这个对象, 然后在里面搞一个`disabledDate`属性, 但是的`disabledDate`属性的值一定得是个函数, 还得能返回`Boolean`.

---

## 2.举例
比如这样:
```html
<el-date-picker
  v-model="date"
  format="yyyy-MM-dd"
  :picker-options="limitDate"
></el-date-picker>
```

```javascript
data() {
  return {
    date: "",
    
    limitDate: { 
    // 一个与picker-options绑定的对象, 和它内部的函数类型disabledDate属性
      disabledDate: this.doLimitDate
    },
    
  };
},
methods: {

  doLimitDate() { // 一个能返回Boolean的函数
    this.limitDate.disabledDate = (time) => { // time为当前日期, disabledDate自带参数
      return (time.getTime() + 24 * 3600 * 1000) > Date.now()
    };
  },

},
```

或者这样:
嗯...我觉得可以尝试直接返回一个内含`可返回布尔值的函数`的`对象`?
```html
<el-date-picker
  v-model="date"
  format="yyyy-MM-dd"
  :picker-options="limitDate"
></el-date-picker>
```

```javascript
data() {
  return {
    date: "",
  };
},
computed: {

  limitDate() { 
    return {
      disabledDate:(time) => { // time为当前日期, disabledDate自带参数
        return (time.getTime() + 24 * 3600 * 1000) > Date.now();
    };
  }
}
```
效果都是一样的, 在我的黑暗模式下不太明显, 调回来会清晰一些:
![在这里插入图片描述](../../../../img/前端/2022年/8月/Vue2%20Element%20DatePicker组件设置默认日期与日期范围/2.png)
你可以看到未达到的日期都是灰色, 不可选的.

---

# 总结
还好吧, 我前几天一直很焦虑, 分给我的任务做的很慢, 很多组件的用法都是第一次尝试, 然后项目也不熟悉, 公共组件和方法用起来也是磕磕绊绊然后接口又出了问题, 啊——! 总之结果就是我做的很慢...
然后我就很焦虑我会不会被开, 啊哈哈, 对, 被开掉.
今天领导找我谈话说你刚开始做的慢点不要紧, 我总算是稍微心安一点了.