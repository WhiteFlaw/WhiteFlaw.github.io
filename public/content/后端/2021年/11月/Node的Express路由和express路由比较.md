---
title: Node的Express路由和express路由比较
date: 2021-11-14
cover: /img/d8.webp
desc: Node的Express路由和express路由比较
tags: [Node, 后端]
sticky: false
---

@[TOC](文章目录)

<hr style=" border:solid; width:100px; height:1px;" color=#000000 size=1">

# 前言
我将拟express方法和正规的express方法做了很多对比(类似"这个方法是为了实现express的哪个功能")

全篇主要在两个文件里完成, 一个是"父目录/app.js", 另一个是"父目录/module/route.js";
app.js部分因为有个很长的方法会有些繁琐, 那是为了完成路由中间件的注册和阻复注册, 不过我加了很多注释, 我觉得你应该能看懂...
<hr style=" border:solid; width:100px; height:1px;" color=#000000 size=1">

# 一、routes.js
以下是源码, 我会拆开说的:

```javascript
const fs = require('fs');
const path = require('path');

let changesRes = function (res) {
    res.send = (data) => {
        res.writeHead(200, { 'Content-Type': 'text/html;charset="utf-8"' });
        res.end(data);
    }
}

let getFileMime = function (extname) {
    let data = fs.readFileSync('./data/mime.json');
    let mimeObj = JSON.parse(data.toString());
    return mimeObj[extname];
}

let initStatic = function (req, res, staticPath) {
    const { url } = req;
    const { host } = req.headers;
    const myURL = new URL(url, `http://${host}`);
    let pathname = myURL.pathname;
    let extname = path.extname(pathname);

    if (extname) {
        try {
            let data = fs.readFileSync('./' + staticPath + pathname);
            if (data) {
                let mime = getFileMime(extname);
                res.writeHead(200, { 'Content-Type': '' + mime + ';charset="utf-8"' });
                res.end(data);
            }
        } catch (error) {
            console.log(error)
        }
    }

}
let server = () => {
    let G = {
        _get: {},
        _post: {}, 
        staticPath: "static",
    };
    let app = function (req, res) {
        changesRes(res);
        initStatic(req, res, G.staticPath);

        const { url } = req;
        const { host } = req.headers;
        const myURL = new URL(url, `http://${host}`);
        let pathname = myURL.pathname;
        let method = req.method.toLowerCase();
        let extname = path.extname(pathname);
        if (!extname) {
            if (G['_' + method][pathname]) {
                if (method == "get") {
                    G['_' + method][pathname](req, res);

                } else {
                    let postData = '';
                    req.on('data', (chunk) => {
                        postData += chunk;
                    })
                    req.on('end', () => {
                        req.body = postData;
                        G['_' + method][pathname](req, res);
                    })
                }
            } else {
                res.writeHead(404, { 'Content-Type': 'text/html;charset="utf-8"' });
                res.end("页面早已离你而去了...");
            }
        }

    }
    app.get = function (str, cb) {
        G._get[str] = cb;
    }
    app.post = function (str, cb) {
        G._post[str] = cb;
    }

    app.static = function (staticPath) {
        G.staticPath = staticPath;
    }
    return app;
}

module.exports = server();

```

## 1.引入模块
因为原本的static()需要fs文件模块来读取文件.

```javascript
const fs = require('fs');
const path = require('path');
```

<hr style=" border:solid; width:100px; height:1px;" color=#000000 size=1">

## 2.changesRes() - send()
为了实现express的res.send()方法.
把send()放到changesRes()里, 通过在app()中调用changesRes()的手段将send()释放进app.js;

这层changesRes()外壳存在的意义是将内部的send()完好的释放到app()中,并从app()中摄取res.

因为app.js直接调用了send(), 所以send()可以接收到app.js传入的data(也就是renderFile()的执行结果, 即渲染后的页面数据), 而app.js也调用了app()和其内部的changesRes()为send()提供了res;
最后由send()中的end()将data放到页面上.

```javascript
let changesRes = function (res) {
//在app()内调用changesRes()相当于直接将send()写到app()中;
    res.send = (data) => {
        res.writeHead(200, { 'Content-Type': 'text/html;charset="utf-8"' });
        res.end(data);
    }
}
```

changesRes()方法也简化了app.js中的路由队列, 现在路由表里只要写一句"res.send(data)"就好(然而偷懒直接传了一个字符串);

<hr style=" border:solid; width:100px; height:1px;" color=#000000 size=1">

## 3.getFileMime() - type()
算是半个res.type()吧, 这个方法调用后返回这个文件对应的文件类型即Content-Type属性到app()中, 由initStatic()方法进行接收并设置到writeHead里.
或许该说是getFileMime()和initStatic()共同组成了拟res.type();

它接收extname作为参数(别担心, extname会由app()调用传入), 这个参数是从URL里拿到的文件路径所指向文件的扩展名, 因为我们在封装静态web, 针对那些带有文件扩展名的URL进行处理, 至于没扩展名的...
扔给路由吧! (啪)

```javascript
//根据后缀名获取文件类型;
let getFileMime = function (extname) {
    let data = fs.readFileSync('./data/mime.json');
    let mimeObj = JSON.parse(data.toString());  //拿到data转换为字符串再转换为对象;
    return mimeObj[extname];
    //extname是".xxx"的形式, 如果用mimeObj.extname会翻车;
}
```

拿到后缀名之后readFileSync()利用同步阻塞从外部文件mime.json中读取相应的Content-Type, 读取结果赋值给data.

但是读取到的是16进制的数字码, 先用toString()将其转化为字符串, 再JSON.parse()把它们转换为原本在文件里时候的对象形态, 赋值给mimeObj,这样用起来就舒服多了.

额, 记得return出去...

<hr style=" border:solid; width:100px; height:1px;" color=#000000 size=1">

## 4.initStatic
一个为了读取文件而设立的方法.
该方法读取URL中的文件路径, 提取文件内容并传给end();
end()内传入执行完毕后要呈现的内容，如果指定了 data 的值，就意味着在执行完 res.end() 之后，会接着执行如下语句:

```javascript
response.write(data , [对应的字符编码encoding]);
```

来看看完整方法:
```javascript
//静态web服务的方法;
let initStatic = function (req, res, staticPath) {

    const { url } = req;
    const { host } = req.headers;
    const myURL = new URL(url, `http://${host}`);//拼凑绝对路径, 并解析;
    let pathname = myURL.pathname;               //拿到解析结果中的pathname属性即文件路径;
    let extname = path.extname(pathname);        //利用path模块提供的方法拿到文件路径指向的文件的后缀名;
    if (extname) {                               //如果文件扩展名存在, 判定交由route.js的静态web服务处理;                        //否则交付至app.js中的路由进行处理;
        try {
            let data = fs.readFileSync('./' + staticPath + pathname);  //将同步读取的文件内容存入变量data;
            if (data) {
                let mime = getFileMime(extname); //传入文件扩展名,mime被赋值文件类型;
                res.writeHead(200, { 'Content-Type': '' + mime + ';charset="utf-8"' });
                res.end(data);
            }
        } catch (error) {
            console.log(error);                  //尝试执行出错, 抓取错误信息输出;
        }
    }

}
```

<hr style=" border:solid; width:100px; height:1px;" color=#000000 size=1">

## 5.server()
外壳负责提供G对象内部的数据和方法;
app()负责依据请求方法调用G中的方法(既路由激活后的处理办法);
app.get()负责将各路由受get请求的处理方法注册入G;
app.post()负责将各路由受post请求的处理方法注册入G;
app.static()负责将静态路径存入G供initStatic(ststicPath)读取路由需要的文件;

```javascript
let server = () => {
    let G = {
        _get: {},  //在G里声明空对象_get;
        _post: {},  //在G里声明空对象_post;\
        staticPath: "static",
    };
    //app();
    //app.get();
    //app.post();
    //app.stsatic();
    return app;
}
```

### app() - 注册中间件
依据本次请求的方法来决定是调用app.get()注册到G里的回调函数还是调用app.post()注册到G里的回调函数.

这步其实可以看作是express中对路由中间件进行的抽离注册, 然后在合适的时候挂载到Router对象上;
```javascript
    //把app放在server里防止全局污染;
let app = function (req, res) {
    changesRes(res);
    //相当于书写了如下:
    /* res.send = (data) => {
    res.writeHead(200, {'Content-Type':'text/html;charset="utf-8"'});
    res.end(data);
    app.js中可以直接调用send()方法了;
    */
} 

    initStatic(req, res, G.staticPath);    //根据请求的URL读取响应文件.
    const { url } = req;
    const { host } = req.headers;
    const myURL = new URL(url, `http://${host}`);
    let pathname = myURL.pathname;         //拿取pathname文件路径(相对路径);
    let method = req.method.toLowerCase(); //获取本次请求的方法(GET/POST),并转换为小写(get/post)赋值给method;
    let extname = path.extname(pathname);  //用path模块的自带方法extname()来获取到相对路径所指向文件的扩展名;
    if (!extname) {                        //判定扩展名是否不存在, 存在就留给路由执行;
      if (G['_' + method][pathname]) {     //G中有无归属于"_post"或"_get"对象还[符合路径]的方法;
        if (method == "get") {             //判定本次请求方式是否为get(req.method获取请求方式)
          G['_' + method][pathname](req, res); //如果是,调用G._get里与路径(比如"/login")同名的方法(路径是从app传入的参数)
            } else {
              //因为post的请求以流的形式进行, 服务器也是分段接收;
              //所以要监听两个阶段点判断是不是传输完成;
              let postData = '';         
              //声明并赋值postData为空字符串预备存储data;
              //POST提交数据以流的形式提交,服务器在接收POST数据的时候是分块接收的
              //所以用监听阶段点的方式判断是否传输完成;
              req.on('data', (chunk) => {
                    postData += chunk;     //用变量chunk接收拿到的数据, 然后填入postData中;
              })
              req.on('end', () => {       //监听end事件, 将postData赋值给res.body中
                req.body = postData;
                  G['_' + method][pathname](req, res);//调用app传入并注册的该页的post型回调函数;
              })
            }
        } else {
          //如果没有找到为这个页面的路由注册的任何回调函数, 直接向客户端返回404;
          res.writeHead(404, { 'Content-Type': 'text/html;charset="utf-8"' });
          res.end("页面早已离你而去了..."); //或者直接G['/404'](req, res);
        }
  }
}
```

### app.get() - get()
express里可以直接在注册路由的时候规定这条路由只有甚麽方法才能触发:

```javascript
router.get('/api/list', list);
```
这里就是为了拟这个功能:

将app.js传入的回调函数注册到G.get, 作为该条路由触发时的处理办法.
GET与POST的提交途径必须分别交由app.get()和app.post(), 防止G中出现覆盖注册;
```javascript
app.get = function (str, cb) {    //接收app传来的参数, 在G._get中为传来的回调函数cb(既"callback的简写")进行注册;   
    G._get[str] = cb;
}
```

### app.post() - post()
express里可以直接在注册路由的时候规定这条路由只有甚麽方法才能触发:

```javascript
router.post('/api/list', list);
```
这里就是为了拟这个功能:

将app.js传入的回调函数注册到G.post, 作为该条路由触发时的处理办法.
GET与POST的提交途径必须分别交由app.get()和app.post(), 防止G中出现覆盖注册;
```javascript
app.post = function (str, cb) {
  //接收app传来的参数, 在G._post中为传来的回调函数cb(既"callback的简写")进行注册;
    G._post[str] = cb;
}
```
### app.static()
将app中传入的静态路径存放到G中, 供initStatic()使用.
```javascript
app.static = function (staticPath) {
//app.static()会在app.js中首先调用, 获取staticPath存入G中,生成G.staticPath, 供initStatic()使用;
    G.staticPath = staticPath;//将参数staticPath赋值到G.staticPath中.
}
```

<hr style=" border:solid; width:100px; height:1px;" color=#000000 size=1">

# 二、app.js
利用route.js中封装好的拟express方法完成拟express路由的主体结构.
以下是源码, 我会拆开说的:

```javascript
const http = require('http');
const app = require('./module/route');
const ejs = require('ejs');

let app = function(req,res){

}

http.createServer(app).listen(3000);

app.static("static"); 
app.get("/login", function (req, res) {
    ejs.renderFile('./views/form.ejs', {}, (err, data) => {
        res.send(data);
    });
})

app.get("/news", function (req, res) {
    res.send("展示");
})

app.get("/register", function (req, res) {
    res.send("注册页");
})

app.get("/", function (req, res) {
    res.send("首页");
})

app.post("/doLogin", function (req, res) {
    res.send(req.body);
})

```

## 1.引入模块
就是引入依赖, 没什么好说的...
```javascript
const http = require('http');
//引入route模块,里面有个server方法要用到;
const app = require('./module/route');
//引入ejs模块, 待会要使用renderFile();
const ejs = require('ejs');
```
<hr style=" border:solid; width:100px; height:1px;" color=#000000 size=1">

## 2.简化 createServer()
用app()作为createServer的回调函数, 触发请求直接执行app().
```javascript
//let app = (req,res) => {}
//http.createServer((req, res) => {});
/* 观察可知createServer方法中的function结构与app方法的外框完全相同;
因此app()的回调函数可以放入createServer()内,这样用户一旦在客户端发动请求, 马上就会触发app(); */

http.createServer(app).listen(3000);
```

<hr style=" border:solid; width:100px; height:1px;" color=#000000 size=1">

## 3.拟express路由的挂载
在express框架中, 当有多个子路由需要操作的时候, 将子路由挂载到父级路由router然后直接挂载router会是一个更好的选择, 只要几句就好了:

```javascript
const router = express.Router();
router.get('路径', 路由中间件);
app.use('/', router);
```

但如果用app.get()一个个来, 在暴露和引入使用时都不会太方便.很遗憾我只能使用这种"一个个来"的方式在app.js里做路由, 因为router对象是express提供的, 而这是拟express:

```javascript
app.static("static");    
//向route模块末的static方法传参静态目录以修改G中的默认静态web目录;
//从而完成在静态web模式下对网页文件的读取;

app.get("/login", function (req, res) {
    //app.get()接收到参数后将传入的回调函数cb注册到route.js对象G._get中;
    ejs.renderFile('./views/form.ejs', {}, (err, data) => {
        //login页面的路由被触发, 渲染路径form.ejs;
        res.send(data);
        //res.send()将从目标文件读取到的内容data传到客户端;
    });
})

app.get("/", function (req, res) {
    //在此处向引入的route模块中的app.get()方法传参,routes模块的app.get()方法接收到参数后将传入的回调函数作为参数cb注册到对象G._get中;
    res.send("首页信息");
})

```
依据用户跳转到的URL, 调用不同的方法向app.get()或app.post()传回调函数, 并且在G._post 或 G._get 里注册这些回调函数, 它们就相当于是express的路由中间件了.

JS的解析是从上至下, 而一次请求只会触发一次createServer(), 而res.send()或res.join()这种方法如果执行完毕就自动返回, 这一轮响应到这就结束了, 后面的路由根本没有机会接受匹配, so, 不要把"/"的路由写在最上面.

与Vue的路由不太像, Vue-router(我是说路由表那边)不会出现这种结果, Vue路由的结构更加像是标准版的express路由:
用express模块的Router()注册路由对象(router是个函数, 也可以作为中间件), 在Vue中这个"中间件"应该可以看作Vue的路由表routes.

```javascript
const router = express.Router();
```

然后在这个中间件上安插各条路由, 也就像在routes数组中配置各条路由.

```javascript
//一般会把路由中间件抽离出来, 这里为了节省篇幅没有进行;
router.get('/', (req, res, next) => {
    res.send('hello');
});

//use会出现正则匹配错误的情况出现, router并不会.
router.get('/index', (req, res, next) => {
    res.send('index pages');
});
```

rouer对象就像是脊椎, 而这些中间件就像是肋骨. 
小路由卡上去以后, 将router暴露.

```javascript
module.exports = router;
```

就像vue中暴露路由表至app.js以注册到全局:

```javascript
app.use('/', router);
```

<hr style=" border:solid; width:100px; height:1px;" color=#000000 size=1">

# 三、总结
这篇拖了好久, 它几乎占用了这几天拿来写博客的所有时间, 我的最初方案是直接记录下拟express路由的制作方案就结束的, 但因为觉得没有意义马上否定了这个方案, 如果不进行任何对比, 不明白它是如何模拟express路由, 与express有何相似, 又有何区别的话, 这种记录毫无意义, 我想自己以后也不会回来看的.

另外就是因为方法封的比较多, 整篇文章看起来有点乱七八糟的, 那些很长的方法拆开又不行(点名批评app), 但太长大家又不愿意看, 里面再加一堆注释这看起来就更眼花缭乱了, 我在想如何去解决这个问题(虽然最后也没解决好).

然后就打算拖一拖等到express学的差不多再回来补上封装的各个方法与express的对比(事实是每天都要回来改一改这篇文章), 这期间我也完成了几篇小博文, 但是觉得都有点瑕疵就没敢发出去, 我觉得哪怕写一些浅显的知识, 但至少不能有错误.

然后...然后就咕咕咕了...en...

最后, 如果这篇文章帮到了你, 我很高兴.