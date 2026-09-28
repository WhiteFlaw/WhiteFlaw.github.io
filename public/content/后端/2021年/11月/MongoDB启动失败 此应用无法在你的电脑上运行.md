
@[TOC](文章目录)

<hr style=" border:solid; width:100px; height:1px;" color=#000000 size=1">

# 前言
![在这里插入图片描述](../../../../img/后端/2021年/11月/MongoDB启动失败%20此应用无法在你的电脑上运行/1.jpeg)

这个错误是在命令行中执行```Mongo```时出现的

但环境变量已配置, 上次启动还一切都好.
尝试了
```javascript
C:\windows\system32>sc delete mongodb
D:\MongoDB\bin>d:\mongodb\bin\mongod --config "d:\mongodb\mongod.cfg" --install
```
删除服务后再重新建立, 遗憾, 并不管用且错误相同.

<hr style=" border:solid; width:100px; height:1px;" color=#000000 size=1">

# 一、原因分析
回想了一下, 昨晚在任务管理器里把这个进程终止了:
![在这里插入图片描述](../../../../img/后端/2021年/11月/MongoDB启动失败%20此应用无法在你的电脑上运行/2.jpeg)
原本它都是开机就会自运行, 但今早在进程表里没有看到, 估计是了..


# 二、解决方法
下午想了想, 觉的有个更好的方法, 在Win10环境下的"应用与功能"面板下找到MongoDB, 然后点击修复, 可以启动MongoDB自带的修复程序,这时候如果到官网上再拿到一个msi包, 把路径给修复程序, 就可以进行修复了:
![在这里插入图片描述](../../../../img/后端/2021年/11月/MongoDB启动失败%20此应用无法在你的电脑上运行/3.jpeg)

也不需要重装, 或许这样会比较保险一些.
<hr style=" border:solid; width:100px; height:1px;" color=#000000 size=1">

尝试以兼容模式(Win7, Win8环境)运行MongoDB/bin目录下mongod.exe,报错原因相同, 也就是根本无法建立MongoDB服务.
我直接进行了MongoDB的卸载重装, 然后在MongoDB/bin目录下执行:

```javascript
D:\MongoDB\bin>d:\mongodb\bin\mongod --config "d:\mongodb\mongod.cfg" --install
```
使用mongod.cfg中的配置来重建服务, 执行成功会返回一个对象:
![在这里插入图片描述](../../../../img/后端/2021年/11月/MongoDB启动失败%20此应用无法在你的电脑上运行/4.jpeg)
然后执行
```javascript
net start MongoDB
```

<hr style=" border:solid; width:100px; height:1px;" color=#000000 size=1">

# 总结
_