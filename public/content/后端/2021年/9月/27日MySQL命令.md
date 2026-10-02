---
title: 27日MySQL命令
date: 2021-09-27
cover: /img/d1.webp
desc: 27日MySQL命令
tags: [后端]
sticky: false
---

2021.09.27 MySQL笔记# 2021.09.27 MySQL笔记
@[TOC](文章目录)

<hr style=" border:solid; width:100px; height:1px;" color=#000000 size=1">

# 一、展示当前存在的所有数据库

```sql
SHOW DATABASES;
```
<hr style=" border:solid; width:100px; height:1px;" color=#000000 size=1">

# 二、使用(选中)一个数据库

```sql
USE 数据库名;
```
<hr style=" border:solid; width:100px; height:1px;" color=#000000 size=1">

# 三、创建一个数据表
公式:
```sql
CREATE TABLE 数据表名(列首1 数据类型, 列首2, 数据类型);
```

例:

```sql
CREATE TABLE chart3(url VARCHAR(255), texts VARCHAR(255), imgs VARCHAR(255))
```

一定注意最后一对后面不要再加逗号,不然会报错
<hr style=" border:solid; width:100px; height:1px;" color=#000000 size=1">

# 四、查询并展示该数据库内的所有数据表
```sql
SHOW TABLES;
```
使用前提:use 数据库名 指令已得到执行;
<hr style=" border:solid; width:100px; height:1px;" color=#000000 size=1">


# 五、存入(添加)单条记录
```sql
INSERT INTO 数据表名(列首1, 列首2, 列首3) VALUES(值1, 值2, 值3);
```
键值关系需要对应,只能在已有列下插入,使用不存在的列名将报错;
<hr style=" border:solid; width:100px; height:1px;" color=#000000 size=1">

# 六、存入(添加)多条记录
该方法引自CSDN博主"热爱编程的孩子",亲测有效:
[如何用insert into values插入多条数据](../../../../img/后端/2021年/9月/27日MySQL命令/1.jpeg)
公式:
```sql
INSERT INTO 数据表名 (列首1,列首2,列首3,...)
VALUES (列首1值,列首2值,列首3值),

 ( , , ),

 ( , , ),

 ( , , ),

 ( , , )
 
 //末行请不要加逗号,会报错.

```
例:

```php
ALTER TABLE index_nav MODIFY imgs VARCHAR(255) DEFAULT NULL;
INSERT INTO index_nav (url,texts)
VALUES ("./blogs.php","博客"),

 ("./columns","专栏"),

 ("./download.php","下载"),

 ("./qa.php","问答"),

 ("./community.php","社区"),

("./plugin.php","插件"),

("./auth.php","认证"),

("./vip.php","会员中心"),

("./collection.php","收藏"),

("./space,php","动态"),

("./message.php","消息")

```

![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/78a16f4182d5158dcd15940221eaef1c.jpeg#pic_center)

<hr style=" border:solid; width:100px; height:1px;" color=#000000 size=1">

# 七、查询并展示数据表中的数据
```sql
SELECT * FROM 数据表名;  //查询&展示所有字段;
SELECT 字段 FROM 数据表名;  //查询一列;
```
<hr style=" border:solid; width:100px; height:1px;" color=#000000 size=1">

# 八、更新数据表数据:
WHERE后面的条件用于锁定行,而前面指定字段就直接锁定了列;
公式:
```sql
UPDATE 数据表名 SET 需要修改的字段 = "新设置的值" WHERE 字段2 = "字段2列中的某个值"
```
例:
```sql
UPDATE chart1 SET age = 42 WHERE id = 1 OR id = 2 OR id = 3; 
//更新表chart1,将所有横行id为1/2/3的age改为42;
UPDATE chart1 SET age = 42 WHERE id = 1 AND age = 2;
//更新表chart1,仅将id为1且age本为2的数据改为42;
```

人话: "我要更新某数据表, 更新某列的某个值使其为xxx(但目前不知道具体哪行),这个值所在的行数是: 与某列??值所在的行数相同."

<hr style=" border:solid; width:100px; height:1px;" color=#000000 size=1">

# 九、同时更新多个数据表的数据:
公式:
```sql
UPDATE 数据表2, 数据表1 SET 数据表1.字段=???, 数据表2.字段=2000 WHERE 数据表1.字段=1 AND 数据表2.字段=1;
```
例:
```sql
UPDATE chart2, chart1 SET chart1.age=1000, chart2.age=2000 WHERE chart1.id=1 AND chart2.id=1;
```
<hr style=" border:solid; width:100px; height:1px;" color=#000000 size=1">

# 十、选取并展现数据表
公式:
```sql
DESC 数据表名;
```
<hr style=" border:solid; width:100px; height:1px;" color=#000000 size=1">

# 十一、查找数据表中不重复的某项
公式:
```sql
SELECT DISTINCT 要查询的字段 from 数据表名 WHERE 条件1 AND(或OR) 条件2;
```
例:
```sql
SELECT DISTINCT * FROM employee where id=3 OR id=4;
SELECT DISTINCT * FROM employee where id>4;
```
对于某个值,只要不存在与其相同的另一个值,其就会遭到列出;

<hr style=" border:solid; width:100px; height:1px;" color=#000000 size=1">

# 十二、对字段进行排序
asc升序
desc降序
公式:
```sql
SELECT * FROM 数据库名 ORDER BY 要排序的字段 排序方式(desc/asc);
```
例:
```sql
SELECT * FROM employee ORDER BY salary asc;
```
## 1.对并列数据进行再排序
排序并列时,并列项之间的排序是混乱的,应当避免这种情况;
公式:
```sql
SELECT * FROM 数据库名 ORDER BY 字段1 排序方式(asc/desc), 字段2 排序方式(asc/desc);
```
在满足排序条件1的情况下,对出现并列的字段根据排序条件2进行再次排序;

## 2.限制排序后展示数据的数量
添加"limit"来决定需要选取多少条数据;
从头开选:
```sql
//仅选取前五条数据;
SELECT * FROM 数据表名 ORDER BY 字段1 排序方式(desc/asc), 字段2 排序方式(desc/asc) LIMIT 5;
```
中途起选:
```sql
//由第一条起始,后面五条选中,第一条不包括在内;
SELECT * FROM 数据表名 ORDER BY 字段1 排序方式(desc/asc), 字段2 排序方式(desc/asc) LIMIT 1,5;
```
<hr style=" border:solid; width:100px; height:1px;" color=#000000 size=1">

# 十三、字段求和
计算某项数据的总和;
公式:
```sql
SELECT SUM(字段) FROM 数据表名;
```
例:
```sql
SELECT SUM(salary) FROM employee;
```
<hr style=" border:solid; width:100px; height:1px;" color=#000000 size=1">

# 十四、统计字段内数据个数
对某个字段进行数据个数统计:
公式:
```sql
SELECT COUNT(字段) FROM "数据表名";
```
例:
```sql
SELECT COUNT(salary) FROM employee;  //返回个数;
```
<hr style=" border:solid; width:100px; height:1px;" color=#000000 size=1">

# 十五、查询某字段最大值
对某个字段进行数据个数统计:
公式:
```sql
SELECT MAX(字段) FROM "数据表名";
```
例:
```sql
SELECT MAX(salary) FROM employee;
```
<hr style=" border:solid; width:100px; height:1px;" color=#000000 size=1">


# 十六、查询某字段最小值
对某个字段进行数据个数统计:
公式:
```sql
SELECT MIN(字段) FROM "数据表名";
```
例:
```sql
SELECT MIN(salary) FROM employee;
```
<hr style=" border:solid; width:100px; height:1px;" color=#000000 size=1">

# 十七、表连接:
## 内连接
公式:
从  |数据表1|和|数据表2|  中选取  |数据表1|的|字段1字段2| 和  |数据表2|中的|字段1|  ,条件是 |数据表1| 里选出来的那个字段1名字必须和字段2的相同;
```sql
SELECT 数据表1.字段1, 数据表1.字段2, 数据表2.字段1 FROM 数据表1, 数据表2 WHERE 数据表1.字段1 = 数据表2.字段1; 
```
## 外连接
__
<hr style=" border:solid; width:100px; height:1px;" color=#000000 size=1">

# 十八、改变表中字段名/类型
对某个字段进行数据个数统计:
公式:
```sql
ALTER TABLE 数据表名 CHANGE 原字段名 新字段名 INT;
ALTER TABLE 数据表名 CHANGE 原字段名 新字段名 旧类型 新类型 旧默认值 新默认值;
```

<hr style=" border:solid; width:100px; height:1px;" color=#000000 size=1">

# 总结
记一些乱七八糟的东西.