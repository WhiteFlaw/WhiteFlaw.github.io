---
title: JavaScript赛博八音盒调制《ENDER LILIES-Harmonious》
date: 2024-10-26
cover: /img/d2.webp
desc: JavaScript赛博八音盒调制《ENDER LILIES-Harmonious》
tags: [JavaScript]
sticky: false
---

# 前言
在手写完数据之后实在没有精力和耐心再去整理逻辑的格式，而我手边又没有电脑. 
最好复制下来到编辑器整理一下. 

---

js内有几个空格用了中文，自行替换. 
```html
<div id ="container">
<div id="play">
<p>...</p>
<div id="cts">Touch To start<div>
<span></span>
</div>
```

```javascript
const audio_data_list = [
        { id: 0, key: 'a0', hz: 27.500 },
        { id: 1, key: 'a#0', hz: 29.135 },
        { id: 2, key: 'b0', hz: 30.868 },
        { id: 3, key: 'c1', hz: 32.703 },
        { id: 4, key: 'c#1', hz: 34.648 },
        { id: 5, key: 'd1', hz: 36.708 },
        { id: 6, key: 'd#1', hz: 38.891 },
        { id: 7, key: 'e1', hz: 41.203 },
        { id: 8, key: 'f1', hz: 43.654 },
        { id: 9, key: 'f#1', hz: 46.249 },
        { id: 10, key: 'g1', hz: 48.999 },
        { id: 11, key: 'g#1', hz: 51.913 },
        { id: 12, key: 'a1', hz: 55.000 },
        { id: 13, key: 'a#1', hz: 58.270 },
        { id: 14, key: 'b1', hz: 61.735 },
        { id: 15, key: 'c2', hz: 65.406 },
        { id: 16, key: 'c#2', hz: 69.296 },
        { id: 17, key: 'd2', hz: 73.416 },
        { id: 18, key: 'd#2', hz: 77.782 },
        { id: 19, key: 'e2', hz: 82.407 },
        { id: 20, key: 'f2', hz: 87.307 },
        { id: 21, key: 'f#2', hz: 92.499 },
        { id: 22, key: 'g2', hz: 97.999 },
        { id: 23, key: 'g#2', hz: 103.826 },
        { id: 24, key: 'a2', hz: 110.000 },
        { id: 25, key: 'a#2', hz: 116.541 },
        { id: 26, key: 'b2', hz: 123.471 },
        { id: 27, key: 'c3', hz: 130.813 },
        { id: 28, key: 'c#3', hz: 138.591 },
        { id: 29, key: 'd3', hz: 146.832 },
        { id: 30, key: 'd#3', hz: 155.563 },
        { id: 31, key: 'e3', hz: 164.814 },
        { id: 32, key: 'f3', hz: 174.614 },
        { id: 33, key: 'f#3', hz: 184.997 },
        { id: 34, key: 'g3', hz: 195.998 },
        { id: 35, key: 'g#3', hz: 207.652 },
        { id: 36, key: 'a3', hz: 220.000 },
        { id: 37, key: 'a#3', hz: 233.082 },
        { id: 38, key: 'b3', hz: 246.942 },
        { id: 39, key: 'c4', hz: 261.626 },
        { id: 40, key: 'c#4', hz: 277.183 },
        { id: 41, key: 'd4', hz: 293.665 },
        { id: 42, key: 'd#4', hz: 311.127 },
        { id: 43, key: 'e4', hz: 329.628 },
        { id: 44, key: 'f4', hz: 349.228 },
        { id: 45, key: 'f#4', hz: 369.994 },
        { id: 46, key: 'g4', hz: 391.995 },
        { id: 47, key: 'g#4', hz: 415.305 },
        { id: 48, key: 'a4', hz: 440.000 },
        { id: 49, key: 'a#4', hz: 466.164 },
        { id: 50, key: 'b4', hz: 493.883 },
        { id: 51, key: 'c5', hz: 523.251 },
        { id: 52, key: 'c#5', hz: 554.365 },
        { id: 53, key: 'd5', hz: 587.330 },
        { id: 54, key: 'd#5', hz: 622.254 },
        { id: 55, key: 'e5', hz: 659.255 },
        { id: 56, key: 'f5', hz: 698.456 },
        { id: 57, key: 'f#5', hz: 739.989 },
        { id: 58, key: 'g5', hz: 783.991 },
        { id: 59, key: 'g#5', hz: 830.609 },
        { id: 60, key: 'a5', hz: 880.000 },
        { id: 61, key: 'a#5', hz: 932.328 },
        { id: 62, key: 'b5', hz: 987.767 },
        { id: 63, key: 'c6', hz: 1046.502 },
        { id: 64, key: 'c#6', hz: 1108.731 },
        { id: 65, key: 'd6', hz: 1174.659 },
        { id: 66, key: 'd#6', hz: 1244.508 },
        { id: 67, key: 'e6', hz: 1318.510 },
        { id: 68, key: 'f6', hz: 1396.913 },
        { id: 69, key: 'f#6', hz: 1479.978 },
        { id: 70, key: 'g6', hz: 1567.982 },
        { id: 71, key: 'g#6', hz: 1661.219 },
        { id: 72, key: 'a6', hz: 1760.000 },
        { id: 73, key: 'a#6', hz: 1864.655 },
        { id: 74, key: 'b6', hz: 1975.533 },
        { id: 75, key: 'c7', hz: 2093.005 },
        { id: 76, key: 'c#7', hz: 2217.461 },
        { id: 77, key: 'd7', hz: 2349.318 },
        { id: 78, key: 'd#7', hz: 2489.016 },
        { id: 79, key: 'e7', hz: 2637.020 },
        { id: 80, key: 'f7', hz: 2793.826 },
        { id: 81, key: 'f#7', hz: 2959.955 },
        { id: 82, key: 'g7', hz: 3135.963 },
        { id: 83, key: 'g#7', hz: 3322.438 },
        { id: 84, key: 'a7', hz: 3520.000 },
        { id: 85, key: 'a#7', hz: 3729.310 },
        { id: 86, key: 'b7', hz: 3951.066 },
        { id: 87, key: 'c8', hz: 4186.009 },
    ]
```

这部分有些空格错误，但数据是对的. 
```javascript
let callhum = 0;
const books = [
{ id: 30, hold: 0.4, beside: 0, type: audio_type_list[0] },{ id: 32, hold: 0.4, beside:0, type: audio_type_list[0] },{ id: 33, hold: 1, beside: 0, type: audio_type_list[0]},{ id: 32, hold: 0.8, beside: 1, type: audio_type_list[0]}, { id: 30, hold: 0.4, beside: 0, type: audio_type_list[0]}, { id: 32, hold: 0.4, beside: 0, type: audio_type_list[0]},{ id: 33, hold: 1, beside: 0, type: audio_type_list[0] },{ id: 32, hold: 0.8, beside: 1, type: audio_type_list[0] },{ id: 33, hold: 0.4, beside: 0, type: audio_type_list[0] }, { id: 35, hold: 0.5, beside: 0, type: audio_type_list[0] },{ id:37, hold: 1, beside:	0, type: audio_type_list[0] },{ id: 40, hold: 1, beside:	1, type: audio_type_list[0] },{ id: 37, hold: 0.4, beside:	0, type: audio_type_list[0] },{ id: 39, hold: 0.5, beside:	0, type: audio_type_list[0] },{ id: 40, hold: 0.5, beside:	0, type: audio_type_list[0] },{ id: 32, hold: 0.5, beside:	0, type: audio_type_list[0] },{ id: 39, hold: 0.8, beside:	0, type: audio_type_list[0] },{ id: 35, hold: 0.8, beside:	0, type: audio_type_list[0] },{ id: 40, hold: 0.8, beside:	1, type: audio_type_list[0] },{ id: 39, hold: 0.5, beside:	0, type: audio_type_list[0] },{ id: 39, hold: 0.5, beside:	0, type: audio_type_list[0] },{ id: 37, hold: 0.5, beside:	0, type: audio_type_list[0] },{ id: 39, hold: 0.5, beside:	0.5, type: audio_type_list[0] },{ id: 44, hold: 0.5, beside:	0, type: audio_type_list[0] },{ id: 39, hold: 0.5, beside:	0, type: audio_type_list[0] },{ id: 39, hold: 0.5, beside:	0, type: audio_type_list[0] },{ id: 37, hold: 0.5, beside:	0, type: audio_type_list[0] },{ id: 39, hold: 0.5, beside:	0.5, type: audio_type_list[0] },{ id: 44, hold: 0.5, beside:	0, type: audio_type_list[0] },{ id: 39, hold: 0.5, beside:	0, type: audio_type_list[0] },{ id: 39, hold: 0.5, beside:	0, type: audio_type_list[0] },{ id: 37, hold: 0.5, beside:	0, type: audio_type_list[0] },{ id: 39, hold: 0.5, beside:	0.5, type: audio_type_list[0] },{ id: 46, hold: 0.5, beside:	0, type: audio_type_list[0] },{ id: 39, hold: 0.5, beside:	0, type: audio_type_list[0] },{ id: 39, hold: 0.5, beside:	0, type: audio_type_list[0] },{ id: 37, hold: 0.5, beside:	0, type: audio_type_list[0] },{ id: 39, hold: 0.5, beside:	0.5, type: audio_type_list[0] },{ id: 46, hold: 0.5, beside:	0, type: audio_type_list[0] },{ id: 39, hold: 0.5, beside:	0, type: audio_type_list[0] },{ id: 39, hold: 0.5, beside:	0, type: audio_type_list[0] },{ id: 37, hold: 0.5, beside:	0, type: audio_type_list[0] },{ id: 39, hold: 0.5, beside:	0.5, type: audio_type_list[0] },{ id: 37, hold: 0.8, beside:	0.2, type: audio_type_list[0] },{ id: 36, hold: 0.5, beside:	0, type: audio_type_list[0] },{ id: 33, hold: 0.8, beside:	0.8, type: audio_type_list[0] },{ id: 34, hold: 0.5, beside:	0, type: audio_type_list[0] },{ id: 36, hold: 0.5, beside:	0, type: audio_type_list[0] },{ id: 38, hold: 0.8, beside:	0.2, type: audio_type_list[0] },{ id: 34, hold: 0.8, beside:	0.2, type: audio_type_list[0] },{ id: 36, hold: 0.5, beside:	0, type: audio_type_list[0] },{ id: 38, hold: 0.8, beside:	0.2, type: audio_type_list[0] },{ id: 45, hold: 0.8, beside:	0.2, type: audio_type_list[0] },{ id: 38, hold: 0.5, beside:	0, type: audio_type_list[0] },{ id: 43, hold: 0.8, beside:	0.2, type: audio_type_list[0] },{ id: 43, hold: 0.5, beside:	0, type: audio_type_list[0] },{ id: 43, hold: 0.5, beside:	0, type: audio_type_list[0] },{ id: 41, hold: 0.5, beside:	0, type: audio_type_list[0] },{ id: 39, hold: 0.5, beside:	0, type: audio_type_list[0] },{ id: 41, hold: 0.5, beside:	1, type: audio_type_list[0] },{ id: 38, hold: 0.5, beside:	0, type: audio_type_list[0] },{ id: 39, hold: 0.4, beside:	0.1, type: audio_type_list[0] },{ id: 39, hold: 0.8, beside:	0.1, type: audio_type_list[0] },{ id: 32, hold: 0.8, beside:	0.5, type: audio_type_list[0] },{ id: 39, hold: 0.4, beside:	0.1, type: audio_type_list[0] },{ id: 38, hold: 0.8, beside:	0.3, type: audio_type_list[0] },{ id: 31, hold: 0.8, beside:	0.5, type: audio_type_list[0] },{ id: 37, hold: 0.8, beside:	0, type: audio_type_list[0] },{ id: 35, hold: 1, beside:	0.1, type: audio_type_list[0] },{ id: 34, hold: 0.8, beside:	0.5, type: audio_type_list[0] },{ id: 37, hold: 1, beside:	1, type: audio_type_list[0] },{ id: 38, hold: 1, beside:	0.2, type: audio_type_list[0] },{ id: 34, hold: 1, beside:	0.2, type: audio_type_list[0] },{ id: 36, hold: 0.5, beside:	0, type: audio_type_list[0] },{ id: 38, hold: 1, beside:	0.2, type: audio_type_list[0] },{ id: 45, hold: 1, beside:	0.2, type: audio_type_list[0] },{ id: 38, hold: 0.5, beside:	0, type: audio_type_list[0] },{ id: 43, hold: 1, beside:	0, type: audio_type_list[0] },{ id: 43, hold: 1, beside:	0, type: audio_type_list[0] },{ id: 45, hold: 1, beside:	0, type: audio_type_list[0] },{ id: 41, hold: 0.2, beside:	0, type: audio_type_list[0] },{ id: 38, hold: 1, beside:	0.2, type: audio_type_list[0] }]
```
逻辑
```javascript
const showld = document.querySelector('span');
const tips = document.querySelector('p');
const cts = document.getElementById('#cts');
const playDom = documet.getElementById('play');
const container = document.getElementById('#container');
showld.innerHTML = `...<br/>0/${books.length}`;
playDom.addEventListener('click', () => {
  container.style.backgroundColor = 'black';
  tips.innerHTML = "playing...";
  cts.innerHTML = "play";
});

function getRandom() { return Math.random().toFixed(1) >= 0.5 ? Math.random().toFixed(2) * 100 : Math.random().toFixed(3) * 1000; }

function play() {
  if (callNum == books.length) return;
  const data = getBookByCallNum(callNum);
  const audioContext = new AudioContext();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  oscillatorgainNode.connect(gainNode);
  oscillator.connect(audioContext.destination);
  oscillator.type = data.type;
  showld.innerHTML = `${data.id}<br/>${callNum}/${books.length}`;
  oscillator.frequency.value = audio_data_list[data.id].hz;
  gainNode.gain.setValueAtTime(0, audioContext.currentTime);
  gainNode.gain.linearRampToValueAtTime(1, audioContext.currentTime + 0.1);
  osCillator.start(audioContext.currentTime);
  playDom.style.transition = data.hold + data.beside + 's';
  playDom.style.backgroundColor = `rgb(${getRandom()} ${getRandom()} ${getRandom()})`;
  gainNode.gain.exponentialRampToValueAtTime(0.1, audioContext.currentTime + 1);
  oscillator.stop(audioContext.currentTime + data.hold); ++callNum;
  setTimout(play, (hold + data.beside) * 1000);
  function getBookByCallNum(callNum) {
    return books.find((index) => {
      return index == callNum;
    })
  }
}
```

```css
* {
  margin: 0;
  padding: 0;
}

body {
  background-color: black;
}

#container {
  display: flex;
  height: 350px;
  margin-top: 300px;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  background-color: white;
  transition: 1s;
}

#container: hover {
  background-color: black;
}

.#play {
  displsy: flex;
  width: 120px, min-height: 50px;
  padding: 5px;
  border-radjus: 3px;
  align-items: center;
  flex-direction: column;
  line-height: 15px;
  color: white;
  background-color: black;
}

#play: hover {
  color: black;
  cursor: pointer;
  background-color: white;
}

span {
  color: grey;
  cursor: default;
  text-align: center;
}
```