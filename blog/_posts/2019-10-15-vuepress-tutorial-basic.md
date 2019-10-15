---
title: Vuepress 建立有趣的個人部落格 - 基本介紹
tags: 
  - vue
date: 2019-10-14
author: Nono
location: Kaohsiung
summary: 簡單介紹一下 Vuepress
cover: https://i.imgur.com/RKNJLEv.jpg
---

::: slot header
# Vuepress 建立有趣的個人部落格 - 基本介紹
:::

這個部落格使用了 vuepress 來建構，紀錄一下建構時遇到的一些問題。

會選擇使用 vuepress 是因為平常開發也都是用 Vue，想說看能不能弄出一些比較特別的 Blog 功能，因為 Vuepress 可以在 Markdown 中嵌入 Vue component，我覺得很酷所以就選擇他了XD

Vuepress 背後是透過 vue、vue-router、webpace 來做運行，所以熟悉這些技術的話可以輕鬆的寫一個自己的 plugin or theme，目前我看是滿多 plugin 能夠使用，如 GA、PWA 相關的，但是 blog 的 theme 相對來說真的算滿少的。

下圖官方推薦的清單。真的... 好少 QQ
![](https://i.imgur.com/ISjvSMT.png)

跟其他像是 Gatsby、Hexo 比起來應該少太多了。不過沒關係，資源雖然少但是可能從我們開始打造XD

所以最後決定只好自己也寫一個了！！

## 基本使用
基本上如果你今天只是想把 markdown 文件，找個地方塞上去，vuepress 真的非常簡單。

1. 創一個新的資料夾 `mkdir [new folder]`
2. 初始化 npm `init npm`
3. 安裝 vuepress `npm install vuepress -D`
4. 建立 docs 資料夾來放你的 README.md `mkdir docs`
5. 建立一個 README.md `echo "# My first vuepress" > ./docs/README.md`
6. 使用 vuepress 開發模式 `npx vuepress dev docs`
7. 使用瀏覽器連到 localhost:8080 就能開始編寫囉！此時儲存 README.md 就會即時更新到頁面上囉！  
![](https://i.imgur.com/dFw83xX.png)
以上弄完就能很快速的弄好一個顯示文件的靜態網站囉！  

那剛剛我們使用的都是 vuepress 的開發模式，今天如果我們要把編寫完的文件，發布到網路上呢？  

很簡單~我們只要在 cli 工具下 `npx vuepress build docs` 就可以在 [root]/docs/vuepress/dist 資料夾中找到打包後檔案。這些檔案就是已經把 Markdown 渲染成靜態 html 的檔案了。

可以注意到原始碼裡面的 html 內容是包含剛剛編輯的 Markdown 內容的，SEO 不是問題

![](https://i.imgur.com/lNYbrDy.png)

::: tip
小提醒
`npx vuepress dev docs`
`npx vuepress build docs`
這兩個常用的指令我們可以加到 npm script 裡面，會很方便喔！
:::

## 我想只有這樣還不夠！
上面真的就是基本中的基本，跟著步驟跑完我想你也是對 Vuepress 滿頭問號，老實說我也是。

`vuepress` 厲害的地方，和 vue 很像的一點我覺得是漸進式的，可以玩的細節有很多很多。以下是 `vuepress` 的其他亮點。

* Markdown slot: 可以讓你把 Markdown 的內容切成不同等分來做渲染，可以讓你的文章自由度更高！
* 支援 [YAML front-matter](https://jekyllrb.com/docs/front-matter/): 可以將 Markdown 中一些資料傳遞到靜態網頁上。
* 在 Markdown 上使用 Vue component: 這點滿吸引我的，感覺很有趣。
* 自由的 plugin & theme: 如果你覺得官方提供的不夠多，你也能自己開發並和大家分享。
  * [@vuepress/plugin-google-analytics](https://github.com/vuejs/vuepress/tree/master/packages/%40vuepress/plugin-google-analytics)
  * [@vuepress/plugin-pwa](@vuepress/plugin-pwa)

## 結論
如果你不想花時間自己弄個人 Blog，想快速有漂亮的 Blog 的話，我自己建議是不要用 Vuepress 會比較好，原因是已經寫好可選的 `theme` 比較少一些。

但如果你想要體驗使用 `Vue` 來驅動 Blog 的一切，或是你常寫 Vue component，想要輕鬆地放到 Blog 展示，那你就可以考慮使用 `vuepress` 來開發你自己個 Blog 呦！