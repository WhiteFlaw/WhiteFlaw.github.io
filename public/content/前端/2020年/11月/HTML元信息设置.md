---
title: HTML元信息设置
date: 2020-11-20
cover: /img/d2.webp
desc: HTML元信息设置
tags: [HTML, 前端]
sticky: false
---

HTML元信息设置
出现于HTML文档（以下简称"文档")的头部，存储着文档的各种基本信息，meta信息也属于其中的一种，用于模拟HTTP协议，这些基本信息将在网页加载前被浏览器使用，虽不会在网页的可视部分出现，但是处理不好会导致整个网站布局的崩坏，另外搜索引擎也会检索这些信息。通过使用meta来创建大量重复关键词和链接以提高网站排名，提高访问率是不正确的使用姿势。

meta信息（网页元信息)的设置
meta表示“关于（about）”的意思，以其作为前缀可以表示众多的意义。在这一标签中，可以添加的属性有:

name
content
http-equiv
charset
url
等等

不同的属性可以有不同的参数值以对应不同的网页功能，下面我将依次阐述以上所列。

name属性
name属性用来描述网页元信息的名称，这个名称即name属性的值可以自定义，其中包括:

keywords：将网页的关键词反馈给搜索引擎，用于SEO。

```html
<meta name="keywords" content="关键词1,关键词2"/>
```

description：告知搜索引擎本网页的主要内容，定义网页的描述信息。

```html
<meta name="description" content="网页描述"/>
```

robots：告知搜索robots这个网页中哪些页面需要索引,并禁止搜索引擎检索，是搜索引擎检索的第一个文件，通常值为all。

```html
<meta name="robots" content="all" />
```

author：告知该网站的制作者，后面需要为content赋值一个作者/团队名，可以自定义。

```html
<meta name="author" content="网页作者"/>
```

copyright：告知此网页的版权。
 

```html
 <meta name="copyright" content="版权所有时间段 网址"/>
```

website：告知本网站网址。

```html
<meta name="website" content="网址"/>
```

viewport：应对网页对屏幕而做的设置。移动端浏览器打开页面后，会把页面放在一个虚拟的“窗口”，页面可以缩放，“窗口”即viewport，基本所有移动端皆支持。

以上大多需要与下方要说的content属性配合使用。

content属性
content属性可以对name所描述的内容进行详细说明，也可以对http-equiv属性所描述的内容进行详细设置（这些设置通常会在浏览器加载前提供给浏览器和搜索引擎等设备使用，例如拿来设置字符编码、刷新时间、是否缓存等基本信息），其对于name属性，即跟从在name后面并给自己赋不同的值，这些值应依据name的值和自己的诉求做出不同的改变，以方便搜索引擎,浏览器，robots等设备进行检索。

http-equiv属性
http-equiv属性可以声明HTTP协议的响应头报文（MIME文档头），也可以用于模拟一个HTTP响应头，为设置元信息，这个属性可赋值：

http-equiv="refresh"
http-equiv="default-style"
http-equiv="content-type"
http-equiv="content-language"
http-equiv="expires"
http-equiv="pragma"
http-equiv="X-UA-compatible"
等等

以下所列属于http-equiv部分{
refresh:设置页面刷新时间或使这个页面做出跳转（重定向），这时后面的content所跟的值可以是数字，表示“在某秒后做出跳转/刷新该页面”。
default-style:规定要使用的预定义样式表。

content-type:使用该值可以为后面的content赋值设置网页的编码信息，例如设置万国码UTF-8，不同的语言编码方式也不同，所以需要使用charset为网页定义一种编码方式以防止网页出现乱码。

```html
<meta http-equiv="content-type" content="text/html; charset=UTF-8"/>
```

content-language:用以定义页面所使用的语言，使用时需要为其后的content赋值一种语言名，例如需要使用中文时为其后的content赋值“zh-CN”。

```html
<meta http-equiv="content-language" content="zh-CN"/>
```

expires:指定网页的过期时间（缓存时间），需要为其后的content赋值一个日期，网站过期之后需要从服务器上重新下载。

```html
<meta http-equiv="expires" content="日期"/>
```

pragma:可以使用这种方法设置页面不缓存（content赋值“no-cache”），也可以用于设置缓存即过期时间，也是一种设置cookie的方式。

```html
<meta http-equiv="pragma" content="no-cache"/>
```

X-UA-compatible:说明这个网页可以使用的浏览器版本，后面的content需要赋值浏览器的名称与版本。

```html
<meta http-equiv="X-UA-Compatible" content="IE=9">  
```

}
charset属性
定义网页DOC的字符集，如果需要浏览器正确的显示页面，则必须告知浏览器使用何种字符集，charset属性不需要与content属性配合使用，你可以直接为它赋值一种想要使用的字符集名称，其中包括h5默认的字符集UTF-8。

```html
  <meta charset="UTF-8">
```

url属性
这个属性很多时候是跟从在http-equiv="refresh"后面使用，可以指定需要跳转到的页面，可赋的值为网址。

综合我们上面所说的，<meta>标签的属性使用方法主要分为两组，分别为：
name属性与content属性的搭配使用
http-equiv属性与content属性的搭配使用

name属性与content属性的搭配使用
name属性用来描述网页元信息的名称，name属性值所描述的内容通过content属性进行详细说明，以方便浏览器、搜索引擎和机器人等设备进行检索。

http-equiv属性与content属性的搭配使用
http-equiv属性声明HTTP协议的相应头报文，http-equiv属性值所描述的内容通过content属性来详细设置。这些元信息通常在网页加载前提供给浏览器等设备使用。

以上是在下依据本阶段的学习得出的一些经验与心得，如果对您起到帮助，在下十分荣幸；若是您发现了我的不足，恳请您的指点！
