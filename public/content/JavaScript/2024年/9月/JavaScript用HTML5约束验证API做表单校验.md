---
title: JavaScript用requestAnimationFrame与定时器做节流
date: 2024-09-28
cover: /img/d6.webp
desc: JavaScript用requestAnimationFrame与定时器做节流
tags: [JavaScript, 前端]
sticky: false
---

# 一、验证属性与通过与否
以下为在表单元素上的可用属性：

```javascript
required<boolean> 必填字段，接受布尔值，默认false
pattern<string> 接受正则，用户输入的文本必须满足该正则
```
表单元素对象上有`checkValidity()`方法，其返回布尔值，可以由表单子元素调用以验证单个子元素值是否通过验证:

```javascript
if(document.form[0].element[0].checkValidity()) {}
```
也支持由表单调用验证全表单:

```javascript
 if(document.form[0].checkValidity()) {}
```
该方法只返回布尔值以反映验证通过与否. 

---

# 二、获取验证失败的原因
那么如何得知不通过的原因？
validity属性反应不通过的原因，该属性也由表单元素对象暴露. 

```javascript
if(formEle.validity) {
  console.log(validity);
}
```

该属性可能的值及值的意义如下:
```javascript
customError: 若设置了setCustomValidity()则返回true否false
pattenMismatch: 字段值不符合pattern正则的要求
rangeOverflow: 字段值大于max值返回true.
rangeUnderflow: 字段值小于min值返回true
stepMismatch: 字段值与min、 max、step值不相符则返true
toolong: 字段值长度超过maxlength值返true
valid: 如其他属性值都为false返true
valueMissing: 有required必填项未填返true
typeMismatch: 返回true表示字段值并非email或url属性要求的格式
```

例:

```javascript
if(formEle.validity.valueMissing) {
  console.log("required value missing.");
}
```

---

# END
如有疏漏，请为我指正，谢谢. 