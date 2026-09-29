# 项目场景：
子组件内的表单报错, 该表单数据对象存在且绑定无误.

```javascript
props: {
  nowSelected: {
    type: Array,
    default: () => []
  }
},
data() {
  return {
    ENFA01MForm: {
      actId: '01',
      astCtrNo: this.nowSelected.astCtrNo,
      astLoc: ''
    }
  }
}
```
报错: 

`
'ENFA01MForm' is not defined on the instance but referenced during render.
`

---



---

# 原因分析：
Form表单数据对象里的属性默认值不能是`props`传来的对象里的具体属性值.
这里改成`nowSelected`对象是没有问题的, 但是不能精确到属性.

---

正常的`data`里是可以这样做的(如下没有任何问题), Element表单数据对象不可.
```javascript
props: {
  nowSelected: {
    type: Array,
    default: () => []
  }
},
data() {
  return {
    stlyn: this.nowSelected.sttlYym,
    projNo: this.nowSelected.projNo
  }
}
```


