
@[TOC](文章目录)


<hr style=" border:solid; width:100px; height:1px;" color=#000000 size=1">

# 前言
touch-action是一个用于解决 [移动端屏幕拖动默认行为造成的诸多不便] 的CSS属性,它可以改变浏览器对于"拖动"这一行为的应对策略, 我挑了几个感觉比较用得上的来记录,每一个都做了下演示.

<hr style=" border:solid; width:100px; height:1px;" color=#000000 size=1">



# 一、什么是浏览器默认行为？
你要是知道的话可以直接去目录跳过这段了...

浏览器默认行为即是浏览器自带的对某些事件的处理方法.
比如:
写Vue时会覆盖掉全局样式的浏览器自带样式,
点击type为"submit"的input会提交表单,
a标签会引起跳转;

如此种种初衷是好的,但未必会带来好的结果,就拿拖拽动作来举例,如果我打算拖动页面中的一个div01, 直接让div01监听touchmove事件:

```javascript
div.addEventListener("touchmove", function (e) {
    div.style.top = e.touches[0].clientY - 25 + "px";
    div.style.left = e.touches[0].clientX - 25 + "px";
})
```

结果会是这样的:
![在这里插入图片描述](../../../../img/前端/2021年/10月/CSS3%20touch-action设置移动端拖动行为/1.jpeg)

会将整个页面一同拽向目标方向(右下角),这即是浏览器默认行为和自定义行为同时生效的结果.

这样弄体验是十分糟糕的,首先div实际挪动的距离比我手指拖动的距离要小很多,感觉像是在推磨.
其次鼠标所在位置一旦撞到视口边缘就不能再继续向这个方向拖动,得松开再来一次,总之,十分不爽.

# 二、可取的值 && 效果演示
touch-action用于设置浏览器如何响应触屏用户的拖拽,平移,拉伸等操作;
| 属性 | 说明 |
|--|--|
| touch-action: pan-up; | 禁止由下向上拖动时的默认行为, 横向全部禁止 |
| touch-action: pan-down; | 禁止由上向下拖动时的默认行为, 横向全部禁止 |
| touch-action: pan-right; | 禁止由左向右拖动时的默认行为, 纵向全部禁止 |
| touch-action: pan-left; | 禁止由右向左拖动时的默认行为, 纵向全部禁止 |
| touch-action: pan-x; | 仅清除纵向拖动默认行为 |
| touch-action: pan-y; | 仅清除横向拖动默认行为 |
| touch-action: auto; | 默认,交给浏览器来相应这些操作 |
| touch-action: none; | 清除所有关于拖动的默认行为,完全不让动.<br> "我买几个橘子去. 你就在此地, 不要走动." |

演示过程中每次改变拖动方向都是重新按下再拖的.
## 1.pan-up;
![在这里插入图片描述](../../../../img/前端/2021年/10月/CSS3%20touch-action设置移动端拖动行为/2.gif)

## 2.pan-down
![在这里插入图片描述](../../../../img/前端/2021年/10月/CSS3%20touch-action设置移动端拖动行为/3.gif)

## 3.pan-right
![在这里插入图片描述](../../../../img/前端/2021年/10月/CSS3%20touch-action设置移动端拖动行为/4.gif)

## 4.pan-left
![在这里插入图片描述](../../../../img/前端/2021年/10月/CSS3%20touch-action设置移动端拖动行为/5.gif)

## 5.none
![在这里插入图片描述](../../../../img/前端/2021年/10月/CSS3%20touch-action设置移动端拖动行为/6.gif)
你的尝试结果可能会与我的有些偏差,请看第三段的解释.

<hr style=" border:solid; width:100px; height:1px;" color=#000000 size=1">

# 三、注意
注意除了none之外, 其他几个属性的"允许某方向上的拖动", 都是指按下去后在那个可拖动方向的执行的首次拖动,只有那一次是被允许的.
但若是我在pan-up的情况下按下去, 先向下拖了(这是能拖的), 但是我不松开手继续往左往右的乱拖一气然后再往下拖, 那就不能下拖了,可以去试一下:

```css
div {
    position: absolute;
    top: 100px;
    left: 100px;
    height: 60px;
    width: 60px;
    touch-action: pan-up;
    border-radius: 45%;
    background-color: rgba(0, 255, 255, 0.63);
}
```

```html
    <div>
        div01
    </div>
```

```javascript
//JS,其实不用写;
var div = document.querySelector("div");
div.addEventListener("touchmove", function (e) {
    div.style.top = e.touches[0].clientY - 25 + "px";
    div.style.left = e.touches[0].clientX - 25 + "px";
})
```

你必须得把手松开然后才能再下拖;
# 总结
_