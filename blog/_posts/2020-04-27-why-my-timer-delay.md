---
title: '怎麼 setTimeout 遲到了？'
tags:
  - js
date: 2021-04-27
author: Nono
location: Taipei
summary: 從 Event Loop 的角度探討為何 setTimeout 為何會有延遲現象發生
cover: https://i.imgur.com/gVg6XN6.png
---
::: slot header
# 怎麼 setTimeout 遲到了？
:::
## 從 Event Loop 的角度探討為何 setTimeout 為何會有延遲現象發生

### setTimeout 不準了

但我們可能會遇到 setTimeout 時間不準的問題，如下：

設一個 timer 在 100ms 之後執行， 算出執行的時間過了多久。
``可以發現此時得到的結果，就已經不是精確的 100ms 了。

```jsx
var start = new Date().getTime()
  window.setTimeout(() => {
  console.log(new Date().getTime() - start)
}, 100)
```

如果想要讓這個 setTimeout 更不準要怎麼做呢？

在做 setTimeout 後面加一些複雜的操作，像沒優化過的費氏數列。可以發現印出來的時間被延後了！

```jsx
var start = new Date().getTime()
window.setTimeout(() => {
  console.log(new Date().getTime() - start)
}, 100)

for (var i = 0; i < 500e6; i++) {
	
}
```

```jsx
var start = new Date().getTime()
setTimeout(() => {
  console.log(new Date().getTime() - start)
}, 100)

const fab = (n) => {
    if (n === 0 || n === 1) return n
    return fab(n - 1) + fab(n - 2)
}

fab(35) // 2^35
```

可以從 MDN 上的 [setTimeout](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setTimeout) 部分找到這個問題。

> **Late timeouts** 
In addition to Clamping, the timeout can also fire later when the page (or the OS/browser itself) is busy with other tasks. One important case to note is that the function or code snippet cannot be executed until the thread that called setTimeout() has terminated.

表示當目前瀏覽器再處理其他事情，把你的 Timer 要執行的 callback function 延後了。

## 想要知道為什麼會這樣，就要先知道 JS 是怎麼執行的

### 為什麼 JavaScript 要有 Event Loop 這樣的機制

因為 JS 當初設計為 Single threaded 的程式語言 (*註1)，但我們平常使用 JS 一定會遇到很多非同步的操作，如 setTimeout、setInterval、fetch。

> Single Threaded == Single Stack == 一次最多做一件事情

[By Philip Roberts in What the heck is the event loop anyway?](https://www.youtube.com/watch?v=8aGhZQkoFbQ) 

JS 中會有一個 Call Stack 專門呼叫所有的 function 。

當執行到某個 function 時，會把 function 丟到 stack 裡面，表示正在執行，function 執行完會從 stack 中 pop 出來。

而 callback queue 則是負責處理非同步的 Task，以及一些 microTask。

回到剛剛的 setTimeout，setTimeout 可能在瀏覽器或 nodejs 環境被實作，可以想像是當 JS runtime 發現你用了 setTimeout 這個函數時，就會告訴瀏覽器說：等等 N 秒後在回來告訴我要執行他的 callback。

所以 "等 N 秒" 這件事，是瀏覽器的 WebAPI 在處理的，不是 JS Runtime 在做的 (JS 只是告訴瀏覽器 "等 N 秒" 後叫我)。

可以從[這個網站](http://latentflip.com/loupe/?code=c2V0VGltZW91dChmdW5jdGlvbiB0aW1lb3V0KCkgewogICAgY29uc29sZS5sb2coIkNsaWNrIHRoZSBidXR0b24hIik7Cn0sIDUwMDApOwo%3D!!!PGJ1dHRvbj5DbGljayBtZSE8L2J1dHRvbj4%3D)來看整個視覺化的流程，簡單敘述流程如下：

1. 把 setTimeout  push 進去 call stack，並執行。
2. 發現 setTimeout 是 setTimeout，通知瀏覽器使用 WebAPI 兩秒後回覆。
3. setTimeout 執行完 call stack pop 出去，此時 call stack 就是空的了。
4. 兩秒後，WebAPI 把 callback 丟進，callback queue。
5. callback queue 把首個 callback push 進 call stack 中執行。

如果用上面剛剛費氏數列來舉例的話，可以發現 call stack 會被塞得滿滿滿。所以要做的事情太多了，最後做完才開始做 callback queue 的事情，才造成會有延遲的發生。

## 阻塞 Blocking

Event Loop 的設計，其實就是要讓整個 Single Threaded 不要被某些操作阻塞，所以才會出現 WebAPI 這些非 JS 上處理的方法。

包括畫面的 render 也包含在 Event Loop 裡面，所以當今天有超複雜的操作時 (如剛剛舉例的費氏數列)，會造成整個網頁像是當掉一樣。

或是在使用 Node.js 時，做一些 readFileSync 時，可能就會造成 Event loop blocking。

## 解決方法

1. 把複雜的計算改放到 Web Worker 裡面計算。
2. 用 Browser or Node.js 提供的非同步 API 使用。

## 總結
1. 了解 Event Loop 可以幫助我們在寫 JavaScript 時，對 JS 整體優化會比較有方向。
2. setTimeout、setInterval 等 WebAPI 不是準確到 ms 的，只能保證是 X ms 之後會執行，所以使用上要小心。

## 附註

1. [有關為什麼 JS 要設計成 Single threaded 的討論]([https://stackoverflow.com/questions/17959663/why-is-node-js-single-threaded](https://stackoverflow.com/questions/17959663/why-is-node-js-single-threaded))

## 參考資料

[By Philip Roberts in What the heck is the event loop anyway?](https://www.youtube.com/watch?v=8aGhZQkoFbQ)   簡單易懂，必看

[WhatWG - Event Loop](https://html.spec.whatwg.org/multipage/webappapis.html#event-loops)

[MDN - Event Loop](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/EventLoop)