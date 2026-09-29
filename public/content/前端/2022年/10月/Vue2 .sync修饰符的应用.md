@[TOC](文章目录)

---

# 前言
Vue2 .sync修饰符的使用.

---


# 一、场景
经常遇到需要关闭各种弹窗的情况, 基于`Element`的话, 基本就是大量监听`close`事件, 常用的做法是用一个`visible`属性来使父子组件建立联系, 控制作为子组件的弹窗的显示隐藏, 那么必然要面临父子组件内`visible`的同步问题.

你不能让父组件内的`visible`受到事件影响变为`true`的情况下, 子组件弹窗里直接控制`el-dialog`显隐的`visible`属性依旧是`false`吧? 
同理弹窗关闭后子组件也需要向父组件同步`visible`为`false`, 两边始终保持一致才好.

我刚开始给出的思路比较简单, 在我不知道这个修饰符的情况下.
就是用`props`和`$emit`, 对, 就这样互相传, 子组件有关闭事件就向父组件`$emit`传值来同步.

原始基本是这样, 可以跑一下:

```html
<!-- 子组件son -->
<template>
  <div class="son" v-show="nowVisible">
    <p>{{ nowVisible }}</p>
    <button @click="closeSon">click to close son</button>
  </div>
</template>
<script>
export default {
  name: 'son',
  props: {
    visible: {
      type: Boolean,
      default: () => false
    }
  },
  data() {
	dialogVisible: this.visible
  },
  watch: {
    visible: {
      handler(newVal) {
        this.nowVisible = newVal;
      },
    },
  },
  methods: {
	closeSon() {
	  this.$emit('closeSon', false);
	}
  }
}
</script>
```
```html
<!-- 父组件fa -->
<template>
  <div class="fa">
    <button @click="showSon">click to show son</button>
    <son :visible.sync="faNowVisible"></son>
  </div>
</template>

<script>
import son from "../components/son";
export default {
  name: "fa", // 名字错了会导致栈溢出, 不可忽视
  components: { // 就是要加s, 一个也要加
    son,
  },
  data() {
    return {
      sonInfo: [],
      faNowVisible: false,
    };
  },
  methods: {
    showSon() {
      this.faNowVisible = true;
    },
  },
};
</script>
```
不过每做一个任务都要来这么几次多少就有点麻烦了, 而且两头开工容易出错.

`.sync`修饰符可以作为这种 父子组件需要同步参数 的情况的解决方案, 更简易的实现上述.

---

# 二、.sync
在原例上稍微改动一下来理解 , 你可以把我写的`update`事件理解成`emit`发送的显示更新事件`update:xxx`里的`update`.

```html
<!-- 子组件son -->
<template>
  <div class="son" v-show="nowVisible">
    <p>{{ nowVisible }}</p>
    <button @click="closeSon">click to close</button>
  </div>
</template>

<script>
export default {
  name: "son",
  props: {
    visible: {
      type: Boolean,
      default: () => false,
    }
  },
  data() {
    return {
      nowVisible: this.visible,
    };
  },
  watch: {
    visible: {
      handler(newVal) {
        this.nowVisible = newVal;
      },
    },
  },
  methods: {
    closeSon() {
      this.$emit('update')
      this.nowVisible = false
    }
  },
};
</script>
```

```html
<!-- 父组件fa -->
<template>
  <div class="fa">
    <button @click="showSon">click to show</button>
    <son :visible="faNowVisible" @update="hideSon"></son>
  </div>
</template>

<script>
import son from "../components/son";
export default {
  name: "fa",
  components: {
    son,
  },
  data() {
    return {
      faNowVisible: false,
    };
  },
  methods: {
    showSon() {
      this.faNowVisible = true;
    },

    hideSon() {
      this.faNowVisible = false;
    }
  },
};
</script>
```
基本原理是这样, 和`emit`的思路差的不多, 实际执行的时候基本是这样:

```html
<son :visible="faNowVisible" @update:visible="hideSon"></son>
```

```javascript
//hideSon是我抽离出来的, 不用抽
hideSon(params) { // params就是emit携带的参数
  this.faNowVisible = params;
}
```

合并:
```html
<son :visible.sync="faNowVisible"></son>
```

---

# 三、使用例
在父组件click按钮, 打开子组件, 点击子组件内按钮关闭子组件.

```html
<!-- 父组件fa -->
<template>
  <div class="fa">
    <button @click="showSon">click to show</button>
    <son :visible.sync="faNowVisible"></son>
  </div>
</template>

<script>
import son from "../components/son";
export default {
  name: "fa",
  components: {
    son,
  },
  data() {
    return {
      faNowVisible: false,
    };
  },
  methods: {
    showSon() {
      this.faNowVisible = true;
    }
  },
};
</script>
```

```html
<!-- 子组件son -->
<template>
  <div class="son" v-show="nowVisible">
    <p>{{ nowVisible }}</p>
  </div>
</template>

<script>
export default {
  name: "son",
  props: {
    visible: {
      type: Boolean,
      default: () => false,
    }
  },
  data() {
    return {
      nowVisible: this.visible,
    };
  },
  watch: {
    visible: {
      handler(newVal) {
        this.nowVisible = newVal;
      },
    },
  },
  methods: {
    closeSon() {
      this.$emit('update:visible', false)
      this.nowVisible = false
    }
  },
};
</script>
```

# 总结
-