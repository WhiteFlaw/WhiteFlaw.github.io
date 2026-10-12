---
title: C++指针
date: 2026-10-11
cover: /img/d4.webp
desc: C++指针
tags: [数据结构]
sticky: false
---

# `*`在C++里的主要身份

## 1.乘法

两边都有东西：

```cpp
a * b
2 * x
p * q
```

这是普通乘法。

---

## 2.声明一个指针变量
```cpp
PNode *s; // 指向PNode的指针s, 读作"s是PNode指针"
struct PNode *next; // 指向struct PNode的指针next, 读作"next是struct PNode指针"
```
在结构体内部写 `struct PNode *next`的时候，`PNode`这个`typedef`(typedef就是给已有的类型起一个别名, typedef 原类型 新名字)别名还没生效，所以必须写成：`struct PNode *next`等整个`typedef`结束后，`PNode`就成了`struct PNode`的别名，于是`struct PNode *next`等价于`PNode *next`

如果有多个变量, 比如:
```cpp
int *a, b;
```
这里只有 `a` 是指针，`b` 是普通 `int`。

所以很多人喜欢写成:
```cpp
int* a;
int b;
```
避免误会。

---

## 3.解引用
当 `*` 是一元运算符，作用在指针变量前面：
```cpp
int a = 10;
int *p = &a; // p是一个指针类型变量，类型是int *, 把a的地址存进p, 使得p指向a.
*p = 20;   // 把p指向的变量(即a)，赋值为20
```
同一个 `*`，前面声明p是一个指针类型变量，类型是int *，后面是使用指针类型变量。

---

# "&"符号在C++中的作用
## 1.取地址运算符
用在表达式里：
```cpp
int a = 10;
int *p = &a;   // &a 是取 a 的地址
```
这里 &a 读作“a 的地址”。

## 2.引用声明符
用在声明里：

cpp
int a = 10;
int &r = a;    // r 是 a 的引用

## 4.指针的引用
```cpp
PNode *&P; // `P`是一个引用，引用的是一个指针, 这个指针指向`PNode`.
```
拆开看：
```cpp
PNode *  // 指针, 指向PNode的指针
&        // 引用
P        // 变量名
```

为什么需要它？因为函数里要改外部的指针：
```cpp
void CreatePolyn(PNode *&P, int n)
{
    P = new PNode;   // 修改P指向新的PNode结点
}
```
如果写成：
```cpp
void CreatePolyn(PNode *P, int n)
{
    P = new PNode;   // 只修改函数内部的副本
}
```
外面的指针不会变。

所以 `*&` 连在一起时，不要慌：

- `*` 表示“指针”
- `&` 表示“引用”
- `PNode *&P` = “P 是 PNode 指针的引用”

---

## 6`typedef` 中给指针类型起别名

```cpp
typedef int *IntPtr;
typedef struct PNode *Polynomial;
```

这里别名是：

```cpp
IntPtr
Polynomial
```

不是：

```cpp
*IntPtr
*Polynomial
```

`*` 只是说明：

> `IntPtr` 这个别名本身是一个指针类型。  
> `Polynomial` 这个别名本身是一个指针类型。

所以以后写：

```cpp
Polynomial P;
```

等价于：

```cpp
PNode *P;
```

写：

```cpp
Polynomial &P
```

等价于：

```cpp
PNode *&P
```

---

### 1.7 函数参数和返回值

参数：

```cpp
void f(int *p);
void g(PNode *s);
```

表示参数是指针。

返回值：

```cpp
int *func();
PNode *create();
```

表示函数返回指针。

---

### 1.8 函数指针

```cpp
int (*fp)(int);
```

这里 `fp` 是一个函数指针，指向“参数为 int，返回 int”的函数。

注意括号：

```cpp
int *fp(int);
```

这是函数声明，表示 `fp` 是一个函数，返回 `int*`。

而：

```cpp
int (*fp)(int);
```

表示 `fp` 是一个指针，指向函数。

---

### 1.9 数组和指针混在一起

指针数组：

```cpp
int *arr[10];
```

表示：`arr` 是数组，里面有 10 个 `int*`。

数组指针：

```cpp
int (*arr)[10];
```

表示：`arr` 是一个指针，指向“有 10 个 int 的数组”。

---

### 1.10 强制类型转换

```cpp
p = (int *)q;
```

表示把 `q` 强制转换成 `int*`。

---

### 1.11 `const` 和指针

```cpp
const int *p;  // p 指向的值不能改
int * const p; // p 本身不能改，但指向的值可以改
```

星号位置不同，含义不同。

---

## 2. 回到你的代码

```cpp
typedef struct PNode
{
    float coef;
    int expn;
    struct PNode *next;
} PNode, *Polynomial;
```

拆成两个 `typedef`：

```cpp
typedef struct PNode PNode;          // PNode 是 struct PNode 的别名
typedef struct PNode *Polynomial;    // Polynomial 是 struct PNode * 的别名
```

所以：

```cpp
Polynomial == struct PNode *
```

或者：

```cpp
Polynomial == PNode *
```

也就是说：

> 别名是 `Polynomial`，不是 `*Polynomial`。  
> `*` 只是说明这个别名本身是一个指针类型。

---

## 3. 函数参数解析

```cpp
void CreatePolyn(Polynomial &P, int n)
```

展开就是：

```cpp
void CreatePolyn(PNode *&P, int n)
```

再用人话读：

> `P` 是一个引用，引用的是 `PNode*` 指针。  
> 也就是：传进来一个多项式头指针，并且允许函数修改这个头指针本身。

函数里：

```cpp
P = new PNode;
P->next = NULL;
```

因为 `P` 是外部头指针的引用，所以外面的 `Polynomial L;` 传进来后，`L` 会真正被赋值。

如果写成：

```cpp
void CreatePolyn(Polynomial P, int n)
```

那 `P` 只是指针的副本，函数里 `P = new PNode;` 不会影响外面。

---

## 4. `PNode *s = new PNode;`

```cpp
PNode *s = new PNode;
```

这里有两个 `*` 相关概念：

- `PNode *s`：声明 `s` 是 `PNode` 指针。
- `new PNode`：动态分配一个 `PNode`，返回 `PNode*`。

然后：

```cpp
s->coef = ...;
```

等价于：

```cpp
(*s).coef = ...;
```

`->` 就是“指针访问成员”的语法糖。

---

## 5. 常见 C++ 星号写法速查表

| 写法 | 含义 |
|---|---|
| `a * b` | 乘法 |
| `int *p;` | 声明 p 是 int 指针 |
| `*p = 10;` | 解引用 p |
| `int **pp;` | pp 是二级指针 |
| `int *&r = p;` | r 是 int 指针的引用 |
| `typedef int *IntPtr;` | IntPtr 是 int 指针类型别名 |
| `IntPtr p;` | p 是 int 指针 |
| `IntPtr &r = p;` | r 是 int 指针的引用，等价 `int *&r = p;` |
| `int (*fp)(int);` | fp 是函数指针 |
| `int *arr[10];` | arr 是数组，元素是 int* |
| `int (*arr)[10];` | arr 是指针，指向 int[10] |
| `(int *)p` | 强制类型转换 |
| `const int *p;` | p 指向的值不能改 |
| `int * const p;` | p 本身不能改，指向的值可以改 |

---

## 6. 怎么避免懵

看到 `*` 先问自己：

1. 它在表达式里吗？  
   - 比如 `a * b`，那是乘法。  
   - 比如 `*p`，那是解引用。

2. 它在声明里吗？  
   - 比如 `int *p;`、`PNode *s;`，那是在声明指针。

3. 它和 `&` 一起出现吗？  
   - 比如 `PNode *&P;`，那是“指针的引用”。

4. 它在 `typedef` 里吗？  
   - 比如 `typedef PNode *Polynomial;`，那是给“指针类型”起别名，别名本身不带 `*`。

5. 它和 `[]`、`()` 混在一起吗？  
   - 那就要小心函数指针、数组指针，从里往外读。

---

## 7. 一句话总结你的代码

```cpp
typedef struct PNode *Polynomial;
```

意思是：

> `Polynomial` 就是 `PNode*`。

所以：

```cpp
void CreatePolyn(Polynomial &P, int n)
```

就是：

```cpp
void CreatePolyn(PNode *&P, int n)
```

意思是：

> `P` 是 `PNode` 指针的引用，函数可以修改外部传进来的多项式头指针。

你看到 `Polynomial &P` 没有星号，不是没用到星号，而是星号已经藏在 `Polynomial` 这个别名里了。

C++ 这玩意确实逆天，但拆开看，它无非就是：

> **类型、声明符、运算符，三个东西挤在一起了。**