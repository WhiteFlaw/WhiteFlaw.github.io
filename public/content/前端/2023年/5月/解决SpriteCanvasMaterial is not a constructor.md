---
title: 解决SpriteCanvasMaterial is not a constructor
date: 2023-05-18
cover: /img/d1.webp
desc: 解决SpriteCanvasMaterial is not a constructor
tags: [CSS, 前端]
sticky: false
---

@[TOC](文章目录)

---

# 前言
上周买了本《Three.js开发指南》, 第三版, 里面的语法不太跟趟, 有点旧, 倒也不能全怪作者, three迭代的确很快.

---


# 一、替代语法
这几天没事做, 加上前面本来就接触过Three, 很快进展到了第六章.
在推进 利用Canvas贴图给精灵(Sprite)增加样式 这一节的时候提前查了下文档, 就已经发现`SpriteCanvasMaterial`这个语法不存在于文档中, 但Three的一部分语法...哪怕是现役的, 你在文档里都查不到所以我也不确定它是不是真的淘汰掉了.

但是连源码里都没有就说不过去了, 我直接开始找这个方法的替代品了.

基于书中的描述和源码, 可以看出这个语法基于DOM生成材质:
```javascript
var getTexture = function (ctx) {
 // 此处绘制canvas, 无返回值;
};

createSprites();
render();

function createSprites() {
  var material = new THREE.SpriteCanvasMaterial({
    program: getTexture,
    color: 0xffffff
  });

  material.rotation = Math.PI;

  var range = 500;
  for (let i = 0; i < 1500; i++) {
    const sprite = new THREE.Sprite(material);
    sprite.position.set(Math.random() * range - range / 2, Math.random() * range - range / 2, Math.random() * range - range / 2);
    sprite.scale.set(0.1, 0.1, 0.1);
    scene.add(sprite);
  }
}
```

然后该材质会被用于生成精灵(Sprite), 既然都用到Canvas了, 那这个材质上也应该有Canvas的花纹, 不清楚是不是基于贴图去实现的花纹.

`new THREE.Sprite(material);`这个语法倒是没有被淘汰.

那就只需要一个能把`DOM元素`转换成带贴图的材质的流程了, 想起来之前有学习过Three的`CanvasTexture()`, 这个语法可以利用`DOM元素`生成`Texture`:
```javascript
function createImageTexture() { // Canvas贴图直接用图片做
  const img = document.createElement('img');
  img.src = '../assets/textures/construction.jpg';

  const texture = new THREE.CanvasTexture(img);
  return texture;
}
```
现在基于`DOM元素`生成的贴图有了, 还需要一个材质去承载贴图, 这边直接选给精灵用的材质, 一看名字就是给精灵用的:
```javascript
const material = new THREE.SpriteMaterial({ map: texture, color: 0xffffff });
```
实操上如果要给精灵加材质, 其他材质加在精灵身上精灵是不会出现的.
顺带把贴图贴上去.

这样得到的材质就和旧版`SpriteCanvasMaterial`语法生成的材质一样了, 此时把这份材质拿去生成精灵:
```javascript
const range = 500;
for (let i = 0; i < 1500; i++) {
  const sprite = new THREE.Sprite(material);
  sprite.position.set(Math.random() * range - range / 2, Math.random() * range - range / 2, Math.random() * range - range / 2);
  sprite.scale.set(0.8, 0.8, 0.8);
  scene.add(sprite);
}
```

![在这里插入图片描述](../../../../img/前端/2023年/5月/解决SpriteCanvasMaterial%20is%20not%20a%20constructor/1.png)

我没有用Canvas作为`CanavsTexture`的参数而是一个`img`, 实际上`THREE.CanvasTexture()`也可以基于`HTMLImageElement`元素创建纹理贴图, 在创建`CanvasTexture`对象时, 如果传入的参数是一个`HTMLImageElement`元素, 
则`CanvasTexture`对象会在内部创建一个新的`Canvas`元素, 并将`HTMLImageElement`元素的内容绘制到该元素上, 然后将该元素作为纹理贴图返回. 

---

# 总结
--