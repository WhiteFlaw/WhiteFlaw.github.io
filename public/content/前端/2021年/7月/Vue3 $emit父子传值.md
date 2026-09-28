---
title: Vue3 $emit父子传值
date: 2021-04-14
cover: /img/d1.webp
desc: Vue3 $emit父子传值
tags: [Vue, 前端]
sticky: false
---

@[TOC](文章目录)

---

# 前言
封装组件会需要暴露一些事件，比如在翻页时触发某个事件，根据这个事件在父组件回调方法就可以在事件发生时进行相应的处理，这需要子组件暴露出事件。

另外一些时候我们需要获取子组件的某些值，来在父组件内进行操作，科学一点的请求模式是把所有子组件的请求集中在父组件请求，减少请求量，那么子组件必然要提供请求所需要的数据，这需要子传父传值。

这些，emit都可以完成。

---

# 一、暴露组件事件
这个比较简单一些，我用一个自己封装的翻页组件来说明，情况是在子组件的< li></ li>中点击了“删除”, 就要拿到文章id，发送请求进行数据库记录删除。
![在这里插入图片描述](../../../../img/前端/2021年/7月/Vue3%20$emit父子传值/1.jpeg)
那么li是v-for生成的，文章i名和id是放在一起的，我们直接拿就行了：

```html
<!--多余的已经删掉,剩下的是我们需要的逻辑 -->
<li
  v-for="item in data.user_article_content"
  :key="item"
>
<p>{{ item.article_title }}</p>
<span
  @click="deleteArticle(item.article_id)"
>删除
</span>
</li>
```
然后我们要做的其实很简单, 就是在setup里像平常那样写方法.

```javascript
import { reactive } from "vue";
export default {
  setup(props, { emit }) {
    let data = reactive({});

    const deleteArticle = (id) => {
      console.log(id)
      //在这里成功传出id之后,父组件接收不需要传进去参数,
      //直接调用函数,不用写形参,直接函数内输出id就可以拿到
    };
    return {
      data,
      deleteArticle,
    };
  },
};
```
然后我们要暴露出"文章删除被点了"这个事件,那就是要在deleteArticle这个方法执行的时候把事件用emit发送到父组件.
那么
唯二不同的, 就是在子组件事件函数最后emit要发送的事件名,以及要传出去的数据:
```javascript
const deleteArticle = (id) => {
   emit("deleteArticle", id);
   //emit("时间名", 要发的数据);
};
```
并且在export default里:

```javascript
emits: ["deleteArticle"],
```
表明要暴露出去的事件,可以写多个, 逗号隔开.

---

# 二、父组件响应
就像正常对事件做出反应那样就可以, @click="xxx", 嗯?
父组件:
```html
<sy-pagination
  @deleteArticle="deleteArticle"
>
></sy-pagination>
```

```javascript
const deleteArticle = (id) => {
  axios.post("http://xxx/xxx/delArticle", { article_id: id })
    .then((result) => {
      if (result.status == true) {
        ElMessage.success(result.data.msg);
      } else {
        ElMessage.error(result.data.msg);
      }
    });
};
```

---

# 总结
2022-4-28, 重写了一下, 我自己看着都费劲....
另外那时候的技术也有点过时.

如果它能帮到您, 我很高兴:)