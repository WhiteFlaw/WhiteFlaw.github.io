---
title: Vue权限控制
date: 2021-07-26
cover: /img/d1.webp
desc: Vue权限控制
tags: [Vue, 前端]
sticky: false
---

 

<hr style=" border:solid; width:100px; height:1px;" color=#000000 size=1">

# 前言
1.如果您有Vue-router基础,那么放心食用本文吧.
2.本文只介绍beforeEach法;
3.vue-router2.2以上版本的addRoutes()动态路由注入法可以更好地实现权限系统,我会在后续的更新(二)里补全.

<hr style=" border:solid; width:100px; height:1px;" color=#000000 size=1">

# 一、路由元信息和beforeEach()
用户点击某个模块会让URL发生变化,进而带动router执行切换页面的动作,那么只要阻止路由跳转或者让路由定向跳转就能实现阻止用户进入某些高权限页面.
但在开始之前,我还要给您介绍两样东西:
## 1、路由元信息
您可能没听说过这个词,不用着急;
我不给您扯那些官方文案了,路由元信息在meta对象里配置,一个元信息针对一份路由,在其内部可以写键值对,即一对自定义字节和他们的值:

```typescript
  {
    path: '/userinfo',
    name: 'Userinfo',
    //路由元信息meta;
    meta: {  
      istoken: true
    //自定义字节istoken,值为true;
    },
```
就是这样了,我不深说了,因为这里我们只是需要用meta对象内的键值对作为该路由记录是否需要执行beforeEach异步判断和需要执行判断时需要执行哪个beforeEach()的判别条件.

## 2、beforeEach()
router.beforeEach() 用来规定一些进入页面的限制,比如不登陆无法进入
你可以拿到一些有关用户账号权限的关键信息(比如meta信息),在里面做一些判断,然后利用beforeEach()的next()方法来告诉路由这波怎么说(是把尊敬的用户踹回去登录还是让他进页面);
```typescript
//注意这里传入的三个参数;
 router.beforeEach((to, from, next) => {
  if (基于meta或其他关键信息进行的判断) {
    //需要进行的操作;
  }
  next()
}) 
```
我想你该看到那上面传进去了三个参数......
| 参数 | 作用 |
|--|--|
| to | 本次路由跳转的终点,锁定目标页面的路由对象 |
| from | 本次路由跳转的起点,锁定当前页面的路由对象 |
| next | 进行下一个钩子,类似"接下来要干的事"的意思吧,有点像then()? |


在index.js(就是写路由表的那个文件)里可以写这个beforeEach(),记得写在router创建后:

```typescript
const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})
//router.beforeEach()的位置
```

# 二、权限管理
## 1、路由比较少的情况
.<strong>一般来说用户登录后账号信息会从后端发来,然后你setItem()存储到本地(localStorage)放在token或者cookie,就可以拿getItem()获取来用了;</strong>
我觉得你也可以简单粗暴一点把能访问1,2,3页面的用户添加到1,2,3页面的meta里,然后到时候他一登录,路由守卫把你meta里那几个人挨个儿过一遍,只要有个条件跟他匹配就行,不过要是你这网站用户很多,这一个个录人估计也是挺蛋疼的......

下面就是针对多页面多路由的情况了,都需要遍历.
## 2、多路由-遍历to.matched
推荐使用to.matched来进行遍历,to.matched数组中保存着匹配到的所有路由信息;
我们来看看官方的说法吧:
"一个路由匹配到的所有路由记录会暴露为 $route 对象或导航守卫中路由对象的 $route.matched 数组。
因此,我们需要遍历 $route.matched来检查每份路由中的meta字段,来判断这个beforeEach该用于哪份路由."
```javascript
router.beforeEach((to, from, next) => {
  //some检测to.match数组中的元素的meta里是否有requiresAuth;
  if (to.matched.some(record => record.meta.requiresAuth)) {
  //some方法测试数组中是否有至少一个元素通过了判断。返回布尔值。
    if (!auth.loggedIn()) {
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
    } else {
    next() // 确保一定要调用 next(),否则钩子不会被resolve;
  }
})
```
遍历to.matched和上面官方文档说的"遍历 $route.matched"大概是在遍历同一个数组, $route是当前激活的路由,to是我们要去到的路由,在我们使用next()把路由阻拦回去之前,to所对应的路由是被激活的,所以我想这个to和 $route所对应的路由该是同一个路由的,那么to.match和 $route.match指的也应该是同一个数组.
你要知道, Vue在匹配路由时会匹配到所有符合的路由,也就是说只要你path里出现了这段字符串,我就认为你有这段路由:

```javascript
path:"/page1/page2/page3"
/* 匹配到的路由:/page1 & /page1/page2 & /page1/page2/page3 */
```
这就有个好处,就是你遍历完正确的数组之后,可以把所有需要控制的页面全都提权,就是给那个URL最长的高级路由加meta字段,比如我不想让没注册的用户进入个人中心,我就直接给"个人中心/用户详情/文章列表/举报文章"(举个例子,别手滑给咱举报了)页面的路由加上meta,这样整个个人中心都进不来了.<strong>这样是最好,你也可以只给一级路由添加meta判断,一般用户都是一层一层的点进去看,但要是哪天遇见个离谱的老哥直接输二级路由的URL,那是可以直接进到你的二级路由的,虽然一级路由进不去.</strong>(啊当然你要是耐心的把每个把二级路由单独加判断...那当我没说咯).

<hr style=" border:solid; width:100px; height:1px;" color=#000000 size=1">

# 总结
今天做登录系统用到了这个,想着先记下来,这种方案并不是最优解,开头提到的动态路由注入博主在学了,估计比较快就能更出来;
感谢您的支持,这是博主个人的一些认识,欢迎你指出我的错误,如果对你有帮助,我很高兴;