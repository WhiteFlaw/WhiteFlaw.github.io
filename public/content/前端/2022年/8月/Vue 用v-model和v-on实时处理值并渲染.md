@[TOC](文章目录)

---

# 前言
今天看项目看到的一个写法, 虽然不是多麽高深, 但是感觉挺巧妙的.

---


# 正题
限制输入框禁中文, 限制字数20, 自动转大写, 函数`limitInputValue`接收值原始返回处理后的值;
这个转换函数返回一个值, 监听输入, 每次字符增加都被监听, 然后新的值被传入处理函数实时处理后再返回结果重新赋值到`le-input`.

```html
<el-input
  v-model="[v-model绑定的变量]"
  @input="[v-model绑定的变量]=[有返回值的函数的名]( [v-model绑定的变量], 可选函数参数 )"
></el-input>
```

示例: 
```html
<el-input
  v-model="formData.inputValue"
  @input="formData.inputValue=limitInputValue( formData.inputValue, 20, true, false, true )"
></el-input>
```

---

# 总结
偶然看到的一个小方法, 希望也帮到了你.