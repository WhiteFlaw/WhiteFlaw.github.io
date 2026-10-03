---
title: MySQL设置数据格为空白
date: 2021-10-12
cover: /img/d1.webp
desc: MySQL设置数据格为空白
tags: [后端]
sticky: false
---

@[TOC](文章目录)

<hr style=" border:solid; width:100px; height:1px;" color=#000000 size=1">

# 前言
昨天打算建个数据库来做个项目, 有个需求是把数据库中的一些格子设置为空白,但是不知道怎么做,感觉直接传个空字符串进去也不能算是"空白;"
我先尝试了不传值(现在来看是真的有点蠢) ,然后PHPMyAdmin提示"这行要有仨值,你就给了俩"
甚麽意思呢, 比如第一列和第二列我都给了5个数据,那么现在这俩都是5行,但是第三列我只给了俩数据,这样3 4 5行都缺了一块,就会出现这个错误;
<hr style=" border:solid; width:100px; height:1px;" color=#000000 size=1">

# 1. 设置为空白
如果需要某个格子为空白, 可以为其所在的字段设置默认值, 但是不能不传值,那会报错;
然后需要设为空白的位置写入值DEFAULT即可;

或者更直接一点直接往格子里给个空字符串...
但注意是空字符串,不要在引号中间再敲一个空格.

是的,一开始我也觉得 传进去一个空字符串这个格子也不能算真的"空了",但确实是应该这么做:

公式:
```sql
 [字段名] [字段类型]  DEFAULT '',
```

例:
```sql
INSERT INTO test1(id, name, password) VALUES(1, "张五", "王五"), (2, "张三", DEFAULT), (3, "王二麻子", DEFAULT), (4, "李四", DEFAULT), (4, DEFAULT, DEFAULT)
//name的默认值是NULL,所以这里的两个DEFAULT会显示不同的结果;
```

![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/1a6669633b844f7e50f07f0c31fc1f04.jpeg#pic_center)

# 2. 设置为NULL
设置为NULL就和直接传个空白字符串不一样了,格子里会实实在在的存在一些东西,在MySQL中是会占用空间的.
这种方法是设置默认值为NULL,举个例子你要是只给1,2列传了数据,第三列没管,那第三列此时就全是NULL;

公式:
```sql
ALTER TABLE [数据表名称] MODIFY [字段名] [字段类型] DEFAULT NULL;
```
例:
```sql
ALTER TABLE index_nav MODIFY imgs VARCHAR(255) DEFAULT NULL;
```
```sql
//直接什么都不给imgs吧
INSERT INTO index_nav (url, texts)
VALUES ("./blogs.php","博客"),

 ("./columns","专栏"),

 ("./download.php","下载"),

 ("./qa.php","问答"),
```
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/112d993306a3378eba879ebfe54497dd.jpeg#pic_center)

<hr style=" border:solid; width:100px; height:1px;" color=#000000 size=1">

# 总结
_