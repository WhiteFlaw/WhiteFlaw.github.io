---
title: XMLHttpRequest对象与AJAX技术
date: 2021-02-25
cover: /img/d8.webp
desc: XMLHttpRequest对象与AJAX技术
tags: [JavaScript, 前端]
sticky: false
---

# AJAX技术

@[TOC](文章目录)

# Ajax技术的诞生
Web应用程序是一种新的潮流，但伴随Web的逐渐发展，出现的是等待，等待服务器的响应，等待刷新和生成。在这样的背景下，2005年，Ajax诞生了。
# 一、Ajax的概念？
Ajax(Asynchronous Javascript And XML)这个短语由Adaptive Path的Jesse James Garrett发明,，其并非某种语言，Ajax是由HTML、JavaScript、DHTML(DynamicHTML)和DOM四者结合组成的构建网站的方法，这一方法可以将Web界面转化成交互性的Ajax应用程序。
JavaScript：Ajax技术得以在应用程序中运行的核心代码，其构成Ajax代码的主体。
HTML：用于建立Web表单并确定用用程序其他部分使用的字段。
DHTML:借助div、span以及其他动态HTML元素对HTML的标记来动态更新表单。
DOM（文档对象模型）:借助JavaScript处理HTML结构，也可以处理XML结构的数据。 
# 二、XMLHttpRequest对象的概念
XMLHttpRequest对象是一个JavaScript对象，如果说Ajax是一条鱼，XMLHttpRequest就像这条鱼的脊柱，串通并支持着Ajax。创建XMLHttp对象的方法如下：

```javascript
<script language="javascript" type="text/javascript">
var xmlHttp = new XMLHttpRequset();
<script>  
```

## 1.XMLHttpRequest对象的属性
1.  状态值 readyState，可以确定请求/响应过程的当前活动阶段

0：已建立对象。但尚未调用open()方法；
1：已建立对象。已经调用open()方法，未调用send()方法；
2：发送。已经调用send()方法，Http头未知，状态未知；
3：接收。已经接收到部分数据，但因为响应头及http头不全，这时若通过XMLHttp对象属性中的responseBody/Text获取数据会报错，因为数据还在传输中。
4：完成。已经接收到全部数据，可以在客户端正常获取数据。

2.  回调函数 onload()、onreadystatechange() 依据readyState值的变动判断是否执行自身，服务器返回的内容也是优先到这里提供给其使用。

3. 字符串 responseText 作为响应主体被返回的文本。

4.  XmlDocument responseXML 服务器返回的数据（Xml对象）

5.   状态码 Number states（整数），如：200、404…

6.  状态文本 String statesText （字符串），如：OK、NotFound…

## 2.XMLHttpRequest对象的作用
其是Ajax技术中用于处理服务器通信的对象，JavaScript和XMLHttpRequest对象被放在Web和服务端之间，这样Web要向服务器传输数据时会先将数据发送给JavaScript再由JavaScript在后台发送异步请求给服务器，这意味着能够同时避免页面刷新和等待服务器响应，用户可以继续正常使用应用程序。
在服务器返回数据给JavaScript后JavaScript会对返回的数据进行操作（比如迅速更新表单或者计算后继续请求），不会影响应用的正常使用，这便是Ajax技术产生的目的：快速动态的响应、提高交互效率。
# 三、Ajax技术基本使用
为XMLHttp（XMLHttpRequest 对象）设置一个脚本作为链接的目标。要注意脚本的 URL 的指定方式
然后open()一个连接，其中指定连接方法和要连接的 
URL，最后一个参数为是否异步，如果设为 true，那么将请求一个异步连接（这就是 Ajax 的由来）。如果使用 false，那
么代码发出请求后将等待服务器返回的响应。
xmlHttp（XMLHttpRequest 对象）的 onreadystatechange 属性可以告诉服务器在运行完成后做什么。因为异步不需要等待服务器，必须让服务器知道之后干什么以便能作出响应。
因为已经在请求 URL 中添加了要发送给服务器的数据（city 和 state），所以请求中不需要发送任何数据。使用值 null 调用 send()。这样就发出了请求。
## 1.使用GET法提交数据
GET用于向服务器查询某些信息，使用这种方法可以不设置请求头setRequestHeader()，GET也是open()中默认的打开连接的方式。使用GET法发送数据，应使用null来调用send()。使用GET进行数据提交的基本流程如下：

```javascript
    //get法提交数据
    function get(url, data, success) {
      var xmlHttp = null;
      if (XMLHttpRequest) {
        xmlHttp = new XMLHttpRequest();
      } else {
        xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
      }
      xmlHttp.open('get', url)
      //open()建立到服务器的新请求
      xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
          success(xmlHttp.responseText);
           //responseText：服务器返回的请求响应文本
        }
      }
      xmlHttp.send(data);
      //send()：向服务器发送请求
    }

```

## 2.使用POST法提交数据
POST请求用于向服务器发送应该被保存的数据。POST请求的主体可以包含非常多的数据，而且格式不限。由于open默认方式为GET，所以要使用POST发送数据必须在open()中设置打开连接的方式为post，当post不发送数据时也不需要设置请求头。使用post法需要使用要发送的数据来调用send()使用GET进行数据提交的基本流程如下：

```javascript
    //post法提交数据
    function post(url, data, success) {
      var xmlHttp = null;
      if (XMLHttpRequest) {
        xmlHttp = new XMLHttpRequest();
      } else {
        xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
      }
      xmlHttp.open('post', url);
      if (option.type == 'post' && option.data) {
        //设置请求头：在post法中data存在时需要设置，get法可以不设置请求头;
        xmlHttp.setRequestHeader('content-type', 'application/x-www-form-urlencoded');
      }
      xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
          success(xmlHttp.responseText);
          //responseText：服务器返回的请求响应文本
        }
      }
      xmlHttp.send(data);
    }

```

# 四、JQueryAjax
1. jQueryAJAX 的方法们。
通过 jQuery AJAX 方法，您能够使用 HTTP Get 和 HTTP Post 从远程服务器上请求文本、HTML、XML 或 JSON - 同时您能够把这些外部数据直接载入网页的被选元素中。

|函数| 描述 |
|--|--|
|jQuery.ajax()| 执行异步 HTTP (Ajax) 请求。 |
|.ajaxComplete()|当 Ajax 请求完成时注册要调用的处理程序。这是一个 Ajax 事件。|
|.ajaxError()| 当 Ajax 请求完成且出现错误时注册要调用的处理程序。这是一个 Ajax 事件。  |
|.ajaxSend()|在 Ajax 请求发送之前显示一条消息。|
|jQuery.ajaxSetup()| 设置将来的 Ajax 请求的默认值。 |
|.ajaxStart()| 当首个 Ajax 请求完成开始时注册要调用的处理程序。这是一个 Ajax 事件。 |
|.ajaxStop()| 当所有 Ajax 请求完成时注册要调用的处理程序。这是一个 Ajax 事件。 |
|.ajaxSuccess()| 当 Ajax 请求成功完成时显示一条消息。 |
|jQuery.get()|使用 HTTP GET 请求从服务器加载数据。
|jQuery.getJSON()|使用 HTTP GET 请求从服务器加载 JSON 编码数据。|
|jQuery.getScript()| 使用 HTTP GET 请求从服务器加载 JavaScript 文件，然后执行该文件。 |
|.load()|  从服务器加载数据，然后把返回到 HTML 放入匹配元素。  |
|jQuery.param()|创建数组或对象的序列化表示，适合在 URL 查询字符串或 Ajax 请求中使用。|
|jQuery.post()| 使用 HTTP POST 请求从服务器加载数据。 |
|.serialize()| 将表单内容序列化为字符串。  |
|.serializeArray()|序列化表单元素，返回 JSON 数据结构数据。 |

|函数| 参数 |
|--|--|
|jQuery.ajax()|请求地址url、请求方式type/method、请求头headers、发送的数据data、即将发送信息至服务器的内容编码类型contentType、规定异步async、以毫秒设置请求超时timeout、发送请求前执行的函数beforeSend、完成回调函数(全局)complete、成功回调函数(全局)success、失败回调函数(全局)error、accepts通过请求头发送给服务器，告诉服务器当前客户端接受的数据类型、转换服务器端返回的数据dataType、将返回的内容转换成xml格式"xml"、将返回的内容转换成普通文本格式"text"、将返回的内容转换成普通文本格式（在插入DOM中时，如果包含JavaScript标签，则会尝试去执行。） "html"、将返回值当作JS执行再将返回内容转换成普通文本格式"script"、将返回的内容转换成相应的JS对象"json"
|.ajaxComplete()|Ajax 事件，请求完成时运行的函数。|
|.ajaxError()| Ajax 事件，请求失败时运行的函数。  |
|.ajaxSend()|请求即将发送时运行的函数。|
|jQuery.ajaxSetup()| 设置将来的 Ajax 请求的默认值。 |
|.ajaxStart()| Ajax 事件，AJAX 请求开始时运行的函数。 |
|.ajaxStop()| Ajax事件，AJAX 请求完成时运行的函数|
|.ajaxSuccess()|Ajax时间，AJAX 请求成功时运行的函数|
|jQuery.get()|请求地址url、要发送的数据data、成功回调函数success、dataType|
|jQuery.getJSON()|请求地址url、data、success|
|jQuery.getScript()|请求地址url、要发送的数据data、成功回调函数success|
|.load()| 加载数据，填充HTML，请求地址url、发送的数据data、function|
|jQuery.param()|param() 方法创建数组或对象的序列化表示形式。需要序列化的数组或对象object，布尔值指定是否使用参数序列化trad。|
|jQuery.post()|请求地址url、要发送的数据data、成功回调函数success、内容格式dataType:|
|.serialize()|通过序列化表单值创建 URL 编码文本字符串 |
|.serializeArray()|通过序列化表单值来创建对象（name 和 value）的数组，返回 JSON 数据结构数据。 |
2. JQuery封装的Ajax函数的基本使用流程
JQueryAjax其实也就是封装过后的、JavaScript代码写的Ajax函数，虽然复原其内部原理比较困难，但其产生重要效果的部分其实与我们上文中写的Ajax代码大同小异。它的基本使用方法如下：

```javascript
    $(function () {
      $('.xxx').blur(function () {
        $.ajax({
          url: '接口地址',
          type: '发送方法',
          data: 'xxx',
          //不止可以写这些;
          success: function (data) {
            //成功后要执行的操作，形参（此处data）为函数内部操作提供数据。
            $(.tips).html(data.shuju).fadeOut(2000)
          }
        })
      })
    })
```
JQueryAjax简化了Ajax技术的使用流程。
# 总结
如果这篇文帮到了您，我很荣幸。
如果您发现有不妥的地方，恳请您指点。
