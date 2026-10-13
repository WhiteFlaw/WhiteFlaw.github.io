---
title: C++指针
date: 2026-10-11
cover: /img/d4.webp
desc: C++指针
tags: [数据结构]
sticky: false
---

# "&"符号在C++中的作用
## 取地址运算符
用在表达式里：
```cpp
int a = 10;
int *p = &a;   // &a 是取 a 的地址
```
这里 &a 读作“a 的地址”。

## 引用声明符
用在声明里：
```cpp
int a = 10;
int &r = a;    // r 是 a 的引用
```

# `*`在C++里的主要身份

## 声明一个指针变量
```cpp
PNode *s; // 指向PNode的指针s, 读作"s是PNode指针"
struct PNode *next; // 指向struct PNode的指针next, 读作"next是struct PNode指针"
```

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

## 解引用
当 `*` 是一元运算符，作用在指针变量前面：
```cpp
int a = 10;
int *p = &a; // p是一个指针类型变量，类型是int *, 把a的地址存进p, 使得p指向a.
*p = 20;   // 把p指向的变量(即a)，赋值为20
```
同一个 `*`，前面声明p是一个指针类型变量，类型是int *，后面是使用指针类型变量。

---

## 指针的引用
```cpp
PNode *&P; // `P`是一个引用，引用的是一个指针, 这个指针指向`PNode`.
```
拆开看：
```cpp
PNode *  // 指针, 指向PNode的指针
&        // 引用
P        // 变量名
```
为什么需要它？如果函数内要修改外部值, 外部值A通过P传入：
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
这就像JS的对象引用, 加&的P是对A值的引用, 修改P的值会修改内存中A的值;
而不加&的P只是A值的副本, 修改它不会影响A在内存中的值.

- `*` 表示“指针”
- `&` 表示“引用”
- `PNode *&P` = “P 是 PNode 指针的引用”

---

## `typedef` 中给指针类型起别名
在结构体内部写 `struct PNode *next`的时候，`PNode`这个`typedef`(typedef就是给已有的类型起一个别名, typedef 原类型 新名字)别名还没生效，所以必须写成：`struct PNode *next`等整个`typedef`结束后，`PNode`就成了`struct PNode`的别名，于是`struct PNode *next`等价于`PNode *next`.
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

---

## 函数参数和返回值
参数：
```cpp
void f(int *p);
void g(PNode *s);
```
表示参数是指针。
```cpp
int *func();
PNode *create();
```
表示函数返回指针。

---

## 函数指针
```cpp
int (*fp)(int);
```
这里 `fp` 是一个函数指针，指向“参数为 int，返回 int”的函数。
```cpp
int *fp(int);
```
这是函数声明，表示 `fp` 是一个函数，返回 `int*`。

```cpp
int (*fp)(int);
```
表示 `fp` 是一个指针，指向函数。

---

## 数组和指针混在一起
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

## 强制类型转换
```cpp
p = (int *)q;
```
表示把 `q` 强制转换成 `int*`。

---

## 常见 C++ 星号写法速查表

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