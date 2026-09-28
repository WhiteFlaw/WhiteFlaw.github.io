---
title: WHATWG API——url.parse()的替代方案
date: 2021-10-23
cover: /img/d1.webp
desc: WHATWG API——url.parse()的替代方案
tags: [CSS, 前端]
sticky: false
---

@[TOC](文章目录)

# 前言
你可能已经了解到官方废弃(不鼓励使用)url.parse() 方法的事了. 
由于 url.parse() 方法使用一种宽松的非标准算法来解析网址字符串，因此可能会引入安全问题。 具体来说，已经确定了主机名欺骗以及用户名和密码处理不当的问题。
这个新的替代语法也不复杂 如果你只打算拆解URL来获取到数据, 新的方法只比url.parse()长个一两句, 但却能换来更安全的环境;

# Why WHATWG API?
针对url.parse()的问题, 使用了更加具有选择性和精确度的方法选择编码字符以应对复杂的URL和用户信息, 主机.
为此它们重新弄了四个编码集来提升精确度:

| 编码集 | 作用 |
|--|--|
| C0控制的百分比编码集 | 用于解决特定条件下的主机和路径; |
| 片段百分比编码集 | 用于处理网址片段; |
| 路径百分比编码集 | 用于处理大多数网址路径 |
| userinfo编码集 | 专用于处理网址编码中的用户信息 |

加持下, WHATWG API不仅仅是弥补了url.parse()的缺点, 在某些方面甚至强过url.parse();

# 使用
有两个参数可供传入:
| 参数 | 说明 |
|--|--|
| 参数一 | 一个URL中的文件路径(相对地址). |
| 参数二 | 一个标准的URL, 得是带"http://"或"https://"的这种绝对地址, 可能要费点心思拼接. |

参数二可选, 当第一个参数为相对地址时才应当传入参数二.

公式:
```javascript
const 自定义名 = new URL([相对地址], [URL]);
console.log(自定义名.属性之一);
console.log(自定义名.属性之一);
```
例:

```javascript
    const { url } = req;
    const { host } = req.headers;
    const myURL = new URL(url, `http://${host}`);
    console.log("这是req:" + req);
    console.log(url);
```
![在这里插入图片描述](../../../../img/后端/2021年/11月/WHATWG%20API——url.parse()的替代方案/1.jpeg)

变量外面套大括号:
不加括号相当于把req对象赋给局部变量host
加了相当于把req的对象里名字叫做header的属性的值拿出来，assign给本地的变量host

在进行URL解析后, 依旧可以通过以前的方法来从解析结果里拿到想要的数据,
只不过有些属性名和以前不同了...
| 属性 | 说明 |
|--|--|
| hash | 获取/设置"#"后的内容 |
| host | 获取/设置URL的主机部分 |
| hostname | 获取/设置URL的主机名部分 |
| href | 获取/设置传入的整个URL |
| origin | 获取/设置协议, 服务器名和域名即URL中文件前的部分 |
| username | 获取/设置URL的用户名部分 |
| password | 获取/设置URL的密码部分 |
| pathname | 与origin截然相反,获取/设置文件路径,且不会带上乱七八糟的传值字段 |
| port |  |
| protocol |  |
| search | 获取/设置"?"后的序列化部分 |

属性获取 例:

```javascript
const myURL = new URL('https://baidu.com/foo/foolish?234444&dwdwdbwdwd');
console.log("href: " + myURL.href);
console.log("origin: " + myURL.origin);
console.log("host: " + myURL.host);
console.log("hostname: " + myURL.hostname);
console.log("pathname: " + myURL.pathname);
console.log("protocol: " + myURL.protocol);
console.log("search: " + myURL.search);
/* console.log("username: " + myURL.username);
console.log("password: " + myURL.password);
console.log("port: " + myURL.port);
console.log("hash: " + myURL.hash); */
```
结果:
![在这里插入图片描述](../../../../img/后端/2021年/11月/WHATWG%20API——url.parse()的替代方案/2.jpeg)
因为URL里没有某些部分的内容, 所以后面4句没有进行输出.

<hr style=" border:solid; width:100px; height:1px;" color=#000000 size=1">