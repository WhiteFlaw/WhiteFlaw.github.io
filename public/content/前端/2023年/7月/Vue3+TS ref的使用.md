---
title: Vue3+TS ref的使用
date: 2023-07-17
cover: /img/d1.webp
desc: Vue3+TS ref的使用
tags: [Vue, 前端]
sticky: false
---

@[TOC](文章目录)

---

# 前言
对ref的概念一直有点模糊, 整理一下吧.

---

# 一、获取DOM
最常见的用法.
## 1.获取domElement
以Composition API 写法为例.
引入ref, 在想要获取的DOM元素上定义ref属性赋值一个自定义名称, 然后在setup内声明一个同名变量来存储该DOM元素, 具体如下.
但并不能在setup中直接获取到DOM, setup相当于Vue2中的beforeCreate和create周期, 所以你看到我引入了onMounted.

```typescript
<div ref="diva"></div>
<img ref="imga"></img>
<canvas ref="canvasa"></canvas>
```
```typescript
import { defineComponent, ref, onMounted } from 'vue';

export default defineComponent({
  name: 'test',
  setup() {
    const diva = ref<HTMLDivElement | null>();
    const imga = ref<HTMLImageElement | null>();
    const canvasa = ref<HTMLCanvasElement | null>();
    onMounted(() => {
      console.log(diva);
      console.log(imga);
      console.log(canvasa);
    })
  }
})
```
`然后一定要把ref给return出去, 不然怎么搞都是undefined.`

如果获取到的元素具备子元素, 子元素也会被一同获取, 所以某些时候可以通过获取父元素的方式来获取子元素, 比如ul内有一堆li, 当然是获取ul再遍历比较好.

关于获取到的DOM如何定义类型, 可以从`node_modules/typescript/lib/lib.dom.ts`找到该接口:

```typescript
interface HTMLElementTagNameMap {
    "a": HTMLAnchorElement;
    "abbr": HTMLElement;
    "address": HTMLElement;
    "area": HTMLAreaElement;
    "article": HTMLElement;
    "aside": HTMLElement;
    "audio": HTMLAudioElement;
    "b": HTMLElement;
    "base": HTMLBaseElement;
    "bdi": HTMLElement;
    "bdo": HTMLElement;
    "blockquote": HTMLQuoteElement;
    "body": HTMLBodyElement;
    "br": HTMLBRElement;
    "button": HTMLButtonElement;
    "canvas": HTMLCanvasElement;
    "caption": HTMLTableCaptionElement;
    "cite": HTMLElement;
    "code": HTMLElement;
    "col": HTMLTableColElement;
    "colgroup": HTMLTableColElement;
    "data": HTMLDataElement;
    "datalist": HTMLDataListElement;
    "dd": HTMLElement;
    "del": HTMLModElement;
    "details": HTMLDetailsElement;
    "dfn": HTMLElement;
    "dialog": HTMLDialogElement;
    "dir": HTMLDirectoryElement;
    "div": HTMLDivElement;
    "dl": HTMLDListElement;
    "dt": HTMLElement;
    "em": HTMLElement;
    "embed": HTMLEmbedElement;
    "fieldset": HTMLFieldSetElement;
    "figcaption": HTMLElement;
    "figure": HTMLElement;
    "font": HTMLFontElement;
    "footer": HTMLElement;
    "form": HTMLFormElement;
    "frame": HTMLFrameElement;
    "frameset": HTMLFrameSetElement;
    "h1": HTMLHeadingElement;
    "h2": HTMLHeadingElement;
    "h3": HTMLHeadingElement;
    "h4": HTMLHeadingElement;
    "h5": HTMLHeadingElement;
    "h6": HTMLHeadingElement;
    "head": HTMLHeadElement;
    "header": HTMLElement;
    "hgroup": HTMLElement;
    "hr": HTMLHRElement;
    "html": HTMLHtmlElement;
    "i": HTMLElement;
    "iframe": HTMLIFrameElement;
    "img": HTMLImageElement;
    "input": HTMLInputElement;
    "ins": HTMLModElement;
    "kbd": HTMLElement;
    "label": HTMLLabelElement;
    "legend": HTMLLegendElement;
    "li": HTMLLIElement;
    "link": HTMLLinkElement;
    "main": HTMLElement;
    "map": HTMLMapElement;
    "mark": HTMLElement;
    "marquee": HTMLMarqueeElement;
    "menu": HTMLMenuElement;
    "meta": HTMLMetaElement;
    "meter": HTMLMeterElement;
    "nav": HTMLElement;
    "noscript": HTMLElement;
    "object": HTMLObjectElement;
    "ol": HTMLOListElement;
    "optgroup": HTMLOptGroupElement;
    "option": HTMLOptionElement;
    "output": HTMLOutputElement;
    "p": HTMLParagraphElement;
    "param": HTMLParamElement;
    "picture": HTMLPictureElement;
    "pre": HTMLPreElement;
    "progress": HTMLProgressElement;
    "q": HTMLQuoteElement;
    "rp": HTMLElement;
    "rt": HTMLElement;
    "ruby": HTMLElement;
    "s": HTMLElement;
    "samp": HTMLElement;
    "script": HTMLScriptElement;
    "section": HTMLElement;
    "select": HTMLSelectElement;
    "slot": HTMLSlotElement;
    "small": HTMLElement;
    "source": HTMLSourceElement;
    "span": HTMLSpanElement;
    "strong": HTMLElement;
    "style": HTMLStyleElement;
    "sub": HTMLElement;
    "summary": HTMLElement;
    "sup": HTMLElement;
    "table": HTMLTableElement;
    "tbody": HTMLTableSectionElement;
    "td": HTMLTableCellElement;
    "template": HTMLTemplateElement;
    "textarea": HTMLTextAreaElement;
    "tfoot": HTMLTableSectionElement;
    "th": HTMLTableCellElement;
    "thead": HTMLTableSectionElement;
    "time": HTMLTimeElement;
    "title": HTMLTitleElement;
    "tr": HTMLTableRowElement;
    "track": HTMLTrackElement;
    "u": HTMLElement;
    "ul": HTMLUListElement;
    "var": HTMLElement;
    "video": HTMLVideoElement;
    "wbr": HTMLElement;
}
```
获取不同的标签就定义为`<对应类型 | null>`, 在某些周期是null.

---

## 2.获取组件
与获取DOM的方法相同, 但类型定义有所区别.
`InstanceType<T>` 是 ts 自带的类型, 能够直接获取组件完整的实例类型.

```typescript
const 自定义 = ref<InstanceType <typeof 组件名>>();
```
```typescript
import { defineComponent, ref, onMounted } from 'vue';
import Footer from "../components/Footer.vue";

export default defineComponent({
  name: 'test',
  setup() {
    const footer = ref<InstanceType <typeof Footer>>();
    onMounted(() => {
      console.log(footer.value);
    });
  }
})
```
依然需要在onMounted获取.

----

## 3.v-bind与ref
如果用v-bind指令向ref绑定一个函数, 该函数内可从参数获取到DOM:
```html
<div :ref="setRefAction"></div>
```
```typescript
const setRefAction = (el: any) => {
  console.log(el)
};
```

---

# 二、响应式处理
ref() 也可以像 reactive() 一样对值进行响应式处理, 不过ref可以额外接受基础类型的响应式处理, reactive只能接受对象类型.
```
可以将 ref 看成 reactive 的一个变形版本，这是由于 reactive 内部采用 Proxy 来实现，
而 Proxy 只接受对象作为入参，这才有了 ref 来解决值类型的数据响应，如果传入 ref 的是一个对象，
内部也会调用 reactive 方法进行深层响应转换.
```
看来对象类型用ref做响应式处理会产生额外的工作量.

---

ref可以接受非对象类型:
```typescript
const state = ref<Boolean>(true);
```
但就像访问获取到的DOM一样, 访问ref值需要`xxx.value`.

接收对象类型时会返回Proxy对象, 因为这还是reactive的处理结果, 尝试直接从这个proxy对象中访问属性会导致TS报错:
```typescript
const obj = ref<Object>({ a: 1, b: 2}); // Proxy<Object>{ a: 1, b: 2 };
console.log(obj.value.a)
```
"obj.value中不含有该属性", 但其实是有的, 将obj的类型断言为any可以正常访问.

---

# 总结
--