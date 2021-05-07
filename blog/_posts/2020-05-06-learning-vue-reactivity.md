---
title: '[深入了解 Vue] 學習 Vue2 響應式原理，並實作簡易版本'
tags:
  - js
  - vue
date: 2021-05-06
author: Nono
location: Taipei
summary: 從 Vue 的原始碼中探討 Vue 是如何做到資料響應式這個功能的，並且做一個簡易的版本
cover: https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Vue.js_Logo_2.svg/1200px-Vue.js_Logo_2.svg.png
---
::: slot header
# [深入了解 Vue] 學習 Vue2 響應式原理，並實作簡易版本
:::
從 Vue 的原始碼中探討 Vue 是如何做到資料響應式這個功能的，並且做一個簡易的版本。

Vue.js 資料響應式這個部分，Vue 3 是使用 `Proxy` 來實作，而 Vue 2 版本是使用 `Object.defineProperty` 來實作的，這邊主要是探討 Vue2 版本的做法。

## 資料的響應式是什麼

其實用白話來說，就是資料變動了，然後畫面就一起跟著變動。

先從一個簡單的 Vue 例子來看看資料響應：

```javascript
const component = new Vue({
	template: `
		<div>{{ name }}</div>
	`,
  data: {
		name: 'Nono'
	}
})
```

當我們改變 [`component.name`](http://component.name) 時，會讓 template 中的 `{{ name }}` 被改變。

可以說 `name` 就是被 Vue 用某個方法監控起來，只要 `name` 被改變，Vue 這邊就會改變畫面上的顯示。

我們也可以說這個被監控的過程就是 Vue 的資料響應。

## 怎麼做到的？

應該可以猜到在 new Vue 時，這些 data 被 Vue 的某些事，我們直接去 Github Clone Vue 原始碼下來了解一下 (建議去 Fork 一份到自己的 Repo)，方便自己做一些更動。

再來我們要看的版本是 2.6 版，才會是用 `defineProperty` 來實作。

### state.js - initData

可以從 Vue 的 `src/core/instance/state.js` 中找到 `initData (112 行)` 的 function，這裡可以看到 Vue 對 data option 做了哪些事情。

看下來做了一堆檢查後，最後做了：

`observe(data, true /* asRootData */)`

### observe/index.js - observe

持續追蹤到 `src/core/observer/index.js` 這個檔案

`observe` 這個 function 最後就是 `new Observer(data)`，而在 `Observer` 的 `constructor` 中，可以看到，最後是把 data 丟到 `walk` 這個 function 裡面，然後把每個 data 中的值，都透過 `defineReactive`，到 `defineReactive` 這邊，我們就可以看到 `Object.defineProperty` 了。

到目前總結 data 被傳遞的 function stack。

![vue reactivity function stack](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/c48c745b-92f8-4e82-9949-960c425be289/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAT73L2G45O3KS52Y5%2F20210507%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20210507T013348Z&X-Amz-Expires=86400&X-Amz-Signature=8fc137243e42f2e73f2de32b40a854b4bf07e952b0a65f7dbf3f020d845bad7e&X-Amz-SignedHeaders=host&response-content-disposition=filename%20%3D%22Untitled.png%22)

### `defineReactive`

再來看看 defineReactive 裡頭做了些什麼，這時候我們可以知道，data 中所有的 property 都會被 `defineReactive` 所執行。

其實主要做的就是利用 `Object.defineProperty` 設定 property 的 `getter` 和 `setter`。

可以簡化成這樣：

```javascript
Object.defineProperty(obj, key, {
	enumerable: true,
  configurable: true,
	get () {
		return val
	},
	set (newVal) {
		val = newVal
	}
})
```

你看到這邊應該想說，這樣不就和一般 object get、set 一樣嗎？

沒錯，所以再仔細看看原始碼裡頭有使用到一個 dep 的 這個 Dep 的 instance，這個 dep 就是依賴追蹤的核心。接下來我們一起看看 Dep 做了哪些事情。

看到這邊你可能聽過 Vue 響應式原理的核心 - **依賴追蹤**，就是待會會講到的 Dep，沒聽過沒關係，我們繼續看下去。

我們先別管 Dep 做了些什麼，我們先來想想當我們可以在拿到資料 (get)、和設定資料 (set) 的時候做些什麼，那我們應該可以做下面這些事情。

```javascript
Object.defineProperty(obj, key, {
	enumerable: true,
  configurable: true,
	get () {
		// 這裡先把之後有人要更改我值要做的事情存起來，可能就是某些函數
		// 可能有哪些事？
		// 重繪畫面 (render)
    // 利用這個新值做某些事情 (watch, computed)
		return val
	},
	set (newVal) {
		val = newVal
		// 這裡依據新的值，執行剛剛儲存起來的函數 (render, watch, computed)
	}
})
```

### dep.js - Dep
`src/core/observer/dep.js`  
Dep 就是一個觀察者模式中的訂閱者，裡面可以註冊多個 subs (發佈者)，我先把 vue 裡面實作先簡化成以下這樣。

值得注意的是，因為 `defineProperty` 那邊沒辦法丟進傳進參數，所以是使用 `Dep` 的 static 來存放目前正在被處理的 `target`。

```javascript
class Dep {
	static target // 需要儲存目前 target 的 sub
	constructor () {
		this.subs = [] // 可註冊多個事件
	}
	addSub (sub) {
		// 新增 sub	
		this.subs.push(sub)
	}
	notify () {
		// 更新所有 sub
		const subs = this.subs.slice()
		for (let i = 0, l = subs.length; i < l; i++) {
      subs[i].update()
    }
	}
}
```

每個 sub 可以先簡單想像會有一個 `update` 的 function 是 callback，像是更新畫面之類的 function。

```javascript
class Watcher {
	constructor (key, callback) {
		this.update = callback
		this.key = key
	}
}
```

接下來我們回到 `defineReactive`，並加入 `Dep`。

```javascript
function defineReactive (obj, key, val) {
	const dep = new Dep()

	Object.defineProperty(obj, key, {
		enumerable: true,
	  configurable: true,****
		get () {
			if (Dep.target) {
				dep.addSubs(Dep.target)
			}
			
			return val
		},
		set (newVal) {
			val = newVal
			dep.notify()
		}
	})
}
```

這邊有兩個值得注意的部分：

1. [Dep.target](http://dep.target)
2. 閉包

看到這裡你應該會想知道 [Dep.target](http://dep.target) 到底從哪裡被設值的，這邊 Vue 是有更複雜一點的設計，來應付 watch、computed、render template 的依賴。這邊我們只是想先瞭解怎麼去 render template 的，所以就先簡單寫一個 `render template` 的 function 當作 `sub` 的 watcher，並且試著讓他能夠依據 data 的改變被追蹤。

再來就是你會發現每個透過  `defineReactive` 都會產生閉包，每個閉包裡有自己的 dep instance。

這邊我們就簡單舉例：Dep.target 是會更新畫面的依賴，程式碼可能是像這樣如下。

```javascript
// render 畫面
function updateTemplate (key) {
  const div = document.createElement('div')
  div.innerHTML = this[key]
  console.log('render')
  el.appendChild(div)
}

defineProperty(obj, key, val)
const renderWatcher = new Watcher(key, updateTemplate) // 想像這是一個會重繪畫面的 watcher
Dep.target = renderWatcher // 這裡指定了正處理的 Dep
data[key] // 這裡是為了觸發 data[key] 的 getter 來收集依賴
Dep.target = null // 做完了把 Dep.target 清掉
```

上面其實也可以把 `data[key]` 直接改成呼叫 updateTemplate，因為 updateTemplate 中也會去觸發 `data[key]` 的 getter。

```javascript

// render 畫面
function updateTemplate (key) {
  const div = document.createElement('div')
  div.innerHTML = this[key]
  console.log('render')
  el.appendChild(div)
}

// 對依賴進行追蹤
defineProperty(data, 'name', data['name'])
const renderWatcher = new Watcher('name', updateTemplate)

Dep.target = renderWatcher

// 這裡會剛好觸發 getter
updateTemplate.call(data, 'name')
Dep.target = null // 避免之後每次 getter 都收集依賴
// 結束
```

## 實作

最後做一個超級簡易版本的畫面響應來做為結束。

```javascript
const data = {
  name: 'Nono'
}

const el = document.querySelector('#app')

// render 畫面
function updateTemplate (key) {
  const div = document.createElement('div')
  div.innerHTML = this[key]
  console.log('render')
  el.appendChild(div)
}

function defineProperty (obj, key, val) {
  const dep = new Dep()
  
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get () {
      console.log('getter')
      
      if (Dep.target) {
        dep.addSubs(Dep.target)
      }
      return val
    },
    set (newVal) {
      val = newVal
      dep.notify()
    }
  })
}

class Dep {
  static target
  constructor () {
    this.subs = []
  }
  addSubs (sub) {
    this.subs.push(sub)
  }
  notify () {
    const subs = this.subs.slice()
    for (let i = 0, l = subs.length; i < l; i++) {
      console.log('notify')
      subs[i].update()
    }
  }
}

class Watcher {
  constructor (key, callback) {
    this.update = callback.bind(data, key)
    this.key = key
  }
}

// 對依賴進行追蹤
defineProperty(data, 'name', data['name'])
const renderWatcher = new Watcher('name', updateTemplate)

Dep.target = renderWatcher

console.log('這裡會剛好觸發 getter')
// 這裡會剛好觸發 getter
updateTemplate.call(data, 'name')
Dep.target = null // 避免之後每次 getter 都收集依賴
// 結束

// 試著去修改 data.name 看看畫面有沒有增加
data.name = 'Dica'
data.name = 'Cindy'
```

[https://codepen.io/nono1526/pen/gOmOXNW](https://codepen.io/nono1526/pen/gOmOXNW)

## 總結

實際上 Vue 裡面的 watch、computed 也是透過這個依賴追蹤的機制來實現的，Vue 在這邊將這部分的程式碼共用的很好，但如果直接去閱讀 source code 會因為牽扯到要用到其他部分，所以比較難閱讀，所以這次我們就主要 focus 在依賴追蹤這部分。

最後我們學習了：

1. Vue 透過 Object.defineProperty 設定 getter、setter & 閉包來實現資料的 Reactive
2. Vue 使用觀察者模式來收集和執行依賴

之後再來看看 watch、computed 這兩個是如何實作。