---
title: Javascript利用对象池避免频繁的垃圾回收
date: 2024-09-08
cover: /img/d1.webp
desc: Javascript利用对象池避免频繁的垃圾回收
tags: [CSS, 前端]
sticky: false
---

 
# 一、使用场景
过于频繁的垃圾回收会影响性能，而垃圾回收的发起又并非我们所能直接控制。

但可以通过控制住满足垃圾回收的条件的场景的出现频率，以间接的控制垃圾回收的发起. 

比如在需要频繁调用的工具函数中，你难免会用到一些临时变量，而函数调用结束它们就会超出作用域导致回收发起. 
为少量的对象构建一个管理器是没有必要的，节省不了多少性能. 

不知你是否玩过一款古老的弹幕射击游戏《東方project》，如果每一颗弹幕都是一个对象，且其一旦离开视野就应该回收，那么，那样规模的弹幕会造成频繁的回收，进而引起性能问题.

---

# 二、对象池是什么
对象池用来维护一些对象，应用程序可以向这个对象池请求对象，设置其属性并使用，结束后再还给对象池. 
在这个过程中没有发生对象初始化，所以垃圾回收机制判定没有发生对象更替，回收也就不会频繁进行. 

如果你以前就接触过一些原生项目，你会发现里面有大量的管理器结构，一个管理器维护着众多同类型的实例（本例中不同类型的对象也可以用同一个管理器），并拥有批量操作他们的方法. 
对象池说白了也是一种管理器，这样去看就比较好理解. 


---
# 三、如何构建一个对象池
使用某种结构维护所有对象，数组是一个好选择（但注意操作数组时若在一开始就给出确定的长度，要注意控制内部元素的数量，如果超出，引擎会删掉原数组建立一个能放得下的新数组，这个删除操作又会引起回收 ），你可以把它看成一种队列结构. 


---
## 1.目的
利用对象模板函数初始化对象，对象放入对象池中维护，剩下的事情，例如对象内部属性的细致差别，等到对象被借出的时候在外面操作. 

---

## 2.对象模板函数
被管理的对象之所以能被统一管理必然是因为他们有共性，这些相同的部分没必要在每次构建子对象都写一遍，用一个函数实现即可.

```javascript
const objectTemplate = function() {
  return {
    useing: false, // 是否借出使用中
    allocate: function() {
      this.useing = true;
   },
    free: function() {
      this.useing = false；
    },
    usable: function() {
      return useing;
    }
  }
}
```

---
## 3.对象池
最开始池是空数组，遵循先填满再复用的原则，先填满也是为了给元素加id以便回收，因为那是对象，你不好去比对池内外是否是同一个. 

```javascript
const objectPool = function (object Formatter) { 
  const length = 10; // 长度
  const size = 0; // 实际元素数
  let pool = new Array(length);
  const allocate = function() { 
    if (size != length) {
      pool[size] = objectFormatter();
      pool[size].allocate();
      pool[size].id = size;
      size++;
      return pool[size-1];
    } else {
      if(pool[length-1].usable()) { 
      /* 启用的obj会被立即挪到队首, 所以若队末的obj都不可用说明池内全部obj被占用中. */
      pool[length-1].allocate(); 
      pool.unshift(pool.pop());
      return pool[0];
    } else {
      console.warn ('No extra objects.');
    }
  }
  const free = function(obj) {
    obj.free();
    // 先把obj还原成初始干净对象（此处未还原）
    // 并且此时它可能已经夹在两个启用项中间了，把它提出来放回队尾备用
    pool.splice(pool.findIndex(obj => id == obj.id), 1)
    pool.push(obj);
  }
}
```

在外部向对象池借用对象并添加属性；
以及归还对象，归还前要把对象处理成借出时的原样，不然下次再借出来就是一个用过的对象；

```javascript
let v1 = objectPool.allocate();
let v2 = objectPool.allocate();

v1.x = 10;

objectPool.free(v1);

v1 = null; // 解除这个变量和对象的引用关系以发起对其的回收
```
不需要把借出去的对象再添加pool一次，本来也没从对象池里删掉，只是归还时可用的对象要放到队尾所以调一下位置（只是我按这样的规定写，非硬性需求）.

---

# 结语
最近挤不出时间写，看到有用的东西找机会整理上来吧. 
几个月没上线，平台把文章都加上vip了，昨天解了好多，后面会继续解完.：）
