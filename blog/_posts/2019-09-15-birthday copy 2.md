---
title: HTML5 Drag and Drop clone trello
tag: js
date: 2019-10-01
author: Nono
location: Kaohsiung
summary: HTML5 Drag and Drop clone trello
cover: https://i.imgur.com/PEO0BSk.jpg

---

# 【Vue-clone-trello】 Vue.js 結合 HTML Draggable API
![](https://i.imgur.com/VdLCcBT.png)
## 接續前篇 [玩玩 HTML Draggable API](https://medium.com/@nono1102137211/%E7%8E%A9%E7%8E%A9-html-draggable-api-ee9dddd1f88f)
![](https://media.giphy.com/media/3EiWgNT3YPYkXXhNoP/giphy.gif)

## 目標
我們的目標是做一個像 Trello 那樣能夠自由拖曳的清單。
並使用 Vue.js 來完成這個專案，那可以完成的方案大致上有下面兩種：

### 直接使用別人寫好的套件
去 Google Vue.js draggable 可以找到別人直接做好的套件來使用。
使用方便，也不用去理解原生 Draggable API 怎麼用，可以很快上手，且 Github 星星數滿高的，比較多人使用。
> [Vue.Draggable](https://github.com/SortableJS/Vue.Draggable) 把 sortable.js 包成 Vue Components 的用法。

### 自己動手造輪子
想要理解原生做法當然就是自己動手去處理原生 Draggable API 囉！  

實作方法也有很多種：
1. 直接使用 Vue.js 準備的 `Event Handlers` `v-on` 
2. Vue.js 的自訂指令 `directive`

## 直接使用 Vue.js 準備的 `Event Handlers` 
這篇主要使用 Vue.js 準備的 directive 來達到拖拉的效果。  

為了能夠做出像是 Trello 這樣的拖拉清單，我們在上次簡單入門了 HTML Draggable API，了解了 Drag and Drop 的基本使用。  

接著我們將這個概念套用到 Vue.js 中，利用 Vue.js 所提供的事件處理器 `v-on` 來達到我們所想要的目的。

## 事件處理 Event Handlers `v-on`
這邊就不再介紹 Vue.js 事件的使用了。直接來看看我們可以用哪些事件。

* `v-on:drag`
* `v-on:drop`
* `v-on:dragstart`
* `v-on:dragend`
* `v-on:dragover`
* `v-on:dragexit`
* `v-on:dragleave`
* `v-on:drop`
* 
基本上原生有的 Vue.js 就都幫我們處理好囉！
## 重點紀錄
### 資料格式
#### 欄 (Arrary)
欄裡面的資訊卡：使用物件儲存起來，分別有：
* id: 識別用
* text: 文字
* dragging: 是否正被拖曳
* editable: 是否為編輯狀態
```javascript
listItemsFirst: [{
      id: 1,
      text: 'React',
      dragging: false,
      editable: false
    }, {
      id: 2,
      text: 'Vue',
      dragging: false,
      editable: false
    }, {
      id: 3,
      text: 'angular',
      dragging: false,
      editable: false
    }]
```
#### 暫存正在被拖曳的資訊卡
拖曳中的相關資訊
* from: 從哪個欄位來的
* to: 要到哪個欄位
* item: 拖曳中的資訊卡物件
```javascript
draggingInfo: {
  from: '',
  to: '',
  item: {}
}
```
### dragstart 事件
當資訊卡被拖曳時，觸發 dragstart 事件，紀錄是從哪個欄位來的和目前使用的資訊卡物件。
HTML
```stylus

  .a
    color red
    text-size 10px
```
Javascript
```javascript
dragInfoStart (args, from, dragItem) {
  this.draggingInfo.from = from
  this.draggingInfo.item = dragItem
  dragItem.dragging = true
}
```
### dragenter 事件
這裡利用 dragenter 事件，當使用者將資訊卡拖曳進入 list 時，就將 Block 移動到另一個位置中，讓效果看起來更加及時。

Javasript 中則需注意，若想將原生 JS 事件和自訂的參數傳入，就可以在 `v-on` 使用 `arguments` 參數，來讓原生事件和自訂參數一起被帶入。

像這樣 `@dragenter="dragEnter(arguments, 'listItemsFirst')"`

HTML 
```html
<ul
  class="card__list"
  @drop="dropInfo(arguments, 'listItemsFirst')"
  @dragover.prevent
  @dragenter="dragEnter(arguments, 'listItemsFirst')"
>
    <info-block>
        ...
    </info-block>
</ul>
```
Javascript
```javascript
dragEnter (args, to) {
  this.draggingInfo.to = to
  const [dragEvent] = args
  if (!dragEvent.target.className.includes('v-info')) return
  dragEvent.preventDefault()
  const nodeList = [...dragEvent.path[1].childNodes]
  const dropNode = dragEvent.path[0]
  // 找到目前拖曳所在位置
  const insertIndex = nodeList.indexOf(dropNode)
  const { item, from } = this.draggingInfo
  this[from] = this[from].filter(card => card.id !== item.id)
  // 插入到所在位置
  this[to].splice(insertIndex, 0, item)
  // 因為使用者還沒有放開資訊卡，所以需把最後的欄位在紀錄起來！
  this.draggingInfo.from = to
}
```
### drop 事件
這邊不要忘記把原生 dragover 動作拿掉 `@dragover.prevent`，才能正常觸發 drop 事件喔！  

drop 要做的事情其實比較少，因為都在 dragenter 做完了！  

所以只需要把 `dragging` 狀態改為 `false` 就行了！
```javascript
dropInfo (args, to) {
  this.draggingInfo.item.dragging = false
}
```

## 相關連結
相關程式碼可以參考我的 [Github](https://github.com/nono1526/vue-clone-trello/blob/master/src/App.vue)
