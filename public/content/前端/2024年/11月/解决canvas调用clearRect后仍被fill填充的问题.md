---
title: 解决canvas调用clearRect后仍被fill填充的问题
date: 2024-11-16
cover: /img/d4.webp
desc: 解决canvas调用clearRect后仍被fill填充的问题
tags: [前端]
sticky: false
---

写特效时无意中发现的糟糕的一点. 
以前画的东西擦掉在新的位置绘制，会把擦掉的东西也显示出来，测试了一下没有数据绑定，也不是因为定时器. 
一调用绘制方法就会出问题，数据改掉不绘制都不会有事，最后发现问题在绘制方法里的fill. 

拿出来单独测试，在上下文中将绘制的矩形使用clearRect掩藏后，调用fill方法依然会把掩藏的矩形填充出来显示，事实上fill和stroke都会把你之前在上下文里绘制的所有能填充的东西都重新填充出来显示. 
我最后用fillRect来绘制，放弃使用fill和stroke，没有再出现这个问题了. 