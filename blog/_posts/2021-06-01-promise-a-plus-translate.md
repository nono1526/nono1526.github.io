---
title: 'Promise A+ 規範文件繁中翻譯'
tags:
  - js
date: 2021-06-01
author: Nono
location: Taipei
summary: Promise A+ 規範文件繁中翻譯
cover: https://i.imgur.com/gVg6XN6.png
---
::: slot header
# Promise A+ 規範文件繁中翻譯
:::

原文連結：[Promises/A+](https://promisesaplus.com/)

**一個為了讓 JavaScript 開發者能夠實作出完整且(不同 promise 實作)可互相操作的 Promises 功能，實作者所制定的開放規範。**

Promise 最後表示一個非同步的操作。主要透過 `then` 這個 method 來操作，他需要註冊一個 callback 去收集 Promise 最終的值 (value) 或 Promise 是一個不能完成的理由。

這個規格主要詳細地描述 `then` method 的行為，提供所有一制遵循 Promises/A+ 實作的 Promise 一個可操作的基準，且都能依賴這份基準。因此，這份規格被考慮的很穩定。雖然 Promises/A+ 組織可能為了一些新發現的問題，而偶爾修訂一些能夠向下相容的小更動。我們只會在仔細思考、討論和測試後，才會集成大的或是無法相容的更動。

歷史上 Promises/A+ 為了闡明之前 Promises/A 的行為協議，繼承他的行為和忽略部分規定不足、有問題的部分。

最後，Promises/A+ 規範並不是為了讓人去創造或實現、拒絕 Promises，反而是關注再提供可操作的 `then` 方法，未來工作伴隨的規範可能會接觸這個主題。

## 術語

1. "promise" 是一個物件或函數且有一個 `then` 方法，且行為符合此規範。
2. "thenable" 是一個物件或函數來定義 `then` 方法
3. "value" 是一個合法的 JS 值 (包含 `undefined`a thenable, or a promise) 
4. "exception" 是一個使用 `throw` 拋出的值
5. "reason" 是一個用來表示 promise 為何被拒絕的值

## 要求

一個 promise 必須包含三個狀態: pending, fulfilled, rejected

2.1 當 promise 狀態為 pending 時

2.1.1 將會轉換到 fulfilled 或 rejected 狀態

2.2 當 promise 狀態為 fulfill 時

2.2.1 不會轉換成任何別的狀態

2.2.2 必須有一個不會被改變 value

2.3 當 promise 狀態為 fulfill 時

2.3.1 不會轉換成任何別的狀態

2.3.1 必須有一個不會被改變的 reason

這邊" 不會被改變" 表示不變性 (immutable)，但並不是深度 immutability

## 2.2 `Then` 方法

promise 必須提供一個 then 方法來使用最終的 value 或 reason

promise 的 `then` 方法接受兩個參數：

`promise.then(onFulfilled, onRejected)`

2.2.1 onFulfilled 和 onRejected 為可選的參數

2.2.1.1 若 `onFulfilled` 不是 function，則必須被忽略

2.2.1.2 若 `onRejected` 不是 function，則必須被忽略

2.2.2 若 `onFulfilled` 是 function

 2.2.2.1 他在 promise  狀態變更為 fulfilled 時，必須要以 promise 的 value 為第一個參數呼叫

2.2.2.2 在 promise 狀態變更為 fulfilled 之前不能被呼叫

2.2.2.3 不能呼叫超過一次

2.2.3 若 `onRejected` 是 function

2.2.3.1 他在 promise  狀態變更為 rejected 時，必須要以 promise 的 reason 為第一個參數呼叫

2.2.2.2 在 promise 狀態變更為 rejected 之前不能被呼叫

2.2.2.3 不能呼叫超過一次

2.2.4 `onFulfilled` 或 `onRejected` 不能被呼叫直到 [execution context](https://es5.github.io/#x10.3) 堆疊只包含裝置程式碼 (platform code) [3.1]。

2.2.5 `onFulfilled` 或 `onRejected` 必須作為 function 被呼叫 (i.e. 沒有 `this` value)

2.2.6 `then` 可以被呼叫多次在同一個 promise

2.2.6.1 如果 promise 狀態是 fulfilled，所有各自的 `onFulfilled` callbacks 必須按照原始呼叫 `then` 的順序被呼叫。

2.2.6.2 如果 promise 狀態是 rejected, 所有各自的 `onRejected` callbacks 必須按照原始呼叫 `then` 的順序被呼叫。

2.2.7 `then` 必須回傳 promises [3.3]。

`promise2 = promise1.then(onFulfilled, onRejected)`

2.2.7.1 若 `onFulfilled` 或 `onRejected` 回傳一個值 `x` ，執行 Promise 解決程序 (Promise Resolution Procedure) `[[Resolve]](promise2, x)` 。

2.2.7.2 若 `onFulfilled` 或 `onRejected` 丟出一個錯誤 `e` ，promise2 狀態必定為 rejected 且以 `e` 作為 reason。

2.2.7.3 若 `onFulfilled` 不是 function 且 promise1 狀態為 `fulfilled` ，`promise2` 必須狀態為 fulfilled 且和 `promise1` 有一樣的 value。

2.2.7.4 若 `onRejected` 不是 function 且 promise1 狀態為 `rejected` ，`promise2` 必須狀態為 fulfilled 且和 `promise1` 有一樣的 reason。

## 2.3. Promise 解決程序 (The Promise Resolution Procedure)

Promise 解決程序是一個抽象操作，說明將一個 promise 和 value 當作輸入，註記為 `[[Resolve]](promise, x)`。若 `x` 為 thenable，且假設 `x` 行爲像是 promise，他嘗試使 `promise` 使用 x 的狀態。不然他會使用 value x 來 (fulfills)完成 promise。

這些 thenables 的處理方式允許所有其他 promises 的實作交互操作使用，只要他們使用 Promises/A+ 規範定義一個 `then` 方法。他也認同 Promises/A+ 實作去"吸收"其他不一致的 `then` 實作。

`[[Resolve]](promise, x)` 執行以下步驟

2.3.1 若 promise 和 x 指向同一個物件，拒絕 promise 必提供 TypeError 當作 reason。

2.3.2 若 x 是 promise, 使用 他的狀態 [3.4]

2.3.2.1 若 x 狀態為 pending，promise 必須保持 pending 狀態 直到。x 狀態變更為 fulfilled 或。rejected

2.3.2. 若 x 狀態為 fulfilled，用同樣的 value 完成 promise

2.3.3 若 y 狀態為 rejected，用同樣的 reason 完成 promise

2.3.3 反之，若 x 是一個物件或  function

2.3.3.1 使 then 為 x.then [3.5]

2.3.3.2 若取得 x.then 時發生錯誤，使用 `e` 作為 reason 拒絕 promise 

2.3.3.3 若 then 是 function, 將 x 作為  this.呼叫。第一個參數為 resolvePromise 第二個參數為 rejectPromise。

2.3.3.3.1 若 resolvePromise 被使用 y 呼叫，執行 [[Resolve]](promise, y)

2.3.3.3.2 若 rejectPromise 被使用 r 呼叫，使用 r 拒絕 promise

2.3.3.3.3 若 resolvePromise 和 rejectPromise 都被呼叫，或是使用同樣的參數去多次呼叫，以第一次呼叫為優先，後續省略。

2.3.3.4 若 呼叫 then 時丟出錯誤 `e`

2.3.3.4.1 若 resolvePromise 和 rejectPromise 都已經被呼叫，忽略他。

2.3.3.4.2 反之，使用 e 當作 reason 拒絕 promise

若一個 promise 被使用 thenable 解決，且這個 thanable 參與了。thenable 循環鏈，如此一個遞迴的 `[[Resolve]](promise, thenable)` 最終導致 `[[Resolve]](promise, thenable)` 再次被呼叫，上述的演算法會導致無限遞迴。我們鼓勵但並不要求去實作檢測這個遞迴，並且將 TypeError 作為 reanson 去拒絕 promise。

## 3. 註記

3.1. 這裡的裝置程式碼 (platform code) 表示引擎、環境和實作 promise 的程式。實作中，這個要求確保 onFulfilled 或 onRejected 使用非同步執行。在 `then` 被呼叫後，丟進事件循環 (event loop) 中，並刷新堆疊。可以使用 "macro-task" 機制如 `setTimout` 或 `setImmediate` 去實作。或使用 "micro-task" 機制像是 `MutationObserver` 或是 `process.nextTick` 。Since the promise implementation is considered platform code, it may itself contain a task-scheduling queue or “trampoline” in which the handlers are called. (這句不會翻 XD)

3.2. 在嚴格模式下 promise 內部的 this 會是 undefined，非嚴格模式下 this 會是 global object。

3.3. 實作上可能允許 `promise2 === promise1` , 只要實作有滿足所有的要求。每個實作必須註記什麼情況下 `promise2 === promise1` 。

3.4. 一般來說，我們會知道 x 也會是一個正確的 promise 來自目前的實作。這條款允許具體實作代表採用狀態了解狀態。

Generally, it will only be known that x is a true promise if it comes from the current implementation. This clause allows the use of implementation-specific means to adopt the state of known-conformant promises.(原文)

3.5.  在程序的開始會將儲存 `x.then` 的 參照，然後測試他的參照，最後呼叫他的參照，避免多次使用 `x.then` 參數。這些預防措施確保很重要，保證使用的參數的一致性。參數可能被檢索中改變。

3.6. 實作不能對 thenable 鏈的深度做隨意的限制。假設在遞迴上給隨意的限制將會是無窮遞迴。只有在出現無窮循環時送出 `TypeError` ，若真的遇到 thenable 無限練，那永遠遞迴是正確的行為。

初次翻譯，有任何翻譯不好的地方請留言，謝謝！