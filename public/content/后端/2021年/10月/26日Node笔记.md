---
title: 26日Node笔记
date: 2021-10-23
cover: /img/d1.webp
desc: 26日Node笔记
tags: [CSS, 前端]
sticky: false
---

@[TOC](文章目录)

<hr style=" border:solid; width:100px; height:1px;" color=#000000 size=1">

# 前言
NodeJS是一种基于 Google V8引擎的JS运行环境, 相比于其他服务器语言构建的环境, 其在应对高并发方面具有很大的优势, 这源于其特殊的运作方式, 在有新的用户接入时, 其将不会为该用户创建新的线程而是仅触发一次内部事件, 使得NodeJS程序在宏观上是并行的.

NodeJS虽然在前端和小型系统开发方面拥有绝对的优势,但在其他方面依然存在一些缺点(我对后端了解不多就不细说了), 所以NodeJS与Java, Python等传统的后端语言之间并不是上下位的关系.

NodeJS采用commonJS作为模块规范(NodeJS中将每个文件看作一个模块,强调各模块共享方法之类, 我想Vue的模块化该是起源于此), 而commonJS致力于制定JavaScript标准库,将JavaScript打造为一种"什么都能写"的语言, 我想, 或许这是NodeJS能够在涵盖基本后端功能的基础上向外扩展, 在云计算, 游戏开发, 桌面应用开发和即时通讯等领域开枝散叶的原因...

<hr style=" border:solid; width:100px; height:1px;" color=#000000 size=1">

# 一、核心模块
核心模块是NodeJS自带的一些模块(但是自带模块不一定是核心模块), 在安装NodeJS后可以直接引入文件使用, 包含http, url, path等.

## 1.http模块
### 创建服务器 createServer()
这个语法的存在注定了NodeJS不需要使用服务器, 使用nodeJS时我们不仅仅在实现一个应用,还在实现整个http服务器.

公式:

```javascript
const http = require('http');
http.createServer([可选参数options], 回调函数).listen(端口号);
```
然后这个回调函数里是有讲究的, 可以用writeHead在里面设置响应头, 用write()向页面内写入语句(可以写HTML, 浏览器会解析它们的), 但是end()是必须写的:

```javascript
http.createServer((req, res) => {
res.writeHead(200, {"Content-type": "text/html;charset='utf-8'"});
res.write("<head><mata charset='utf-8'></head>");
res.write("<p>HelloWorld</p>");
res.end("响应完成");
})
```
end()如果配合readFileSync()使用, 可以向res.end()内传入返回的文件内容data用以生成页面(这样的话就相当于执行了一次res.write()), 就像这样:

```javascript
http.createServer(function (req, res) {
    res.writeHead(200, { 'Content-Type': ''+ mime + ';charset="UTF-8"' });
    res.end(data); 
    //假装你已经从readFileSync()方法中同步读取到了文件内容...
}).listen(3000);
```
你可以在createServer()的回调函数里写上一堆方法, 里面读取并渲染相应的页面, 这就会像一个Vue路由表, 一旦用户发送请求, createServer()就会执行, 然后依据用户去到的URL来决定要执行哪个方法, 渲染哪个页面. 
这也是NodeJS比较基本的路由的工作原理...

<hr style=" border:solid; width:100px; height:1px;" color=#000000 size=1">

## 2.url模块
### 解析URL url.parse()
官方最终因为安全性和实用性问题宣布弃用url.parse(), 但我不得不承认它是个既好用又方便的方法.
[url.parse替代方案点此](https://blog.csdn.net/qq_52697994/article/details/121096520)

只需要传入一个URL给它, 就能把URL拆分成各个部分, 然后我们就可以通过它的各个属性来获取我们需要的那部分URL了, 比如我只需要URL里传的值, 我只需要: url.parse().query 就可以获取到一个存储着一堆键值对的对象, 而url.parse().pathname则是存储着URL中文件路径的终点, 比如我在/news页面, 那pathname属性就会是"/news";

公式:

```javascript
//弄一个变量来接收这个方法返回的对象;
let 自定义名 = url.parse(URL, [parseQueryString可选], [slashesDenoteHost可选]);
```

参数2: parseQueryString: 
决定返回物中的query属性是经过querystring模块解析过后封好的对象还是未经其解析的字符串.

参数3: slashesDenoteHost: 
决定以何种方式对UR进行拆解, 体现在是否将URL中第一个"//"与其后的首个"/"之间的字符取出归类为host, 如果为false, 取出的
对象中将只有一个pathname:

```javascript
//不拆出"//"和"/"之间的内容
{pathname: '//foo/bar'}
```
而如果是true, 将会是:

```javascript
//拆出"//"和"/"之间的内容
{host: 'foo', pathname: '/bar'}
```
## 3.path模块
### 获取后缀名 path.extname()
获取URL中最后一个句点"."后的内容, 即扩展名, 所在页面文件的扩展名.
如果句点后无字符, 将返回空字符串.

公式:
```javascript
path.extname(URL);
```

示例:

```javascript
path.extname('index.html');  //.html
path.extname(req.url);  
//返回当前页面的后缀名, 比如下载页可能是.zip甚麽的...
```
<hr style=" border:solid; width:100px; height:1px;" color=#000000 size=1">

## 4.querystring
暂时空缺
<hr style=" border:solid; width:100px; height:1px;" color=#000000 size=1">

## 5.util
暂时空缺
<hr style=" border:solid; width:100px; height:1px;" color=#000000 size=1">

# 二、文件模块
## 检查路径指向的文件/目录是否存在 stat()
stat()方法只能实现检查并获取文件;
判断方面还是需要使用 isFile() 方法和isDirectory()方法;

公式:
```javascript
fs.stat([指向目标文件的路径], function(err, 文件) {
  if(err) {
    //错误处理办法;
  }
    console.log("是否为文件:" + 文件.isFile());
    console.log("是否为目录:" + 文件.isDirectory());
})
```
示例:
```javascript
const fs = require('fs');

fs.stat('./app.js', function(err, stats) {
  if(err) {
    console.log(err);
  }
    console.log("是否为文件:" + stats.isFile());
    console.log("是否为目录:" + stats.isDirectory());
})
```

<hr style=" border:solid; width:100px; height:1px;" color=#000000 size=1">

## 读取并返回目录中内容 readdir()
读取并以数组形式返回目录中的内容, 不论文件或目录;
options

公式:
```javascript
//fs.readdir(path, [options], 回调函数);
fs.readdir([指向目标目录的路径], function (err, 文件名) {
    if (err) {
        //错误处理办法
    } else {
        console.log(文件名[0]);
        //返回一个名为"文件名"的数组;
        //你可以通过常规的数组方法来决定对哪个子文件/目录进行操作
    }
})
```

示例:

```javascript
const fs = require('fs');

fs.readdir('./css', function (err, fileName) {
    if (err) {
        console.log(err);
        returm;
    } else {
        console.log(fileName[0]);
        //返回一个装着文件的数组;
    }
})
```

<hr style=" border:solid; width:100px; height:1px;" color=#000000 size=1">

## 向文件中添加字段 appendFile()
异步地将数据追加到文件, 如果该文件不存在将会创建该文件然后添加.

公式:
```javascript
fs.appendFile([指向目标文件的路径], [要新加入的字段], (err) => {
    if(err) {
        //错误处理办法
    }else {
        //字段写入成功后的操作
    }
})
```

示例:

```javascript
const fs = require("fs");

fs.appendFile('./css/base.css', 'body{background-color:red}', (err)=> {
    if(err) {
        console.log(err);
        return;
    }else {
        console.log("appendFile成功");
    }
})
```

<hr style=" border:solid; width:100px; height:1px;" color=#000000 size=1">

## 创建目录 mkdir()
在目标路径下创建一个新的目录, 目标路径要锁定到新增的目录才能建立, 比如要在目录1中建立目录2: "目录1/目录2";
"可选的 options 参数可以是整数, 用于指定用什么mode（权限和粘性位），也可以是具有mode属性和recursive属性（指示是否应创建父目录）的对象。 当 path 是已存在的目录时，调用 fs.mkdir() 仅在 recursive 为 false 时才导致错误"

公式:
```javascript
//mkdir('目录路径', 读取权限(可选), 回调函数);
fs.mkdir([指向新创文件的路径], (err)=> {
  if(err) {
      //错误处理办法
  }else {
      //创建成功后需要执行的操作;
  }
})
```
示例:

```javascript
const fs = require('fs');

fs.mkdir('./css', (err)=> {
  if(err) {
      console.log(err);
      return;
  }else {
      console.log("创建成功");
  }
})

//
```
<hr style=" border:solid; width:100px; height:1px;" color=#000000 size=1">

## 创建多级目录mkdirp
即便在路径上加了后缀名, 创建出来的也只能是目录, 比如这里会是一个叫做`loadagin.js`的目录.
这个方法会返回已经成功创建好分目录, 传参`made`可以对该返回值进行接收.

```javascript
const mkdirp = require('mkdirp')
 
// return value is a Promise resolving to the first directory created
mkdirp('./upload/loadagain.js').then((made) =>
  console.log(`made directories, starting with ${made}`
))
```

---

## 读取文件内容 readFile()
注意一下文件内容读取出来会是十六进制的buffer数据(就是12a 14f这样的), 需要用toString()转换一下; 
如果是HTML文档, 读出来的data是可以直接放到http.createServer的res.end()里呈现到页面的, 读取出的内容可以被浏览器正常解析.

公式:
```javascript
fs.readFile([指向需读取文件的路径], function (err, 文件全部内容) {
    if (err) {
        //错误处理办法;
    }
    //读取完毕后的操作;
    console.log(文件全部内容.toString());
})
```
示例:

```javascript
const fs = require('fs');

fs.readFile('./css/index.css', function (err, data) {
    // 传入两个参数, 错误信息和数据;
    if (err) {
        console.log(err);
        return;
    }
    console.log("读完了, 好哇");
    console.log(data.toString());
})
```
<hr style=" border:solid; width:100px; height:1px;" color=#000000 size=1">

## 改变文件名 rename()
如你所见, 它可以修改文件的名字.

公式:
```javascript
fs.rename([指向新文件名的路径], [指向老文件名的路径], function (err) {
    if (err) {
        //错误处理办法;
    }
    console.log("文件名修改成功!");
})
```
示例:

```javascript
const fs = require('fs');

fs.rename('./new.js', './old.js', function (err) {
    if (err) {
        console.log(err);
    }
})
```
<hr style=" border:solid; width:100px; height:1px;" color=#000000 size=1">

## 删除目录 rmdir()
奇怪的方法名, 它可以删除目标路径终点的目录;

公式:
```javascript
fs.rmdir([指向需删除目录的路径], function(err) {
    if(err) {
        //错误处理办法;
    }
    //删除目录后进行的操作
    console.log("删除成功");
})
```

示例:
```javascript
const fs = require('fs');

fs.rmdir('./upload', function(err) {
    if(err) {
        console.log(err);
        return;
    }
    //删除目录后进行的操作
    console.log("删除目录成功");
})
```
<hr style=" border:solid; width:100px; height:1px;" color=#000000 size=1">

## 删除文件 unlink()
删除目标路径上的文件:

公式:
```javascript
const fs = require('fs');

fs.rmdir([指向需删除文件的路径], function(err) {
    if(err) {
        //错误处理方案
    }
    //删除文件后进行的操作;
    console.log("删除成功");
})
```

示例:
```javascript
const fs = require('fs');

fs.rmdir('./upload', function(err) {
    if(err) {
        console.log(err);
        return;
    }
    console.log("删除成功");
})
```
<hr style=" border:solid; width:100px; height:1px;" color=#000000 size=1">

## 创建并写入/覆写文件 writeFile()
依据传入的路径创建新的文件并写入内容, 执行回调;
同名同位置文件如果已存在会直接替换而不是报错;

指向目标文件的路径,比如你要创建demo1.js, 在文件夹a里, 那么路径就应为"./文件夹a/demo1.js";

公式:
```javascript
const fs = require('fs');

fs.writeFile([指向目标文件的路径], [需要写入的内容], function(err) {
    if(err) {
        //错误处理方案;
    }else {
        //覆写/写入后需要进行的操作
    }
});

```

<hr style=" border:solid; width:100px; height:1px;" color=#000000 size=1">

# 总结
在学了在学了(新建文件夹)
非周期性补全中......