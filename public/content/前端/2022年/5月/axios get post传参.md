---
title: axios get post传参
date: 2022-05-27
cover: /img/d3.webp
desc: axios get post传参
tags: [JavaScript, 前端]
sticky: false
---

@[TOC](文章目录)

---

# 前言
最近更改Node接口时遇到了一些问题, 比如前端以何种方式传参, 后端用何种方式接收等等...
今天花了一小段事件测试了一下, 整理一下结果吧.

---


# 一、GET
## 后端接收query
前端传params.
前端:
```javascript
axios({
  method: "get",
  url: "http://localhost:3000/getArticleById",
  params: {
    article_id: 8,
  },
}).then((res) => {
  console.log(res);
});
```

后端:

```javascript
app.post('/getArticleById', (req, res, next) => {
  api.getArticleById(req, res, next);
})
```
```javascript
getArticleById(req, res, next) {
  console.log("body:" + req.body.article_id)
  console.log("params:" + req.params.article_id);
  console.log("query:" + req.query.article_id);
  return;
},
```
后端输出:
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/f5cc2575dbc932ccc7ac9d3857db766b.png)

---

# 二、POST

## 1.后端接收body
前端传data.
前端:
```javascript
axios({
  method: "post",
  url: "http://localhost:3000/getArticleById",
  data: {
    article_id: 8,
  },
}).then((res) => {
  console.log(res);
});

/* 
等同于
axios.post("http://localhost:3000/getArticleById", {
  article_id: 8
}).then()
*/
```
后端: 

```javascript
app.post('/getArticleById', (req, res, next) => {  //文章页文章请求
  api.getArticleById(req, res, next);
})
```

```javascript
getArticleById(req, res, next) {
  console.log("body:" + req.body.article_id)
  console.log("params:" + req.params.article_id);
  console.log("query:" + req.query.article_id);
  return;
},
```
后端输出:
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/4def53de1835184f2f4c0cb3e375a42f.png)

---

## 2.后端接收query
前端传params.
前端:

```javascript
axios({
  method: "post",
  url: "http://localhost:3000/getArticleById",
  params: {
    article_id: 8,
  },
}).then((res) => {
  console.log(res);
});
```

后端:

```javascript
app.post('/getArticleById', (req, res, next) => {  //文章页文章请求
  api.getArticleById(req, res, next);
})
```

```javascript
getArticleById(req, res, next) {
  console.log("body:" + req.body.article_id)
  console.log("params:" + req.params.article_id);
  console.log("query:" + req.query.article_id);
  return;
},
```
后端输出:
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/89406b0d8ba8d401057593a8cb5ab9aa.png)

---

## 3.前端传params
这个方法来自于一位大佬, 传送门: [post像get一样使用params传参](https://blog.csdn.net/qq_31126175/article/details/99644257)
前端:
```javascript
axios({
  method: 'post',
  url: "http://localhost:3000/getArticleById",
  params: {
    article_id: 8
  }
}).then((res) => {
  console.log(res);
})
/*
等同于
axios
  .post("http://localhost:3000/getArticleById", null, {
    params: { article_id: 8 },
  })
  .then((res) => {
    console.log(res);
  });
*/
```
后端:

```javascript
app.post('/getArticleById', (req, res, next) => {  //文章页文章请求
  api.getArticleById(req, res, next);
})
```

```javascript
getArticleById(req, res, next) {
  console.log("body:" + req.body.article_id)
  console.log("params:" + req.params.article_id);
  console.log("query:" + req.query.article_id);
  return;
},
```
后端输出:
![在这里插入图片描述](../../../../img/前端/2022年/5月/axios%20get%20post传参/1.png)

---

# 总结
复习一波, 以后遇到别的需求再回来补全...