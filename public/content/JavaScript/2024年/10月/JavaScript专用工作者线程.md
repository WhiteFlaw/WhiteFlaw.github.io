---
title: JavaScript专用工作者线程
date: 2024-10-19
cover: /img/d9.webp
desc: JavaScript专用工作者线程
tags: [JavaScript, 前端]
sticky: false
---

# 一、何为专用工作者线程
最简单的WEB工作者线程,执行在页面加载外的其他任意如网络请求,繁杂计算操作并可以与页面通信.

---

# 二、专用工作者线程的全局对象
专用工作者线程内部,全局作用域是类DedicatedWorkerGlobalScope的实例, 其为WorkerGlobalScope的后代，所以也包含其父类工作者线程共有的属性和方法. 

专用工作者线程的全局增加了其特有的属性：
```
name: 提供给Worker构造函数一个可选字符串标识符

postMessage(): 此用于从专用工作者线程向父上下文通信与父上下文worker对象向专用工作者线程通信. 

close(): 与terminate()对应的方法, 立即终止工作者线程且不提供清理机会. 

importScripts(): 向工作者线程导入任意数量的脚本.
```

---

# 三、创建专用工作者线程的方法
worker构造函数接收两个参数,第一个为专用工作者线程所在的文件路径,第二个参数为可选的配置对象, 配置对象内支持下列属性:
```
name: 可在工作者线程中通过 self.name访问的字符串标识符.

type: 加载脚体的运行方式,可用值"classic"或"Module",分别对应常规执行/视作module执行.

credentials: type为"module"时指定用于获取&传输凭证数据相关的工作者线程模块脚本.可用值:"omit","same-origin","include",type为"classic"时,值默认"omit".
```

工作者线程并非只能在另一个js文件中创建，在行内创建工作者线程也可行，核心是利用Blob和URL生成对象URL作为Worker的参数.
 这种方法下,工作者线程能够更快地初始化,因为节省了网络延迟：
```javascript
const workerScript=` self.onmessage = ({data}) =>{ 
console.log(data); 
}`;
const workerScriptBlob = new Blob([workerScript]);
const workerScriptBlobURL= URL.creatObjectURL(workerScript Blob); 
const worker = new Worker(worker ScriptBlobURL);
worker.postMessage('blobWorkerScript');
```
在此基础上改进，利用函数序列化来初始化行内脚本:用函数的toString()方法返回函数代码的字符串：
```javascript
function fibonacci(n){
  return < 1 ? 0 : n <= 2 ? 1 : fibonacci(n - 1) + fibonacci(n - 2);
}
const workerScript = `self.postMessage(${fibonacci.toString ( )})(9));`;
const worker = new Worker(URL.createObjectURL(newworkerScript Blob([workerScript])));
worker.onmessage = ({data}) => {
  console.log(data);  //34
}
```
函数序列化后传给专用工作者线程调用,执行结果发回主线程.
所有计算函数体内在工作线完成,不影响父上下文性能.但发送到工作者线程执行的函数体内不能存在在工作者线程内获取不到的值如window, 这是一个作用域问题.

---

# 四、专用工作者线程特点
虽然下载脚本不按次序进行，但专用工作者线程中有选择性有顺序的执行脚本，类似于用`<script>`引入. 
工作者线程中通过importScripts()方法可请求来自任何源的脚本，参数接受任意数量脚本路径, 其仅能在工作者线程中使用，以下说明以上两点:
```javascript
// main.js:
const worker = new Worker('./worker.js'); 
// worker.js. 
console.log('worker.js');
importScripts ('./scriptA.js'); importScripts('./scriptB.js');
// worker.js
// scriptA.js
// scriptB.js
```
观察顺序. 

且importScripts()引入同一线程的所有脚本会在同一作用域，以下说明这点: 
```javascript
// main.js
const worker = new Worker('./ worker.js', { name : 'foo' });
// worker.js
const globalToken = 'bar'; 
importScrpts('./scriptA.js');
// scriptA.js
console.log(self.name);
```

---

# END
下篇会是专用工作者线程使用相关. 
如有疏漏，请为我指正，谢谢. 