---
title: Three.js HDRCubeTextureLoader 基于多个HDR文件的场景渲染思路
date: 2022-07-08
cover: /img/d1.webp
desc: Three.js HDRCubeTextureLoader 基于多个HDR文件的场景渲染思路
tags: [JavaScript, 前端]
sticky: false
---

@[TOC](文章目录)

---

# 前言
不细看可以直接看第三段使用方法。

昨天中午遇到这个问题, 我在Three.js官网浏览案例时发现他们使用了6个HDR文件进行渲染, 而我只会`RGBELoader`基于单个HDR文件渲染.
搜了一下, 也没有解决问题...
这就像在打游戏一样, 当你在一个庞大的地图里兜兜转转, 最后发现这个地方有个BOSS的时候, 真的就走不开了, 一方面是怕不打漏了什么重要的东西, 另一方面是怕之后再找不回来...
就硬啃了...

---


# 一、基于example的探索
[官方示例-webgl_materials_envmaps_hdr](https://github.com/mrdoob/three.js/blob/master/examples/webgl_materials_envmaps_hdr.html)

你可以不看这个, 直接看我简化之后的:

```html
<!-- 简化原例代码至仅可正常运行 -->
<body>
  <script type="importmap">
```
```javascript
    {
	  "imports": {
		"three": "../build/three.module.js"
	  }
	}
```
```html
  </script>

  <script type="module">
```
```javascript
    import * as THREE from 'three';
    import { OrbitControls } from './jsm/controls/OrbitControls.js';
    import { HDRCubeTextureLoader } from './jsm/loaders/HDRCubeTextureLoader.js';

    const params = {
      envMap: 'HDR',
      roughness: 0.0,
      metalness: 0.0,
      exposure: 1.0,
      debug: false
    };

    let container, stats;
    let camera, scene, renderer, controls;
    let torusMesh, planeMesh;
    let generatedCubeRenderTarget, ldrCubeRenderTarget, hdrCubeRenderTarget, rgbmCubeRenderTarget;
    let ldrCubeMap, hdrCubeMap, rgbmCubeMap;

    init();

    function init() {

//////////////////////////////////////////创建相机和场景
      camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 1000);
      camera.position.set(0, 0, 160);
      scene = new THREE.Scene();
///////////////////////////////////////////////////////

///////////////////////////////////////////创建渲染器
      renderer = new THREE.WebGLRenderer();
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.outputEncoding = THREE.sRGBEncoding;  //没了这句场景会变暗
      document.body.appendChild(renderer.domElement);
/////////////////////////////////////////////////////

//////////////////////////////////////////创建轨道控制器
      controls = new OrbitControls(camera, renderer.domElement);
      controls.minDistance = 50;
      controls.maxDistance = 300;
///////////////////////////////////////////////////

///////////////////////////////////////////创建模型
      let geometry = new THREE.TorusKnotGeometry(18, 8, 150, 20);

      let material = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        metalness: params.metalness,
        roughness: params.roughness
      });

      torusMesh = new THREE.Mesh(geometry, material);
      scene.add(torusMesh);
////////////////////////////////////////////////////HDR

      const pmremGenerator = new THREE.PMREMGenerator(renderer);  //删了这句模型贴图就没了, 参考一下PREMGenerator作用
      const hdrUrls = ['px.hdr', 'nx.hdr', 'py.hdr', 'ny.hdr', 'pz.hdr', 'nz.hdr'];
        
        hdrCubeMap = new HDRCubeTextureLoader()
          .setPath('./textures/cube/pisaHDR/')
          .load(hdrUrls, function () {
            hdrCubeRenderTarget = pmremGenerator.fromCubemap(hdrCubeMap);
          });
        }
///////////////////////////////////////////////////////

////////////////////////////////////////////render方法
      function render() {
        requestAnimationFrame(render);  //必须在最上

          torusMesh.material.envMap = hdrCubeRenderTarget.texture;  //这句删了模型贴图没了
          torusMesh.rotation.y += 0.005;
          scene.background = hdrCubeMap;

          renderer.render(scene, camera);

      }
//////////////////////////////////////////////////////
    render();
```
```html
  </script>
</body>
```
LiveServer:

![在这里插入图片描述](../../../../img/前端/2022年/7月/Three.js%20HDRCubeTextureLoader%20基于多个HDR文件的场景渲染思路/1.gif)

# 二、拆分HDR生效代码
```javascript
const pmremGenerator = new THREE.PMREMGenerator(renderer);  //删了这句模型贴图就没了, 参考一下PREMGenerator作用
const hdrUrls = ['px.hdr', 'nx.hdr', 'py.hdr', 'ny.hdr', 'pz.hdr', 'nz.hdr'];

hdrCubeMap = new HDRCubeTextureLoader()
  .setPath('./textures/cube/pisaHDR/')
  .load(hdrUrls, function () {
     hdrCubeRenderTarget = pmremGenerator.fromCubemap(hdrCubeMap);
  });
```
`.setPath`, 是`HDRCubeTextureLoader类`从`Loader基类`继承而来:
![在这里插入图片描述](../../../../img/前端/2022年/7月/Three.js%20HDRCubeTextureLoader%20基于多个HDR文件的场景渲染思路/2.png)
![在这里插入图片描述](../../../../img/前端/2022年/7月/Three.js%20HDRCubeTextureLoader%20基于多个HDR文件的场景渲染思路/3.png)

---

## 1.pmremGenerator:
[three.js官方文档-pmremGenerator(无中文)](https://threejs.org/docs/index.html?q=PMREMGenerator#api/zh/extras/PMREMGenerator) 

pmremGenerator使用:
```javascript
PMREMGenerator( renderer : WebGLRenderer )
```

pmremGenerator方法, 这里只说用到的两个(自己翻译的, 有错误还请指正):

1.
调用后根据传入的普通立方体贴图生成可用于HDR或者LDR的立方体贴图.
```javascript
.fromCubemap ( cubemap : CubeTexture ) : 
```
说明: Generates a PMREM from an cubemap texture, which can be either LDR or HDR. The ideal input cube size is 256 x 256, as this matches best with the 256 x 256 cubemap output.

大意: 这个方法基于立方体贴图生成可用于LDR或HDR的PMREM(一种别致的立方体贴图). 传入的立方体贴图, 理想尺寸值是 256 x 256, 因为这个方法最适合处理256 x 256尺寸的立方体贴图.


2.
```javascript
.dispose () : undefined
```
说明: Disposes of the PMREMGenerator's internal memory. Note that PMREMGenerator is a static class, so you should not need more than one PMREMGenerator object. If you do, calling dispose() on one of them will cause any others to also become unusable.

大意: `PMREMGenerator`的内部存储配置, 注意`PMREMGenerator`是一个静态类, 所以不要同时使用一个以上的`PMREMGenerator`对象. 如果你这样做了, 可以在他们中的一个上调用`dispose()`, 这将会使所有`PMREMGenerator`对象不再可用(包括调用者).

---

## 2.HDRCubeTextureLoader: 
我们需要给`pmremGenerator`的`fromCubeMap()`传入贴图, 而我们又直接把`hdrCubeMap`(即`HDRCubeTextureLoader`)传入了`fromCubeMap()`, 那么代表着`HDRCubeTextureLoader()`一定要返回贴图, 那么也就意味着`HDRCubeTextureLoader`的功能会是——将6个HDR文件转换为贴图(`texture`), 放进`fromCubeMap()`处理成HDR贴图, 然后放进我们的场景.

HDRCubeTextureLoader源码: [hithub-HDRCubeTextureLoader](https://github.com/mrdoob/three.js/blob/master/examples/jsm/loaders/HDRCubeTextureLoader.js)

位于`example/jsm/loaders/HDRCubeTextureLoader.js`的`HDRCubeTextureLoader`方法并没有在文档里被提及, 虽然在他们自己的案例里使用了.

调用`load()` 该方法继承自`HDRCubeTextureLoader`的父类`Loader`, 对传入路径数组处理, three.js官方文档称:
"load()需要被所有具体的加载器实现."

看源码...
super()作为函数调用时代表父类的构造函数, ES6要求子类的构造函数必须调用一次super();

![在这里插入图片描述](../../../../img/前端/2022年/7月/Three.js%20HDRCubeTextureLoader%20基于多个HDR文件的场景渲染思路/4.png)

先检测传入的是不是数组, 如果不是, 后面的遍历操作会受到影响:

![在这里插入图片描述](../../../../img/前端/2022年/7月/Three.js%20HDRCubeTextureLoader%20基于多个HDR文件的场景渲染思路/5.png)

也可以看出load里可以调用`onLoad`, `onProgress`, `onError`三个回调函数.

如果不是数组, 控制台警告, 然后把传入的东西赋值到type, 卡在这一步.
```javascript
setDataType( value ) {
  this.type = value;
  this.hdrLoader.setDataType( value );

  return this;
}
```
如果传入数组, 那么正常执行,
令texture等于CubeTexture() new出的构造对象, 然后根据实际传入的值来改动texture.

![在这里插入图片描述](../../../../img/前端/2022年/7月/Three.js%20HDRCubeTextureLoader%20基于多个HDR文件的场景渲染思路/6.png)

里面的`loadHDRData`方法, 基于hdr文件改动`CubeTexture()`生成的初始贴图`texture` :

![在这里插入图片描述](../../../../img/前端/2022年/7月/Three.js%20HDRCubeTextureLoader%20基于多个HDR文件的场景渲染思路/7.png)

最后的`loaded == 6`也是可见这个方法针对HDR文件数量为6的情况.
这样会返回6份不同的, 处理完的贴图, 放在texture.image数组里.

下面的循环语句遍历每一个文件, 为其执行`loadHDRData()`, 生成贴图：

![在这里插入图片描述](../../../../img/前端/2022年/7月/Three.js%20HDRCubeTextureLoader%20基于多个HDR文件的场景渲染思路/8.png)

`HDRCubeTextureLoader`最后返回1个`texture`, `texture.images`内包含着6张根据HDR文件解析出的贴图:

![在这里插入图片描述](../../../../img/前端/2022年/7月/Three.js%20HDRCubeTextureLoader%20基于多个HDR文件的场景渲染思路/9.png)
然后将texture传给:

```javascript
//hdrCubeMap就是返回的texture,只返回这一个东西
hdrCubeRenderTarget = pmremGenerator.fromCubemap(hdrCubeMap);
```
这样经过处理, `hdrCubeRenderTarget `就包含可直接用于HDR渲染的贴图.
在render里将其加入:

```javascript
function render() {
  requestAnimationFrame(render);  //必须在最上
  
  //模型.material.envMap = fromCubemap处理过的贴图.texture
  torusMesh.material.envMap = hdrCubeRenderTarget.texture; //为模型增加场景反射 
  
  torusMesh.rotation.y += 0.005;  //模型自转
  scene.background = hdrCubeMap;  //为场景增加HDR贴图

  renderer.render(scene, camera);
}
```

---

# 三、使用方法
## 1.思路
先用`HDRCubeTextureLoader`遍历处理HDR文件, 得到贴图.
把这些贴图传入`pmremGenerator.fromCubemap()`, 处理后返回可用于HDR渲染的贴图, 然后用这些贴图去渲染场景和模型.

## 2.步骤
1.声明`pmremGenerator`对象.
```javascript
const pmremGenerator = new THREE.PMREMGenerator(renderer);  
```

2.准备HDR文件名数组
```javascript
const hdrUrls = ['px.hdr', 'nx.hdr', 'py.hdr', 'ny.hdr', 'pz.hdr', 'nz.hdr'];
```

3.创建`HDRCubeTextureLoader`, 用一个变量`hdrCubeMap `接收返回值
```javascript
hdrCubeMap = new HDRCubeTextureLoader(); 
```

4.调用`setPath()`设置HDR文件目录
```javascript
hdrCubeMap.setPath('./textures/cube/pisaHDR/');
```

5.调用load方法, 回调, 将存储`HDRCubeTextureLoader`返回值的变量传入`pmremGenerator.fromCubemap();`, 然后用`hdrCubeRenderTarget`接收处理完的HDR渲染贴图.
```javascript
hdrCubeMap.load(hdrUrls, function () {
  
    hdrCubeRenderTarget = pmremGenerator.fromCubemap(hdrCubeMap);
    
  });
```
可用于渲染的贴图存储在`hdrCubeRenderTarget.texture`里.

6.将hdr贴图加到场景

```javascript
scene.background = hdrCubeMap;
mesh.material.envMap = hdrCubeRenderTarget.texture;
```

---

# 总结
好累, 不总结了.
希望对你有帮助.