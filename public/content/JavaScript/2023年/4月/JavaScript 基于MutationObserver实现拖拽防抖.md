---
title: JavaScript 基于MutationObserver实现拖拽防抖
date: 2023-04-16
cover: /img/d5.webp
desc: JavaScript 基于MutationObserver实现拖拽防抖
tags: [JavaScript, 前端]
sticky: false
---

@[TOC](文章目录)

---

# 前言
接上回的2D标注系统, 需要在标注添加后自动为其生成一个标签, 而因为标注画板可缩放, 所以需要更新标签位置.
但这其中涉及到DOM操作, 我不想在拖拽的时候疯狂的获取DOM.

---

# 一、画布变形监听
我想用`resize`事件来着, 但这是一个DOM元素, 所以, 嗯, 泡汤了, 我不得不去找一些能监听DOM变化的方法.
发现了`MutationObserver`API(变化观察者?):
```
MDN:
MutationObserver 接口提供了监视对 DOM 树所做更改的能力。
它被设计为旧的 Mutation Events 功能的替代品，该功能是 DOM3 Events 规范的一部分。
```

依据MDN的例子:
```javascript
 // 选择需要观察变动的节点
const targetNode = document.getElementById('some-id');

// 观察器的配置（需要观察什么变动）
const config = { attributes: true, childList: true, subtree: true };

// 当观察到变动时执行的回调函数
const callback = function(mutationsList, observer) {

};

// 创建一个观察器实例并传入回调函数
const observer = new MutationObserver(callback);

// 以上述配置开始观察目标节点
observer.observe(targetNode, config);

// 之后，可停止观察
observer.disconnect();
```
我不需要监听回调中可取到的两个值`mutationsList`&`observer`(observer是观察者本身), 另外我也不需要最后一步的停止观察, 我得在用户退出系统前一直观察着才行.

我写了一个能用的demo, 先用`div`的`resize`测试一下, `div`的`resize`样式属性设置为`both`, 即允许通过拖拽右下角调整宽高(值`both`所指二者即宽高):

```html
<div id="image-wrapper"></div>
```

```javascript
class ImageEditor {
  ui = document.querySelector('#image-wrapper');

  init_observer() {
    const observer = new MutationObserver(() => { this.debounce() }); // 属性改变调用debounce
    observer.observe(this.ui, { attributes: true }); // 只需要监听自身属性改变(比如尺寸)
  }

  debounce() { // 防抖
    let timer = null;
    const that = this;
    return function () { 
    // 实际上这个函数依旧会在每次debounce调用后被压入调用栈, 只是执行是在停止拖拽1s后执行, 输出几百个'Drag End'
      if (timer !== null) {
        clearTimeout(timer);
      }
      timer = setTimeout(that.annotate_pic_update_label.bind(that), 1000);
      // annotate_pic_update_label作为setTimeout的回调, 内部this指向window
     // bind创建新函数, 其参数将作为新函数的this来解决这个问题
    }()
  }

  annotate_pic_update_label() {
    console.log('Drag End');
  }
}

const imageEditor = new ImageEditor();
imageEditor.init_observer();
```

```css
#image-wrapper {
  resize: both;
  width: 100px;
  height: 100px;
  overflow: hidden; /* resize必须在overflow:hidden下才能生效. */
  background-color: skyblue;
}
```

每次变动调用的回调函数依旧会被压进调用栈, 虽然不会边拖拽边操作, 但是拖拽结束后会进行疯狂的调用, 这样也不是很好.
可以说是失败的, 应该只要最后的结果被执行.

---
# 二、减少调用次数
原因在于用了一个自执行函数, 每次它都该执行, 但是因为计时不到所以只是压入调用栈.
但是不给`debounce`里的`function`自执行, 它又不执行了, 这样也不行...

比较致命, 或者说就是个错误的地方, 是`timer`在每次调用`debounce`时都被重置为`null`, 每次都往调用栈压东西, 改进后:
```javascript
const ui = document.querySelector('#image-wrapper');

function init() {
  const outputRes = debounce(domInfo, 1000); // 实际上是给debounce返回的函数传参, ...args = ui
  // 上面这是很关键的一步, 这使得debounce只执行一次
  const observer = new MutationObserver(() => {
    outputRes(ui)
  });
  observer.observe(ui, { attributes: true }); // 只需要监听自身属性改变(比如尺寸)
}

function debounce(fn, delay = 1000) {
  let timer = null;
  console.log('debouce') // 只输出一次
  return function (...args) { // args is ui-dom
    // console.log(timer); // 定时器编号, 仅首次null
    if (timer !== null) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  }
}

function domInfo(ele) {
  const tem = ele.getBoundingClientRect();
  console.log(tem);
  return tem;
}

init();
```
`debounce`只执行一次, 也就意味着`timer`不会在每次变动后都变为`null`然后在不清除调用栈的情况下直接向调用栈里压东西.

每次变动只是调用`debounce`返回的那个函数.

每次变动, `debounce`返回的那个函数都把上次的定时器连同其由于没到1s没来得及执行的回调函数清除掉(也从调用栈里清掉), 所以虽然`debounce`返回的函数被执行了多次, 但是边清边加(清完上一个再加一个新的), 调用栈里始终只有一个函数, 最后一次变动之后只留下了一个最新的定时器并且不再清除.
最终只执行了最后加进去的那个函数, 在1s后执行.

---
# 总结
--