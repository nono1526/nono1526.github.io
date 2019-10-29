---
title: Vue 原始碼：整理 Prototype & Global
tags: 
  - vue
date: 2019-10-29
author: Nono
location: Kaohsiung
summary: 從 Vue 原始碼中學習，整理 Vue Prototype & Global
cover: https://i.imgur.com/tD06euo.jpg
---

::: slot header
# Vue 原始碼：整理 Prototype & Global
:::

整理 Vue runtime，Vue 原形鍊上的方法以及 Global 方法。版本是 2.6.10。  

以下是有對 Vue prototype & Global 有做更動的檔案
1. web/entry-runtime.js
2. web/runtime/index.js
3. core/index.js
4. core/instance/index


## 從 core/instance/index 出發，一步一步的來看加了什麼
![](https://i.imgur.com/K27poSX.png)

### initMixin
* `Vue.prototype._init`
Vue Constructor 第一個呼叫的 method，主要做 Options 各種格式化。

![](https://i.imgur.com/moQhysk.png)

### stateMixin
* Vue.prototype.$data
* Vue.prototype.$props
* Vue.prototype.$set
* Vue.prototype.$delete
* Vue.prototype.$watch
### eventsMixin
* Vue.prototype.$on
* Vue.prototype.$once
* Vue.prototype.$off
* Vue.prototype.$emit
### lifecycleMixin
* Vue.prototype._update
* Vue.prototype.$forceUpdate
* Vue.prototype.$destroy
### renderMixin
* Vue.prototype.$nextTick
* Vue.prototype._render
* Vue.prototype.一堆renderHelper
![](https://i.imgur.com/6RRGdmm.png)
### initGlobalAPI
* Vue.config
* Vue.util
    * Vue.util.warn
    * Vue.util.extend
    * Vue.util.mergeOptions
    * Vue.util.defineReactive
* Vue.set
* Vue.delete
* Vue.nextTick
* Vue.observable (2.6)
* Vue.options
    * Vue.options._base (指向 Vue 建構函數)
    * Vue.options.components
        * Vue.options.components.KeepAlives
    * Vue.options.directives
    * Vue.options.filters
* Vue.use
* Vue.mixin
* Vue.extend
* Vue.component
* Vue.directive
* Vue.filter

### core/index
* Vue.prototype.$isServer
* Vue.prototype.$ssrContext
* Vue.FunctionalRenderContext

### runtime/index
* Vue.config.mustUseProp
* Vue.config.isReservedTag
* Vue.config.isReservedAttr
* Vue.config.getTagNamespace
* Vue.config.isUnknownElement
* Vue.options.directives (./directives/index)
    * Vue.options.directives.model
    * Vue.options.directives.show
* Vue.options.components (./components/index)
    * Vue.options.components.Transition
    * Vue.options.components.TransitionGroup
* Vue.prototype.__patch__
* Vue.prototype.$mount

## 其他
### build
Vue 使用 rollup 來做打包工具，因為要打包出來相依不同的環境，所以有很多不同的 entry。
有興趣可以參考 [官網說明](https://vuejs.org/v2/guide/installation.html#Explanation-of-Different-Builds)
![](https://i.imgur.com/hWuQHUx.png)  
此外，還有為了支援 server side render、weex(mobile)，也做了不同的處理。
設計成這樣一層又一層加上去的設計，增加了 Vue prototype 的彈性，能在相容上做更多變化。