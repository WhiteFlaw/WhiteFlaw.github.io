---
title: git -c diff.mnemonicprefix=false -c core.quotepath=false --no-optional-locks push -v --tags origin
date: 2023-04-13
cover: /img/d1.webp
desc: git -c diff.mnemonicprefix=false -c core.quotepath=false --no-optional-locks push -v --tags origin
tags: [CSS, 前端]
sticky: false
---

@[TOC](文章目录)

---

# 前言
好多天没交代码了, 今天用SourceTree提交突然报了这个错误.
```
git -c diff.mnemonicprefix=false -c core.quotepath=false --no-optional-locks push -v --tags origin main:main
```

---

# 一、解决办法
上方工具栏, `工具`-`选项`:

![在这里插入图片描述](../../../../img/前端/2023年/4月/git%20-c%20diff.mnemonicprefix=false%20-c%20core.quotepath=false%20--no-optional-locks%20push%20-v%20--tags%20origin/1.png)
进入`验证`标签页, 现在只有这两个:

![在这里插入图片描述](../../../../img/前端/2023年/4月/git%20-c%20diff.mnemonicprefix=false%20-c%20core.quotepath=false%20--no-optional-locks%20push%20-v%20--tags%20origin/2.png.png#pic_center)
很明显向github提交应该对第二个进行操作, 点击编辑:

![在这里插入图片描述](../../../../img/前端/2023年/4月/git%20-c%20diff.mnemonicprefix=false%20-c%20core.quotepath=false%20--no-optional-locks%20push%20-v%20--tags%20origin/3.png)

这里需要输入token而不是密码:

![在这里插入图片描述](../../../../img/前端/2023年/4月/git%20-c%20diff.mnemonicprefix=false%20-c%20core.quotepath=false%20--no-optional-locks%20push%20-v%20--tags%20origin/4.png)
然后会新增一个你的github账户存档:

![在这里插入图片描述](../../../../img/前端/2023年/4月/git%20-c%20diff.mnemonicprefix=false%20-c%20core.quotepath=false%20--no-optional-locks%20push%20-v%20--tags%20origin/5.png)
将其设为默认, 然后再次提交代码即可.



---
# 总结
--