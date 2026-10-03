---
title: 解决Three.js纹理渲染后模型黑色问题
date: 2022-07-05
cover: /img/d7.webp
desc: 解决Three.js纹理渲染后模型黑色问题
tags: [JavaScript, 前端]
sticky: false
---

@[TOC](文章目录)

---

# 前言
有很多种情况, 我一一列举一下, 因为我全都试过了...

---

# 一、图片路径错误
要加载的图片应该从当前js文件(即load()所在的文件)开始引导路径.
但是这种情况下并不会报错, 而且网络请求会显示能够请求到图片, 可辨识的是网络请求列表里的图片并不会有图像而是默认图片.

---

# 二、TextureLoader()是异步操作, 但是没有回调渲染
TextureLoader()会在画布渲染完毕后把纹理弄上去, 如果你不在TextureLoader()的load()方法里回调渲染函数, 那么...
load是可以接受函数类型参数的:

![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/13e6bbdeac6db87b9ffbc16d47589564.png)

```javascript
const texture = new THREE.TextureLoader().load('../assets/haokangde.png', function () {
    renderer.render(scene, camera);
});
```

---

# 三、渲染时机不正确
检查一下你的颜色color能不能生效, 如果模型是白色, 那你应该调整一下mesh()的时机, 或许该晚一点;
至少等到颜色可以正常显示再去调整纹理的问题.

---

# 四、渲染函数里没有requestAnimationFrame()

---

# 五、尝试使用require引入纹理
它解决了我的问题：

```javascript
var haokangde = require('../assets/haokangde.png');   //直接在load()里写路径不行
const texture = new THREE.TextureLoader().load(haokangde, function () {
    renderer.render(scene, camera);
});
```

---

# 六、浏览器不能读取本地文件
很少会出现这种情况吧...
桌面右键edge/chrome, 打到快捷方式上, 直接在目标后面粘贴:

```javascript
//开头我已经加了空格, 不要再加
 -enable-webgl --ignore-gpu-blacklist --allow-file-access-from-files
```

---

# 七、光照
看你的材质用的是什么, `MeshBasicMaterial`不需要光照
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/d5e2b12f9e0286cb58c3a6b34f3c3710.png)

但是其他材质不加光源就是黑色的.

---

# 附-颜色color加载不出
color的值不要加引号, 跟着教程加了引号翻车.
去看了文档发现不该加引号:

```javascript
const material = new THREE.MeshBasicMaterial({
    color: 0x049EF4,  //color值不能加引号, 不然会渲染默认白色
});
```

---

# 总结
