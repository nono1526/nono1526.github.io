---
title: '[筆記] JavaScript 中的 Plain Object'
tags:
  - js
date: 2020-03-09
author: Nono
location: Kaohsiung
summary: 探索 JavaScript 中的 Plain Object
cover: https://i.imgur.com/gVg6XN6.png
---

::: slot header
# [筆記] Javascript 中的 Plain Object
:::

## 前言
前陣子在看 Vue 源碼時，看到了 Vue 的 utils 有一個 `isPlainObject` 的方法。

所以想說來一探 Javascript Plain Object，結果發現根本如泥沼一般啊 XD

## 快速導覽
* JS Plain Object 定義
    * 使用 typeof 來最初步的判斷
    * 原形鍊判斷
    * Object.prototype.toString
## JS Plain Object 定義
到底 Plain Object 是什麼呢？

上網查詢後的得到的結論眾說紛紜，每個人給出的答案都不盡相同。

以下兩個是常見 `isPlainObject` 做法。

* 使用 typeof 來最初步的判斷
* 產生出來的 object 的 protype 要是 `Object.prototype`
* 透過 `Object.prototype.toString` 得到 `[object {tag}]`
### 使用 typeof 來最初步的判斷
我們知道 JS 裡的一個眾所皆知的大笑話 `typeof null === 'object'`。

但其實 `typeof` 還是滿有用的，能夠讓我們初步的判斷你的 Object 是不是真的長得像 Object XD。

```javascript
// lodash isObjectLike
function isObjectLike(value) {
  return typeof value === 'object' && value !== null
}
```


但一直都沒有改掉這個，也許也永遠不會～
### 產生出來的 object 的原形要是 `Object.prototype`

最簡單的判斷 Plain Object 也就是只要是透過 `object iterator` 也就是 `{}`，或是使用 `new Object` 來產生的 object 都先統稱為 Plain Object。

如果是透過 function 建立的 object 我們就不稱他為 Plain Object。

範例
``` javascript
// Plain Object
const foo = new Object
const bar = {}

// Not Plain Object
function Foobar () {}
const foobar = new Foobar
```


到這邊簡單我們整理出基本款 isPlainObject 的做法，看看兩者差異就可以了。
* Plain Object
    * foo、bar 的 `prototype` 為 `Object.prototype`
    * foobar 的 `prototype` 為 `Foobar.prototype`

這邊我們透過 `Object.getPrototype` 來找到物件的原型。
``` javascript
// Plain Object
const foo = new Object
const bar = {}

console.log(Object.getPrototypeOf(foo) === Object.prototype)

// Not Plain Object
function Foobar () {}
const foobar = new Foobar

console.log(Object.getPrototypeOf(foobar) !== Object.prototype)
```

到這邊其實就是最簡單的 Plain Object 的判斷囉！

這也是 lodash 的實作。

但其實有一些小小得不同，這邊拿出來看看。

#### `Object.create(null)`
透過 `Object.create(null)` 這個方法能夠做出一個原形為 `null` 也就是沒有原型的 `object`。

常常被用在製作單純的 Key - Value Mapping。

這個方式產生了 object，照我們上面透過 `Object.getPrototypeOf` 是無法成為 plain object 的 (因為他的 prototype 不是 Object.prototype 嘛！)。

有趣的是像是 lodash、JQuery 這邊把它當成是 plain object。

但也有一些人寫出來的 `isPlainObject` 是把 `Object.create(null)` 判斷成 `false`。

如：[is-plain-object](https://www.npmjs.com/package/is-plain-object)

若有用到可能要特別注意一下。
### 透過 `Object.prototype.toString` 得到 `[object {tag}]`

`Object.prototype.toString` 也就是 `Vue.js` 底層函式 `isPlainObject` 的用法。

若把 Plain Object 丟進 `Object.prototype.toString` 會回傳一個 `[object Object]`

```javascript
function isPlainObject (obj) {
    return Object.prototype.toString.call(obj) === '[object Object]'
}
isPlainObject({}) // true
isPlainObject(new Object) // true
isPlainObject(Object.create(null)) // true
isPlainObject(true) // [object Boolean] false
isPlainObject('') // [object String] false
isPlainObject([]) // [object Array] false
```

到這邊看許多人都使用 `Object.prototype.toString` 來判斷。

那到底為什麼是 `Object.prototype.toString` 這個看起來完全和判斷型別八竿子打不著的函數！

到這邊其實直接找 ECMAScript spec 的是最快的
> [19.1.3.6Object.prototype.toString ( )](https://www.ecma-international.org/ecma-262/10.0/index.html#sec-object.prototype.tostring)
> ![](https://i.imgur.com/aWTNxPL.png)

簡單解釋一下 ecma 定義了什麼
一起看一下做了什麼事...
1. undefined 回傳 [object Undefined]
2. null 回傳 [object Null]
3. 設 O 為  ToObject(this value) `let O = ToObject(this value)`
4. 透過 `isArray(O)` 判斷是 array，使 `builtinTag` 為 ``"Array"``
5. 如果 O 是 exotic object, 回傳 String ，使 `builtinTag` 為 ``"String"``
6. 如果 O 有 [[ ParameterMap ]], ，使 `builtinTag` 為 ``"Arguments"``
7. 如果 O 有 [[ Call ]], ，使 `builtinTag` 為 ``"Function"``
8. 如果 O 有 [[ ErrorData ]], ，使 `builtinTag` 為 ``"Error"``
9. 如果 O 有 [[ BooleanData ]], ，使 `builtinTag` 為 ``"Boolean"``
10. 如果 O 有 [[ NumberData ]], ，使 `builtinTag` 為 ``"Number"``
11. 如果 O 有 [[ DateValue ]], ，使 `builtinTag` 為 ``"Date"``
12. 如果 O 有 [[ RegExpMatcher ]], ，使 `builtinTag` 為 ``"RegExp"``
13. 如果都不是以上，使 `builtinTag` 為 ``"Object"``
14. Get 找看看 O 有沒有 `@@toStringTag` 存到 tag 中
15. 如果 Type(tag) 不是 String 則 builtinTag = tag
16. 回傳 string-concatenation `"[object tag]"`

其實講了那麼多，`Object.prototype.toString` 透過 `內部` 的檢查，回傳 [object (型態)]。

其實這樣看下來，上面的 `13.` 以前都可以很好理解是在判斷內部的型態，但 `14.` 後又是在做什麼呢。

我們可以透過這個 [table](https://tc39.es/ecma262/#table-1) 找到其實上面寫的 `@@toStringTag` 就是 `Symbol.toStringTag`。

代表我們可以透過 `Symbol.toStringTag` 來變更 ``[object Tag]`` 的結果！



```javascript
const foo = {}
foo[Symbol.toStringTag] = 'foo'

console.log(Object.prototype.toString.call(foo)) // '[object foo]'
```

#### 小結
1. `typeof(obj) === 'object' && typeof(obj) !== null`  來找到 ObjectLike 的 Object
2. `Object.getPrototypeOf(obj) === Object.prototype` 之類的方式判斷原型是否為 Object.prototype
3. 透過 `Object.prototype.toString` 取得 Tag 來判斷 Object

這邊我們看完了三種基本的 isPlainObject，再來我們可以看看各個大框架的實作啦。

### 各種 Library 實作

#### [lodash](https://github.com/lodash/lodash/blob/aa1d7d870d9cf84842ee23ff485fd24abf0ed3d1/isPlainObject.js)
lodash 看起來就是
`1. isObjectLike`
`2. 原形鍊判斷`
`3. getTag === [object Object]`

![](https://i.imgur.com/9wTBxZv.png)
#### [Vue](https://github.com/lodash/lodash/blob/master/isPlainObject.js)
vue 的話就只有用到
`3. Object.prototype.toString`

#### [JQuery](https://github.com/jquery/jquery/blob/4592595b478be979141ce35c693dbc6b65647173/src/core.js)
JQuery 其實在 Document 有定義 Plain Object
> ![](https://i.imgur.com/qrxx8xO.png)

但我們直接看原始碼
![](https://i.imgur.com/YW0mJ48.png)
JQ 這邊前面是用了 `2.`
再來額外判斷 prototype 是否為 `null` (Object.create(null)) 情境

最後的 `return Ctor === 'function' && fnToString.call(Ctor) === ObjectFunctionString`，是透過判斷傳入的 object 的 `constructor` 是否和 Object 相圖，所以感覺像是變形的 `2.` 吧。

話外題： JQuery 的 `ObjectFunctionString`，可以去追蹤一下過程，感覺滿神奇的XD (默默踩到另外一個水坑)

### [Redux](https://github.com/reduxjs/redux/blob/9d3273846aa8906d38890c410b62fb09a4992018/src/utils/isPlainObject.ts)
基本上是採取 `1.` + `2.` 
但這邊有一些有趣的討論可以看看～https://www.zhihu.com/question/299783862
## 結論
Javascript Plain Object 基本上來說就是透過 `new Object` 或是 `{}` 定義出來的物件。

但各個框架的實作可能略有差異，若被雷到請詳細閱讀原始碼 XD

### 參考資料
> stackoverflow isplainobject-thing
> https://stackoverflow.com/questions/18531624/isplainobject-thing
> ECMAScript