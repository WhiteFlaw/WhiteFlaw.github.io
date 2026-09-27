
@[TOC](文章目录)


<hr style=" border:solid; width:100px; height:1px;" color=#000000 size=1">

# 前言
这篇文章里的所有操作都是在Vue3 + Cli4.5.x的环境下进行的.
<hr style=" border:solid; width:100px; height:1px;" color=#000000 size=1">

# 一、安装
安装步骤和在vue2里的安装没有区别,使用npm安装即可.

```typescript
npm i axios --save
```

---

# 二、请求数据
该尽量避免在每个组件中单独请求数据, 不然接口一旦改动, 前端所有使用这个接口的地方都要改, 不仅如此分开进行的多次请求还会增大对服务器的压力;
下面例子在 ```src/api/request.js ```里完成整个项目的数据请求.

| 请求方法 |
|--|
| axios.get(url , {config})
| axios.delete(url , {config})
| axios.head(url , {config}) |
| axios.post(url , {data}, {config}) |
| axios.put(url , {data}, {config}) |
| axios.patch(url , {data}, {config}) |


## 抽离式
先在request.js里create几个axios实例, 比如要用到三个baseURL完全不同的接口, 那就写三个实例:

```javascript
//这是在reqest.js里
const instance1 = axios.create({
    baseURL: 'http://xxxxx.com:3000',
    timeout: 5000,
});

const instance2 = axios.create({
    baseURL: 'http://xxxx.com:3000',
    timeout: 5000,
});

const instance3 = axios.create({
    baseURL: 'http://xxxx.com:3000',
    timeout: 5000,
});

//export default instance1;
export default { instance1, instance2, instance3 };
//这里是把所有方法一起暴露, 引入是整体, 用的时候记得拆开;
```

组件:
```javascript
//<script setup>

import allInstance from "../api/request";  
import { onMounted } from "vue";

onMounted(() => {
  get();
});

const get = () => {
  allInstance.instance1.get("/getHottest").then((res) => {
    console.log(res);
  });
};
//allInstance包含了三个方法, 这里只用instance1;
//</script>
```
在组件里发请求的时候, 用于请求的代码要尽可能的少, 因为这跟组件本身内容几乎毫无关系, 所以能写到request.js里的就不要写到组件里.

---

## 简式
做请求少的时候可以用这种.
写的时候比较爽, 改的时候比较酸爽.
要是跨域或者接口改动, 真的是要回来一个文件一个文件的改...
```typescript
axios.defaults.baseURL = 'http://xxx.xxx.xx.xxx:3000';
axios.post("/login", {
            username:"baiX"
          })
     .then((res) => {
       console.log(res);
     });
```

<hr style=" border:solid; width:100px; height:1px;" color=#000000 size=1">

## 并发请求
axios.all(): 用于同时发送多个请求, 这个一般在onMounted或者create这种时候, 页面第一次加载. 需要发送多个请求.

```javascript
//request.js
import axios from "axios";

const instance1 = axios.create({
    baseURL: 'http://x.xxx.xx.xxx:3000',
    timeout: 5000,
});

export default instance1;
```

```javascript
//<script setup>

import axios from "axios";
import instance1 from "../../api/request";
import { onMounted } from "vue";
//导出方用export default导出, 引入不用加括号, export导出要加不然会警告

onMounted(() => {
  getall();
});

function get1() {
  return instance1.get("/getHottestArticle");
}

function get2() {
  return instance1.get("/getLatestArticle");
}

function getall() {
  axios.all([get1(), get2()]).then((res) => {
    console.log(res);
  });
}

//</script>
```
当然, 直接在axios.all()里写好几个请求也是可以的, 就是不好看啊...
<hr style=" border:solid; width:100px; height:1px;" color=#000000 size=1">

# 三、保存数据
上表的语句书写正确仅能完成数据的请求,JS是有内存回收机制的,即便成功请求到, 数据还是会在方法执行完后被连同方法一起销毁,我们得先把数据及时的保存下来.

选择保存在setup()里或者setup的reactive里:

```javascript
//<script setup>
import { onMounted, reactive } from 'vue';
import allInstance from '@/api/request';

let something = '';

const qingqiu = () => {
  allInstance.instance1.post('/toGetSomething', {
    username: "unknown"
  })
    .then((res) => {
      something = res;
    })
}

//<script>
```
如果是放到了setup()的data里:
```javascript
//<script setup>
import { onMounted, reactive } from 'vue';
import allInstance from '@/api/request';

let data = reactive({
  something: '',
})

const qingqiu = () => {
  allInstance.instance1.post('/toGetSomething', {
    username: "unknown"
  })
    .then((res) => {
      data.something = res;
    })
}
```

当然, push()之类的这种处理方法也可以用, 在then()里处理好res, 再赋值到setup里保存.
还有localStorage 和 sessionStorage 也很好用;
<hr style=" border:solid; width:100px; height:1px;" color=#000000 size=1">

# 四、config配置项

| 配置项 | 作用 |
|--|--|
| url | 字符串,指明请求的目标,向何处发送请求 |
| method | 字符串,设置请求的方法,默认get |
| baseurl | 字符串,设置url的基础结构,该项设置后,baseurl会自动与url进行拼接,形成完整的url,这个baseurl最好是设置为多个请求url相同的前段部分,如此可以共用baseurl |
| transformRequest | 数组型值,只能用在put, post,patch方法中,在向服务器发送数据前在此处进行再处理,你可以在这个数组里写处理数据的函数,但别忘了return. |
| transformResponse | 数组型值,可以对服务器返回的东西先做一些处理，这个操作允许在响应之前完成,你同样可以在这个数组里写函数,同样别忘记return. |
| headers | 对象型值,有验证作用, 在某些项目中需要进行身份校验,要求在请求头信息中加入特殊的标识，以此检验是否满足请求条件 |
| params | 简化传递url参数的流程,添加到url的请求字符串中无法传递json格式的数据,主要用于get中 |
| data | 对象型(会被转换为字符串) / 字符串型, 添加到请求体（body）中,支持json格式的数据,主要用于post中 |
| paramsSerializer | 函数型值,对请求的参数序列化, 它可以处理用于传递的数据, 比如您可以用这个属性来把params里的数组转化为字符串,因为函数中需要使用qs.stringify(), 使用前需要引入序列化库qs(即import qs from 'qs') |
| timeout | 设置等待时长,请求超时会取消请求 |
| withCredentials | 布尔值, 设置跨域请求时coockie的携带,默认false |
| adapter | 设置对请求的识别，是发送ajax请求还是在js里发送http请求 |
| auth | 对象, 设置对请求的基础信息验证 |
| responseType | 对响应器结果的格式做设置,默认json |
| responseEncoding | 响应结果编码格式,默认utf8 |
| xsrfCookieName | 跨域请求标识，对coockie名字做设置 |
| xsrfHeaderName | 对头信息做安全设置，保证请求来自正确的客户端 |
| onUploadProgress | 上传回调,值可以为自定义函数 |
| onDownloadProgress | 下载回调,值可以为自定义函数 |
| maxContentLength | 设置http响应体的最大尺寸，单位bit |
| maxBodyLength | 请求体的最大尺寸，单位bit |
| validateStatus | 对响应结果的成功码做相关设置 |
| maxRedirects | 最大跳转次数 |
| socketPath | 设定socketPath位置，作用：数据转发 |
| proxy | 设置代理 |
| cancelToken | 对ajax的请求做取消设置 |
| decompress | 解压响应结果 |


<hr style=" border:solid; width:100px; height:1px;" color=#000000 size=1">

# 总结
2022-5-2, 修缮了亿下, 改了一堆过时的语法和用法...
