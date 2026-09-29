@[TOC](文章目录)

---

# 前言
看过不少过度嵌套的代码, 我真正意识到问题的严重性是刚入职那会, 我在一个老项目里看到了40个连续的`else if`, 套了6层的`if`, `for`和`forEach`, 因为我们并没有做什么限制代码嵌套的提前约定. 
呃, 那之后认识到`会写代码`和`代码写得好`完全是两种概念, 能够实现复杂的需求也并不能说明代码写得好, 开始注重代码结构方面.

事实是, 很多时候需要编写的逻辑本身就很恶心, 乍看之下, 堆页岩般的判定嵌套里似乎每一层都是必要的, 也只能说尽量让它看起来不那么恶心.

嗯, 比如少来几次`Tab`.

---

# 一、何为嵌套代码
嵌套代码是在函数内部添加更深层级的代码块, 放在`javascript`里, 常用的嵌套手段都包含符号'`{`', 那么对于一个代码块, 刨除平级的情况, 其内部的'`{`'越多就说明这个代码块的嵌套深度越大.
也就是: 禁止套娃.
对于以下代码, 它的嵌套深度为1:
```javascript
function fun1 () {
  console.log(1);
}
```
而如果在内部加上`if`语句, 其深度将变为2:
```javascript
function fun1 () {
  if (true) {
    console.log(1);
  }
}
```
而如果再加一个循环进去, 深度将变为3:
```javascript
function fun1 () {
  if (true) {
    for (let i = 0; i < 5; i++) {
      console.log(1);
    }
  } else {
    console.log(2);
  }
}
```
而...
好的各位, 我最多最多就到这了, 再套下去我就要开始觉得恶心了.在这里可能没有那么直观, 而这段代码放在编辑器里, `console.log`前面已经有三道竖线了, 光是`tab`提行就已经开始不舒服了.
在三层嵌套以上, 你所做的一切就不再是一套单一的算法, 这已经开始逐渐演变为多个算法的组合了, 是可以做一些封装抽离而最好不要就这样混写在一起. 
实战中三层嵌套绝对连半数以下的计算都处理不了, 那如果还有逻辑没编写呢.

---

# 二、避免嵌套
## 1.提炼抽取
`提炼(Extraction)`, 我一般管这叫抽离, 当然, 不一定要抽到外面, 只要能维持嵌套深度处于稳定的水平就好(不过函数内实在不能在消减嵌套深度那还是抽到外面形成另外一个函数吧).
比如这段嵌套:
```javascript
function fun1() {
  const arr = [1, 2, 3, 4]
  if (arr.length = 4) {
    arr.forEach((ele) => {
      if (a === 4) {
        console.log(4);
      }
    });
  }
}

fun1();
```
可以改为这样:
```javascript
function fun1() {
  const arr = [1, 2, 3, 4]
  const xxx = (a) => {
    if (a === 4) {
      console.log(4);
    }
  }
  if (arr.length = 4) {
    arr.forEach(xxx);
  }
}

fun1();
```
嵌套深度由4减小为3.

原理十分明了, 就好像在原生环境获取DOM, 有的人喜欢这样:
```javascript
function change() {
  document.querySelector("#scar").style.display = 'none';
}
```
有的人喜欢:
```javascript
function change() {
  const scar = document.querySelector("#scar");
  scar.style.display = 'none';
}
```
抽离提炼就类似于将前者转化为了后者.
封装`axios`也是一样的道理(不过那更多还是为了避免接口变动导致的被动局面).

---

## 2.反转排列
`反转(Inversion)`, 对于判定语句, 把正面条件排在负面条件前通常会需要更多的判定, 所以改为优先处理负面条件.
先把正面条件放前面:
```javascript
function justice(e) {
  if(e.length > 5) {
    for(let i = 0; i < e.length; i++) {
      console.log(e);
    }
  } else if (e.length === 2){
    return 2;
  } else {
    return false
  }
}
```
但是如果先进行负面条件判定:
```javascript
function justice(e) {
  if(e.length === 2) {
    return 2;
  } else if (e.length < 5) { // 这里也可以另起一个if, 不过这样可以节约一行 )
    return false;
  } 
  for(let i = 0; i < e.length; i++) {
    console.log(e);
  }
}
```
可以看到现在深度层级由3减小到2.
这种优化方法需要先把少数, 需要特殊处理的情况在前面解决完及时退出, 剩下的多数情况就可以不放在判定语句中.
而在这个过程中, 需要把最特殊, 且不将其他特殊情况包含在内的情况写在前面, 越特殊, 越提前处理, 此处`e.length === 2`为最特殊, 而`e.length < 5`这个特殊情况将`e.length === 2`包含在内, 所以应当第二个处理.
我在前面也写过这种做法, 将判定嵌套改为平次的卫语句, 称作`validation gatekepping`.

不过还可以在平次判定这个基础上使用这个技巧, 我们把负面情况放在靠前的平次判定处理, 如果处理中途出现过多嵌套, 那就提炼抽离, 把正面条件放最后:
```javascript
function justice(e) {
  if(e.length === 2) {
    return 2;
  }
  if(e.length === 3) {
    return 3;
  }
  if (e.length < 5) {
    return false;
  } 
  for(let i = 0; i < e.length; i++) {
    console.log(e);
  }
}
```

截取最近项目里的代码作为例子, 现在有两个world, 一个新一个旧, 如果需要让旧world的视图更新, 那么需要将新world的`world.webglGroup.children`内的元素部分替换, 其他除`world.frameInfo`外也要全替换.
```javascript
async changeWorld(oldFrame, newWorld) {
  for (const key in newWorld) {
    if (key === 'frameInfo') {
    } else if (key === 'webglGroup') {
      for (const pro in newWorld[key]) {
        if (pro === 'children') {
          this.worldList[oldWorldIndex][key][pro] = this.worldList[oldWorldIndex][key][pro].filter((ele) => { return ele.type !== 'Group' });
          this.worldList[oldWorldIndex][key][pro].push(...newWorld[key][pro].filter((ele) => { return ele.type === 'Group' }));
        } else {
          this.worldList[oldWorldIndex][key][pro] = newWorld[key][pro];
        }
      }
    } else {
      this.worldList[oldWorldIndex][key] = newWorld[key];
    }
  }
}
```
以上是初版, 现在用`Extraction`提炼和`Inversion`反转去尝试降低嵌套深度:
先把`world.webglGroup.children`局部替换的代码提炼为`replace`, 
已知`world.frameInfo`不需要替换, 那么正常的负面条件写法应当为`key === 'frameInfo'`, 但即便如此`key === 'frameInfo'`和`key === 'webglGroup'`也是必须用`else if`处理的, 如果改成平次`if`又不能终止执行, 那么这两个特殊条件在一轮循环中都会被执行.

本着要把`正面条件处理方案`写最后的原则, 直接在最后一个特殊条件不满足(按照上文所述写法, 最后一个特殊条件不满足说明前面所列特殊条件均不满足)时执行`正面条件处理方案`.
```javascript
else if (key !== 'frameInfo') {
  this.worldList[oldWorldIndex][key] = newWorld[key];
}
```
```javascript
async changeWorld(oldFrame, newWorld) {
  let oldWorldIndex = this.worldList.findIndex((w) => w.frameInfo.frame === oldFrame);
  const replace = () => {
    this.worldList[oldWorldIndex][key]['children'] = this.worldList[oldWorldIndex][key]['children'].filter((ele) => { 
      return ele.type !== 'Group';
    });
    this.worldList[oldWorldIndex][key]['children'].push(...newWorld[key]['children'].filter((ele) => { 
      return ele.type === 'Group';
    }));
  }
  for (const key in newWorld) {
    if (key === 'webglGroup') {
      replace(key);
    } else if (key !== 'frameInfo') {
      this.worldList[oldWorldIndex][key] = newWorld[key];
    }
  }
  return this.worldList[oldWorldIndex];
}
```
只是判定需求不同罢了.
上面这种写法是`在所有负面条件不满足时执行正面条件处理方案`.
前面反转的例子是`在任意负面条件不满足时结束执行`.
但遵循两种优化手段的原则都可以实施优化.

---

# 总结
--