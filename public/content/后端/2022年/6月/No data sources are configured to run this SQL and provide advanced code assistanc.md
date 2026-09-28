---
title: No data sources are configured to run this SQL and provide advanced code assistanc
date: 2021-10-23
cover: /img/d1.webp
desc: No data sources are configured to run this SQL and provide advanced code assistanc
tags: [CSS, 前端]
sticky: false
---

@[TOC](文章目录)

---

# 前言
第一次在phpstorm连接数据库, 我已经在conn尝试连接了数据库并且也被提示连接无错误.
但是把conn导入到其他文件不仅不能用, 而且所有sql语句都标黄了.

![在这里插入图片描述](../../../../img/后端/2022年/6月/No%20data%20sources%20are%20configured%20to%20run%20this%20SQL%20and%20provide%20advanced%20code%20assistanc/1.png)
不过我基本猜到了是数据库的问题.

---

# 一、尝试解决

刚开始它也不能写PHP, 然后就去File-Setting里配置了PHP, 我就想这次能不能也如法炮制去配置一下MySQL呢:

![在这里插入图片描述](../../../../img/后端/2022年/6月/No%20data%20sources%20are%20configured%20to%20run%20this%20SQL%20and%20provide%20advanced%20code%20assistanc/2.png)
先是把路径引导到mysql.exe, 之后又引导到mysqld.exe, 很遗憾全都没用...
唯一变化的就是sql语句里的`result`变成了红色.
这不是更严重了吗...

---
# 解决方法
编辑器右上角点击`database`, 呼出database添加面板:

![在这里插入图片描述](../../../../img/后端/2022年/6月/No%20data%20sources%20are%20configured%20to%20run%20this%20SQL%20and%20provide%20advanced%20code%20assistanc/3.png)

---

正常情况下这里该是没有数据库的, 空白.
![在这里插入图片描述](../../../../img/后端/2022年/6月/No%20data%20sources%20are%20configured%20to%20run%20this%20SQL%20and%20provide%20advanced%20code%20assistanc/4.png)

---

这时候点击:

![在这里插入图片描述](../../../../img/后端/2022年/6月/No%20data%20sources%20are%20configured%20to%20run%20this%20SQL%20and%20provide%20advanced%20code%20assistanc/5.png)

---

添加数据库, 选取你要使用哪种数据库:

![在这里插入图片描述](../../../../img/后端/2022年/6月/No%20data%20sources%20are%20configured%20to%20run%20this%20SQL%20and%20provide%20advanced%20code%20assistanc/6.png)

---

之后在弹出面板中输入数据库相关信息, 应用即可:

![在这里插入图片描述](../../../../img/后端/2022年/6月/No%20data%20sources%20are%20configured%20to%20run%20this%20SQL%20and%20provide%20advanced%20code%20assistanc/7.png)

这样可以排除数据库连接上的问题.