---
title: An arithmetic operand must be of type ‘any‘, ‘number‘, ‘bigint‘ or an enum type
date: 2023-07-18
cover: /img/d5.webp
desc: An arithmetic operand must be of type ‘any‘, ‘number‘, ‘bigint‘ or an enum type
tags: [JavaScript, 前端]
sticky: false
---

# 问题描述
尝试对reactive内一Number类型变量执行++时标红.
```
An arithmetic operand must be of type 'any', 'number', 'bigint' or an enum type.
```

```typescript
type Finished = Number;
type Still = Number;

interface react {
  finished: Finished;
  still: Still;
  todos: CarInfo[];
}

const state:react = reactive({
  finished: 0,
  still: 3,
  todos: [
    { id: 1, title: "task0", isCompleted: false },
    { id: 2, title: "task1", isCompleted: true }
  ],
});

type asd = Number;
const a = ref<asd>(1);

const addToDo = function (todo: CarInfo) {
  state.todos.unshift(todo);
  state.still++; // 此处报错
};
```

---

# 原因分析：
```typescript
const book: number = 3;
```
这里的book是一个类型为基本数据类型number的值.

```typescript
const book: Number = 3;
```
这里的 Number 是一个 JavaScript 构造函数, 而不是基本数据类型. Number 对象是包装了 JavaScript 中的原始数值的对象.

在 TypeScript 中, 推荐使用小写的 number 表示基本数据类型的数值, 而不是 Number 对象. 基本数据类型更高效且更直接, 因为它在编译后被转换为原始的 JavaScript 数据类型. 而对象类型(如 Number 对象)可能导致性能下降, 因为会涉及到对象的创建和封装.

---

# 解决方案：
## 方案1: 全部Number改为首字母小写number:
```typescript
type Finished = number;
type Still = number;

interface react {
  finished: Finished;
  still: Still;
  todos: CarInfo[];
}

const state:react = reactive({
  finished: 0,
  still: 3,
  todos: [
    { id: 1, title: "task0", isCompleted: false },
    { id: 2, title: "task1", isCompleted: true }
  ],
});

type asd = number;
const a = ref<asd>(1);

const addToDo = function (todo: CarInfo) {
  state.todos.unshift(todo);
  state.still++; // 不再标红
};
```

---

## 方案2.类型推断
不推荐, 如果后面还要做这种操作, 每次都要推断.
```typescript
(state.still as number)++;
```

---