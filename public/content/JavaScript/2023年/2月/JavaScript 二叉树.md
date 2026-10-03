---
title: JavaScript 二叉树
date: 2023-02-13
cover: /img/d1.webp
desc: JavaScript 二叉树
tags: [JavaScript, 前端]
sticky: false
---

@[TOC](文章目录)

---

# 前言
同前面说到的散列表结构, 树也是一种非顺序数据结构, 对于存储需要快速查找的数据非常有用.
我会先叙述一下何为树结构, 然后去实现一个基本功能完备的二叉树作为例子.

---

# 一、何为 '树'
在《学习JavaScript数据结构与算法》第三次修订版本中对树的定义:

```
树是一种分层的抽象数据模型.
```

现实生活中比较常见的例子是家谱和公司组织架构图, 这种结构长得很像一棵秃毛的树， 只不过有时候是左右或者上下颠倒:

![在这里插入图片描述](../../../../img/JavaScript/2023年/2月/JavaScript%20二叉树/1.png)
这是二叉树, 二叉树只是树结构中的一种, 树结构可以有多个分支.

---

## 1.根节点
一个树结构`包含` ( 因为里面不只有父子关系所以不能说这是由父子关系`构成`的) 一系列存在父子关系的节点, 树接地的部分即起始节点为根节点, 除去根节点, 每个节点都有一个父节点以及零个或多个子节点.

---

## 2.外&内部节点
至少有一个子节点的节点称为`内部节点`, 否则为`外部节点`, 这两个概念和根节点并列, 根节点既非外部节点也非内部节点, 根节点就是根节点.

---

## 3.子树
子树指该树结构内部节点构成的树结构, 存在于'树'之中:

![在这里插入图片描述](../../../../img/JavaScript/2023年/2月/JavaScript%20二叉树/2.png)
## 4.深度
一个节点的深度如何取决于其在树中的位置, 越靠近树冠, 深度越大.
具体的深度数值由其具有的祖先节点数量决定, 即'在第几层'的深度, 比如上图树冠节点算上根节点共有3个祖先节点, 那么其深度为3.

---

## 5.高度
等于树冠节点的深度, 当然, 是要取最大值的, 树冠的每个位置不一定同样深.


---

# 二、二叉树 & 二叉搜索树
其实上面画的图都是二叉树.

```
二叉树中的节点最多只能有两个子节点, 一个是左侧子节点, 一个是右侧子节点.
```

二叉搜索树(`BinarySearchTree`)是二叉树的一种, 它只允许在左侧节点存储比父节点小的值, 在右侧节点存储比父节点大的值.
创建一个类来代表二叉搜索树中的每个节点:

```javascript
export class Node {
  constructor (key) {
    this.key = key; // 节点值
    this.left = null; // 右侧子节点引用
    this.right = null; // 左侧子节点引用
  }
}
```

再创建一个二叉搜索树:

```javascript
import { Compare, defaultCompare } from '../util';
import { Node } from './models/node';

export default class BinarySearchTree {
  constructor (compareFn = defaultCompare) {
    this.compareFn = compareFn; // 用来比较节点值的函数
    this.root = null;
  }
}
```

```javascript
export const Compare = {
  LESS_THAN: -1,
  BIGGER_THAN: 1,
  EQUALS: 0
};

export function defaultCompare(a, b) {
  if (a === b) {
    return Compare.EQUALS;
  }
  return a < b ? Compare.LESS_THAN : Compare.BIGGER_THAN;
}
```

---

## 1.二叉搜索树插入值
首先验证特殊情况, 如果需要插入的节点是根节点(现在树上什么都没有), 那么只需要创建一个`Node`实例并将这个实例赋值到`this.root`来将`root`指向这个新的节点, 而如果并非特殊情况则交付正常增添函数处理:
```javascript
// 前置判定
insert (key) {
  if (this.root == null) {
    this.root = new Node(key);
  } else {
    this.insertNode(this.root, key);
  }
}
```

`insertNode`会在递归中运用, 所以里面会有'当前节点'这样的概念.
```javascript
insertNode (node, key) { // 当前节点(非根节点) & 要插入的节点
  if (this.compareFn(key , node.key) === Compare.LESS_THAN) { // 如果要插入的节点比当前节点小(那么应当加在左子节点)
    if (node.left == null) { // 并且当前节点的左子节点为null, 那么就顺利的将更小的值加到左分支
      node.left = new Node(key);
    } else {
      this.insertNode(node.left, key); 
      // 如果左子节点有值那么需要比较现左子节点值和新值, 更大的留在该位置, 小的排在下一个(不一定是下一个)左子分支
    }
  } else { // 如果要插入的节点比当前节点大(那么应该插入到右子节点)
    if (node.right == null) { // 右子节点没值, 直接加
      node.right = new Node(key);
    } else { // 有值, 比较一下现右子节点值和新值, 更小的留在该位置, 大的排到下一个(不一定是下一个)右子分支
      this.insertNode(node.right, key);
    }
  }
}
```

建个树试一下:

```javascript
const Compare = {
  LESS_THAN: -1,
  BIGGER_THAN: 1,
  EQUALS: 0
};

function defaultCompare(a, b) {
  if (a === b) {
    return Compare.EQUALS;
  }
    return a < b ? Compare.LESS_THAN : Compare.BIGGER_THAN;
}

class Node {
  constructor(key) {
    this.key = key;
    this.left = null;
    this.right = null;
  }
}

class BinarySearchTree {
  constructor(compareFn = defaultCompare) {
    this.compareFn = compareFn;
    this.root = null;
  }
  insert(key) {
    if (this.root == null) {
      this.root = new Node(key);
    } else {
      this.insertNode(this.root, key);
    }
  }
  insertNode(node, key) {
    if (this.compareFn(key, node.key) === Compare.LESS_THAN) {
      if (node.left == null) {
        node.left = new Node(key);
      } else {
        this.insertNode(node.left, key);
      }
    } else {
      if (node.right == null) {
        node.right = new Node(key);
      } else {
        this.insertNode(node.right, key);
      }
    }
  }
}

var tree = new BinarySearchTree();
const arr = [11, 7, 15, 5, 3, 9, 8, 10, 13, 12, 14, 20, 18, 25];

for (let i = 0; i < arr.length; i++) {
    tree.insert(arr[i]);
}

console.log(tree);
```

![在这里插入图片描述](../../../../img/JavaScript/2023年/2月/JavaScript%20二叉树/3.png)

---

## 2.遍历二叉搜索树
访问二叉树的每一个节点并对其实施操作, 有中序, 先序和后序三种方式.

### I.中序遍历
中序遍历以上行顺序访问所有树节点, 即以最小到最大的方式遍历
```javascript
inOrderTraverse (callback) {
  this.inOrderTraverseNode (this.root, callback);
}

inOrderTraverseNode (node, callback) {
  if (node !== null) { // 基线条件
    this.inOrderTraverseNode (node.left, callback);
    callback(node.key);
    this.inOrderTraverseNode(node.right, callback);
  }
}

printNode (value) {
  console.log(value);
}
tree.inOrderTraverse(printNode);
```

加到树内:

```javascript
const Compare = {
  LESS_THAN: -1,
  BIGGER_THAN: 1,
  EQUALS: 0
};

function defaultCompare(a, b) {
  if (a === b) {
    return Compare.EQUALS;
  }
  return a < b ? Compare.LESS_THAN : Compare.BIGGER_THAN;
}

function printNode(value) {
  console.log(value);
}

class Node {
  constructor(key) {
    this.key = key; // 节点值
    this.left = null; // 右侧子节点引用
    this.right = null; // 左侧子节点引用
  }
}

class BinarySearchTree {
  constructor(compareFn = defaultCompare) {
    this.compareFn = compareFn; // 用来比较节点值的函数
    this.root = null;
  }
  
  insert(key) {
    if (this.root == null) {
      this.root = new Node(key);
    } else {
      this.insertNode(this.root, key);
    }
  }
  
  insertNode(node, key) {
    if (this.compareFn(key, node.key) === Compare.LESS_THAN) {
      if (node.left == null) {
        node.left = new Node(key);
      } else {
        this.insertNode(node.left, key);
      }
    } else {
      if (node.right == null) {
        node.right = new Node(key);
      } else {
      this.insertNode(node.right, key);
      }
    }
  }
  
  inOrderTraverse(callback) {
    this.inOrderTraverseNode(this.root, callback);
  }

  inOrderTraverseNode(node, callback) {
    if (node !== null) { // 基线条件
      this.inOrderTraverseNode(node.left, callback);
      callback(node.key);
      this.inOrderTraverseNode(node.right, callback);
    }
  }
}

var tree = new BinarySearchTree();
const arr = [11, 7, 15, 5, 3, 9, 8, 10];

for (let i = 0; i < arr.length; i++) {
  tree.insert(arr[i]);
}

tree.inOrderTraverse(printNode);
console.log(tree);
```

![在这里插入图片描述](../../../../img/JavaScript/2023年/2月/JavaScript%20二叉树/4.png)

如果当前节点存在右分支(右分支不存在会被阻止), 那么执行完左分支再执行右分支.
到了右分支如果发现了左分支也会再优先执行左分支.

![在这里插入图片描述](../../../../img/JavaScript/2023年/2月/JavaScript%20二叉树/5.png)
放在此处, 从11开始, 检查到7和15两个子分支, 先检查7的左分支5再检查5的左分支3, 全部检查完堆好了执行栈开始执行, 5结束后7的左支完成开始执行7的右支, 7的右支9上有左支8于是先输出8.
输出了10之后整个7分支执行完毕, 输出11后11的左支完成, 开始执行11的右支输出15.

---

### II.先序遍历
这东西看起来就只是跟中序遍历换了一下输出位置:

```javascript
inOrderTraverse (callback) {
  this.inOrderTraverseNode (this.root, callback);
}

inOrderTraverseNode (node, callback) {
  if (node !== null) { // 基线条件
    callback(node.key);
    this.inOrderTraverseNode (node.left, callback);
    this.inOrderTraverseNode(node.right, callback);
  }
}

printNode (value) {
  console.log(value);
}
tree.inOrderTraverse(printNode);
```

但其实执行逻辑是有比较大的变动的, 中序遍历里我们明明从根节点出发, 但是却先输出了左侧最深的子节点, 这是优先访问子节点再访问自身, 但是先序遍历则是先访问自身再访问子节点.
这个逻辑更加通畅, 看起来更合理:

![在这里插入图片描述](../../../../img/JavaScript/2023年/2月/JavaScript%20二叉树/6.png)
![在这里插入图片描述](../../../../img/JavaScript/2023年/2月/JavaScript%20二叉树/7.png)
优先执行左分支, 11到左分支: 7左分支, 7左分支: 5, 5左分支3, 全部完成后, 7右分支: 9, 9左分支: 8, 9右分支: 10.
然后11右分支15.

--- 

### III.后序遍历
看起来仍旧只是变化了输出位置, 但逻辑正好与先序遍历相反, 先序遍历会先访问节点本身, 所有不先访问节点本身的都是从树冠往回输出, 而后序遍历在这基础上遍历完左分支后并不先回调回到节点本身, 而是先去右分支, 再回到节点本身:

```javascript
const Compare = {
  LESS_THAN: -1,
  BIGGER_THAN: 1,
  EQUALS: 0
};

function defaultCompare(a, b) {
  if (a === b) {
    return Compare.EQUALS;
  }
  return a < b ? Compare.LESS_THAN : Compare.BIGGER_THAN;
}

function printNode(value) {
  console.log(value);
}

class Node {
  constructor(key) {
    this.key = key;
    this.left = null;
    this.right = null;
  }
}

class BinarySearchTree {
  constructor(compareFn = defaultCompare) {
    this.compareFn = compareFn;
      this.root = null;
  }
    insert(key) {
        if (this.root == null) {
            this.root = new Node(key);
        } else {
            this.insertNode(this.root, key);
        }
    }
    insertNode(node, key) {
        if (this.compareFn(key, node.key) === Compare.LESS_THAN) {
            if (node.left == null) {
                node.left = new Node(key);
            } else {
                this.insertNode(node.left, key);
            }
        } else {
            if (node.right == null) { // 右子节点没值, 直接加
                node.right = new Node(key);
            } else {
                this.insertNode(node.right, key);
            }
        }
    }
    inOrderTraverse(callback) {
        this.inOrderTraverseNode(this.root, callback);
    }

    inOrderTraverseNode(node, callback) {
        if (node !== null) { // 基线条件
            this.inOrderTraverseNode(node.left, callback);
            this.inOrderTraverseNode(node.right, callback);
            callback(node.key);
        }
    }
}

var tree = new BinarySearchTree();
const arr = [11, 7, 15, 5, 3, 9, 8, 10, 13, 12, 14, 20, 18, 25];

for (let i = 0; i < arr.length; i++) {
    tree.insert(arr[i]);
}

tree.inOrderTraverse(printNode);
```
![在这里插入图片描述](../../../../img/JavaScript/2023年/2月/JavaScript%20二叉树/8.png)
![在这里插入图片描述](../../../../img/JavaScript/2023年/2月/JavaScript%20二叉树/9.png)

## 3.查找节点
传入一个起始节点和一个值, 查找某属性为该值的节点.
递归, 每次把当前节点和需要查找的节点比较一下大小以确认下一步是向左or向右查找, 此外如果相等就返回.
```javascript
search (key) {
  return this.searchNode(this.root, key);
}

searchNode(node, key) {
  if (node == null) { // 你在找什么?
    return false;
  }
  if (this.compareFn(key, node.key) === Compare.LESS_THAN) { // 如果当前值大于待查值那么往左找
    return this.searchNode(node.left, key);
  } else if (this.compareFn(key, node.key) === Compare.BIGGER_THAN) { // 如果当前值小于待查值那么往右找
    return this.searchNode(node.right, key);
  } else { // 相等, 返回
    console.log(node)
    return node;
  }
}
```

## 4.移除节点
难点在于移除一个非树冠节点后剩下的节点该做什么处理以确保树的结构依然正确.
原书使用了一个函数来处理('这是我们在本书中要实现的最复杂的方法'), 这里抽离成两部分, 第一部分查找, 第二部分专用于去除.
```javascript
remove(node, key) { // 查找方向确定, 查找
  if (node == null) {
    return null;
  }
  if (this.compareFn(key, node.key) === Compare.LESS_THAN) { // 向左一路找下去
    node.left = this.remove(node.left, key);
    return node;
  }
  if (this.compareFn(key, node.key) === Compare.BIGGER_THAN) { // 向右一路找下去
    node.right = this.remove(node.right, key);
    return node;
  } else {
    removeNode(node, key); // 相等, 交付removeNode处理
  }
}

removeNode(node, key) {
  if (node.right == null && node.left == null) {
    node = null;
    return node;
  }
  if (node.right == null) {
    node = node.left;
    return node;
  } else {
    node = node.right;
    return node;
  }
  // 有两个子节点的节点
  const aux = this.minNode(node.right); // 获取右侧子树中最小的节点(不一定是它的直接子节点)
  node.key = aux.key; // 右侧子树最小节点赋值到该节点, 该节点值此时合理, 但是存在了两个重复节点
  node.right = this.remove(node.right, aux.key); // 删除右侧子树最小节点以去重
  return node;
}
```

---

# 总结
本来应该叫'JavaScript 树'的, 但是我一直在说二叉树...整个篇幅基本给了二叉树, 然后索性就叫二叉树了.
栈的话前一段时间做了个撤销恢复功能, 用双端队列改造了一下限制了步数.
这种结构目前没想到要怎么去应用, 或许在使用一些库的时候能用到?