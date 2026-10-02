---
title: Vue2 Element表格表单的写法
date: 2022-08-13
cover: /img/d1.webp
desc: Vue2 Element表格表单的写法
tags: [Vue, 前端]
sticky: false
---

@[TOC](文章目录)

---

# 前言
我需要整理一下表单验证和表格, 我们的项目里大量的使用了它们, 我应该形成一个模式去套用而不是像现在这样边构思边写.

---

# 一、表格
还好后端返回的数据通常规范好用, 不是一些奇形怪状的结构.

## 1.表头生成
表头创建, 最少需要知道表头要写的字(`label`)和该表头下该列出何种数据, 大部分时候这两者不能够相同, 所以我觉得如果需要使用`v-for`去创建表头的话, 应当创建包含多个"`label`值和`prop`值构成的对象"的数组, 就像这样:

```html
<el-table-column
  :label="item.labels"
  :prop="item.props"
  v-for="(item, index) in tableHead"
  :key="index"
>
</el-table-column>
```

```javascript
tableHead: [
  { labels: "tableEvent1", props: "column1" },
  { labels: "tableEvent2", props: "column2" },
  { labels: "tableEvent3", props: "column3" },
],
```
完成表头创建后, 数据会根据表头绑定的`prop`属性将`数据源对象`中匹配的属性的值在该列下渲染出来, 比如`prop`绑定了"data1", 那么渲染数据源中每一条记录的"data1"属性值到该列.
所以表格一定得绑定一个数据源,
做的时候, `prop`可能会是遍历出来的, 保证`prop`和数据源中的属性值匹配即可.

---

## 2.数据源和表头数组分离
然后数据源需要从后端请求, 如果数据源和表头放在一个结构里, 也不是不可以, 但是数据请求过来之后要在前端进行大量赋值操作和额外的数据结构处理操作, 我并不喜欢这样.

所以数据源单独开一个变量, 后端返回的数据一般会是这种格式:
```javascript
dataOri: [
  {
    column1: "11",
    column2: "12",
    column3: "13",
    column4: "14",
    column5: "15",
  },
  {
    column1: "21",
    column2: "22",
    column3: "23",
    column4: "24",
    column5: "25",
  },
  {
    column1: "33",
    column2: "32",
    column3: "33",
    column4: "34",
    column5: "35",
  }
],
```

我做的第一个任务就是用表格展示数据, 那个表格只需要展示一组数据就好, 也就是一行, 因为是个查询系统, 每次查询只能有一个结果.
起初想当然的使用了`table`, 但是表头多表格很长, 效果不是很好最后改用了`description`.
我觉得有点离谱的是那个表格里面需要用`input`展示数据, 对, 要用`slot-scope=scope.row`去获取数据然后放到`input`的`value`上.

```html
<el-table :data="dataOri">
  <el-table-column
    :label="item.labels"
    :prop="item.props"
    v-for="(item, index) in tableHead"
    :key="index"
  >
    <template slot-scope="scope">
      <input type="text" :value="scope.row[item.props]" @input="xxx(scope)" />
    </template>
  </el-table-column>
</el-table>
```
![在这里插入图片描述](../../../../img/前端/2022年/8月/Vue2%20Element表格表单的写法/1.png)

---

# 二、表单自动校验
表单验证, 我不太熟悉了.

## 1.ref
如果需要表单即时验证, `el-form`需要加`ref="xxx"`, 这样通过xxx拿到表单才能调用`validate()`.

`ref`不需要与`model`相同, 已经测试过.

---

## 2.表单数据对象
`el-form`必须绑定一个表单数据对象, 这个大对象用于储存表单各个收集项的值

```html
<el-form ref="ruleForm" :model="formValues">
  <el-form-item>
    <el-input v-model="formValues.inputValue"></el-input>
  <el-form-item>
  <el-form-item label="需要餐具" prop="checkbox">
    <el-checkbox v-model="formValues.type" name="fork"></el-checkbox>
  </el-form-item>
</el-form>
```

```javascript
export default {
  name: "form_pra",
  data() {
    formValues: {
      inputValue: "",
      type: false
    }
  }
}
```

---

## 3.校验项
使用`prop`绑定校验项之前务必确定`el-form`绑定了`rules`.

校验项的`label`依旧只负责呈现, `prop`只用来匹配校验规则;

每一个待校验项都应该有`prop`属性加在待校验项的`el-form-item`上, `prop`属性的值应当与该项的校验规则名对应.

```html
<el-form ref="formName" :model="formValues" :rules="rules">

  <el-form-item label="活动形式" prop="inputA">  <!-- 该项用inputA规则校验 -->
    <el-input v-model="formValues.inputValue"></el-input>
  </el-form-item>
  
  <el-form-item label="需要餐具" prop="checkbox">  <!-- 该项用checkbox校验 -->
    <el-checkbox v-model="formValues.type" name="fork"></el-checkbox>
  </el-form-item>
  
</el-form>
```

```javascript
rules: {
  inputA: [  //inputA校验规则
    { required: true, message: "请输入活动名称", trigger: "blur" },
    { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
  ],
  checkbox: [  //checkbox校验规则
    { required: true, message: "请选择活动区域", trigger: "change" },
  ],
}
```

比如input的校验规则为inputA, 那么input的prop应当为inputA.
记得校验规则名字不要用关键字, 保留词, 也不要用`name`(这是个js全局变量);

# 2022-8-14补
我要纠正一个我的误区, 表单校验有两种方式.
我现在用的这种校验规则里不含`validator`属性的方法, 按照校验规则提供的常用校验项去校验的普通校验.
另一种方法是按照自定义的函数去校验, 这种方法的校验规则里会出现`validator`属性, 值应为自定义的`validate`校验函数(当然, 叫什么名自定);

```javascript
methods: {
  var validatePass2 = (rule, value, callback) => {
    if (value === '') {
      callback(new Error('请再次输入密码'));
    } else if (value !== this.ruleForm.pass) {
      callback(new Error('两次输入密码不一致!'));
    } else {
      callback();
    }
  };
}
rules: {
  checkPass: [
    { validator: validatePass2, trigger: 'blur' }
  ],
}
```

因为都是validate校验的范畴, 所以最后依然都需要用`ref`获取表单对象调用`validate()`

---

# 总结
提示：这里对文章进行总结：
例如：以上就是今天要讲的内容，本文仅仅简单介绍了pandas的使用，而pandas提供了大量能使我们快速便捷地处理数据的函数和方法。